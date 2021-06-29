public class FetchJsonDataController {
    @AuraEnabled(cacheable = true)
    public static List<wrapperClass> fetchJsondata(){
        HttpRequest req = new HttpRequest();
        req.setEndpoint('https://raw.githubusercontent.com/StrategicFS/Recruitment/master/data.json');
        req.setMethod('GET');
        Http http = new Http();
        HTTPresponse res= http.send(req);
        string response = res.getBody();
        List<wrapperClass> wrapperLines = (List<wrapperClass>)JSON.deserialize(res.getBody(), List<wrapperClass>.class);
        return wrapperLines;
    }
    public class wrapperClass {
     @AuraEnabled public String id {get;set;}
     @AuraEnabled public String creditorName {get;set;}
     @AuraEnabled public String firstName {get;set;}
     @AuraEnabled public String lastName {get;set;}
     @AuraEnabled public String minPaymentPercentage {get;set;}
     @AuraEnabled public String balance {get;set;}
    }
   
}