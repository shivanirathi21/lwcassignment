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
    connectedCallback(){
        getJsonList()
        .then(result => {
            this.jsonList = result;
            this.jsonListSize = this.jsonList.length;
        })
        .catch(error => {
            this.error = error;
        });
    }
    calculateTotalBalance(){
        this.balanceTotal = 0;
        this.jsonSelectedList.forEach(element => {
            this.balanceTotal = this.balanceTotal + parseInt(element.balance);
        });
    }
    handleRowSelection(event){
        const selectedRows = event.detail.selectedRows;
        this.selectedRows = selectedRows.length;
        this.jsonSelectedList = selectedRows;
        this.calculateTotalBalance();
    }
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