//"use strict";
var conn = await $.hdb.getConnection();
var query = 'SELECT  "MATNR", "MAKTX", "SOLD_TO", "SOLD_TO_DESC", "MT_SEG_ID", "MT_SEG_DESC", "MARKET_SEG", "LAST_MODIFIED_USER",  ADD_SECONDS("LAST_MODIFIED_TIMESTAMP", -18000) AS "LAST_MODIFIED_TIMESTAMP" FROM "ZMT_Final_data" ORDER BY "MATNR"';
var rs = await conn.executeQuery(query);
$.response.contentType = "application/json";
var body = "";
body = $.response.setBody(JSON.stringify(rs));
$.response.status = $.net.http.OK;
await conn.close();
export default {conn,query,rs};

