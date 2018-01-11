function getAccessToken(credentials) {
  var url = "https://www.wrike.com/oauth2/token";
  var properties = PropertiesService.getScriptProperties();
  var clientid = null;
  var clientsecret = null;
  var refreshtoken = null;
  if(credentials){
    clientid = credentials.clientid;
    clientsecret = credentials.clientsecret;
    refreshtoken = credentials.refreshtoken;
  }else if(properties.getProperty("wrike.accesstoken")){
    return {access_token:properties.getProperty("wrike.accesstoken")};
  }else{
    clientid = properties.getProperty("wrike.clientid");
    clientsecret = properties.getProperty("wrike.clientsecret");
    refreshtoken = properties.getProperty("wrike.refreshtoken");
  }
  var payload = "client_id="+clientid+
    "&client_secret="+
      clientsecret+
        "&grant_type=refresh_token&refresh_token="+
          refreshtoken;
  var headers = {"Accept":"application/json"};
  var options = {"method":"POST","headers":headers,"payload":payload};
  var response = UrlFetchApp.fetch(url, options);
  //Utils.log(getScriptName(),response.getContentText(),"getSessionKey");
  return JSON.parse(response.getContentText());
}

function sendRequest(request,access_key) {
  //Utils.log(getScriptName(),request,"sendRequest");
  var access_token = {access_token:access_key};
  if(access_key == null){
    access_token = getAccessToken();
  }
  var url = "https://www.wrike.com/api/v3"+request.api;
  var properties = PropertiesService.getScriptProperties();
  var payload = serializeObj(request.properties);
  var headers = {"Accept":"application/json","Authorization":"bearer "+access_token.access_token};
  var options = {"method":request.method,"headers":headers};
  if(request.method == "POST" || request.method == "PUT"){
    options = {"method":request.method,"headers":headers,"payload":payload};
  } else {
  /*if(request.method == "GET" || request.method == "DELETE"){*/
    url = url + "?"+payload;
  }
  //Utils.log(getScriptName(),options,"sendRequest");
  var response = UrlFetchApp.fetch(url, options);
  //Utils.log(getScriptName(),response.getContentText(),"sendRequest");
  return JSON.parse(response.getContentText());
}

function serializeObj(obj){
  var str = [];
  for(var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  var retval = str.join("&");
  //Utils.log(getScriptName(),retval,"serializeObj");
  return retval;
}

function test_sendRequest() {
  var request = {api:"/version",method:"GET",properties:{}};
  var response = sendRequest(request);
}

function test_getTasks() {
  var request = {api:"/tasks",method:"GET",properties:{responsibles:"[\"KUAA2IGJ\"]",status:"Active"}};
  var response = sendRequest(request);
}

function test_getFolder() {
  var wrike_folder = "https://www.wrike.com/open.htm?id=106951321";
  var request = {api:"/folders",properties:{permalink:wrike_folder}}
  var response = sendRequest(request);
  Logger.log(JSON.stringify(response));
}