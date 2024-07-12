//"use strict";/*
/*$.response.contentType = "application/json";
var conn = await $.hdb.getConnection();
var query = 'SELECT "MATNR", "MVGR4", "BEZEI" FROM "MM_Seg" WHERE "MVGR4" IS NOT NULL'; //ORDER BY "MATNR"';
var rs = await conn.executeQuery(query);
$.response.contentType = "application/json";
var body = "";
body = $.response.setBody(JSON.stringify(rs));
$.response.status = $.net.http.OK;
await conn.close();
export default {conn,query,rs};*/

var aCmd = $.request.parameters.get('dataobject');
var data = JSON.parse(aCmd);
$.response.contentType = "application/json";
var conn = await $.hdb.getConnection();

var query = 'SELECT "MATNR", "MVGR4", "BEZEI" FROM "MM_Seg" WHERE "MATNR" = ?';
var rs = await conn.executeQuery(query, [data]);
$.response.contentType = "application/json";
var body = "";
body = $.response.setBody(JSON.stringify(rs));
$.response.status = $.net.http.OK;
await conn.close();
export default {
	conn,
	query,
	rs
};