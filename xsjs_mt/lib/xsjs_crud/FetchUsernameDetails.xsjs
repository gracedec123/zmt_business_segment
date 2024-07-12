var conn = await $.hdb.getConnection();

var query = "SELECT CURRENT_USER FROM \"DUMMY\"";  
var rs = await conn.executeQuery(query);
var currentUser = rs[0].CURRENT_USER;

query = "SELECT SESSION_CONTEXT('APPLICATIONUSER') \"APPLICATION_USER\" FROM \"DUMMY\"";  
rs = await conn.executeQuery(query);
var applicationUser = rs[0].APPLICATION_USER;

var greeting = {XS_Layer_Session_User: $.session.getUsername(), 
			Database_Current_User: currentUser, 
			Database_Application_User: applicationUser};


$.response.contentType = "application/json";
$.response.setBody(JSON.stringify(greeting));
$.response.status = $.net.http.OK;
await conn.close();
export default {conn,query,rs,currentUser,applicationUser,greeting};