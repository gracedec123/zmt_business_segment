var aCmd = $.request.parameters.get('dataobject');
var data = JSON.parse(aCmd);
var chdatef = data.CHANGEDF;
var chdatet = data.CHANGEDT;
var cdatef = data.CREATEDF;
var cdatet = data.CREATEDT;
$.response.contentType = "application/json";
var conn = await $.hdb.getConnection();
var query = `
   SELECT "MT_KEY", "SOLD_TO", "SOLD_TO_DESC", "MATNR", "MAKTX", "MT_SEG_ID", "MT_SEG_DESC", "MT_SEG_ID_SAP", "MT_SEG_DESC_SAP", "MARKET_SEG", "COMMENTS", "MKT_SIGN", "CREATED_ON", "LAST_MODIFIED_USER", "LAST_MODIFIED_TIMESTAMP"
   FROM "ZMT_Initial_data"
   WHERE "LAST_MODIFIED_TIMESTAMP" BETWEEN TO_DATE(?, 'YYYY-MM-DD') AND TO_DATE(?, 'YYYY-MM-DD') 
     OR "CREATED_ON" BETWEEN TO_DATE(?, 'YYYY-MM-DD') AND TO_DATE(?, 'YYYY-MM-DD')
   `;  
var rs = await conn.executeQuery(query, [chdatef, chdatet, cdatef, cdatet]);
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