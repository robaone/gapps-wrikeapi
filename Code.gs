function doGet(request) {
  var html = HtmlService.createTemplateFromFile("test.html");
  html.data = {request:request,email:Session.getActiveUser().getEmail()};
  html = html.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME);
  //Utils.log(getScriptName(),JSON.stringify(request));
  return html;
}

function getVersion() {
  return sendRequest({method:"GET",api:"/version",properties:{}}).data[0].major;
}

function getScriptName() {
  return "WrikeApi";
}