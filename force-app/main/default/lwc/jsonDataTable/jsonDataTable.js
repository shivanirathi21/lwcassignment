import { LightningElement ,api, wire, track} from 'lwc';
import getJsonList from '@salesforce/apex/FetchJsonDataController.fetchJsondata';

export default class JsonDataTable extends LightningElement {
    @track columns = [{
                        label: 'Creditor',
                        fieldName: 'creditorName',
                        type: 'text',
                        sortable: true
                    },
                    {
                        label: 'First Name',
                        fieldName: 'firstName',
                        type: 'text',
                        sortable: true
                    },
                    {
                        label: 'Last Name',
                        fieldName: 'lastName',
                        type: 'text',
                        sortable: true
                    },
                    {
                        label: 'Min Payment %',
                        fieldName: 'minPaymentPercentage',
                        type: 'Percent',
                        sortable: true
                    },
                    {
                        label: 'Balance',
                        fieldName: 'balance',
                        type: 'Currency',
                        sortable: true
                    }
                ];

    @track error;

    @track jsonList = [];
    @track jsonSelectedList = [];
    @track jsonListSize;
    @track selectedRows = 0;
    @track balanceTotal = 0;

    //this will be called on load of the component and will fetch the data from the api
    connectedCallback(){
        //apex call to fetch the data and store that to the 
        getJsonList()
        .then(result => {
            this.jsonList = result;
            this.jsonListSize = this.jsonList.length;
            this.calculateTotalBalance();
        })
        .catch(error => {
            this.error = error;
        });
    }

    //to calculate the total balance 
    calculateTotalBalance(){
        this.balanceTotal = 0;
        this.jsonSelectedList.forEach(element => {
            this.balanceTotal = this.balanceTotal + parseFloat(element.balance);
        });
    }

    //this is called when any of the row is marked checked
    handleRowSelection(event){
        const selectedRows = event.detail.selectedRows;
        this.selectedRows = selectedRows.length;
        this.jsonSelectedList = selectedRows;
    }

    //This is called on Add debt button to add a new record
    handleClickAdd(event){
        let newObj = new Object();
        newObj.creditorName = 'Navy FCU';
        newObj.balance = '3000';
        newObj.minPaymentPercentage = '0';
        newObj.lastName = '';
        newObj.firstName = '';
        newObj.id = this.jsonList.length + 1;
        var existingString = JSON.stringify(this.jsonList);
        var addnewdata = existingString.replace('[', '');
        var addnewdataNew = addnewdata.replace(']', '');
        var newdataString = '['+addnewdataNew+','+JSON.stringify(newObj)+']';
        let listdata = [];
        listdata.push(JSON.parse(newdataString));
        this.jsonList = listdata[0];
        this.jsonListSize = this.jsonList.length;
    }

    //This is called from Remove Debt button to delete the records
    handleClickRemove(event){
        this.jsonSelectedList.forEach(element => {
            if(this.jsonList.length > 1){
                this.jsonList = this.jsonList.filter(function (ele) {
                    return ele.id !== element.id;
                });
            }
            else if(this.jsonList.length == 0){
                this.jsonList = [];
            }
        });
        this.jsonListSize = this.jsonList.length;
    }
}