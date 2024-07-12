//"use strict";
var conn = await $.hdb.getConnection();
var query = 'SELECT "MT_ID", "MT_DESC", "MT_SEG", "PROFIT" FROM "ZMkt_Sector" ORDER BY "MT_ID"';

var rs = await conn.executeQuery(query);
$.response.contentType = "application/json";
var body = "";
body = $.response.setBody(JSON.stringify(rs));
$.response.status = $.net.http.OK;
await conn.close();
export default {conn,query,rs};

