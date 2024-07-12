var aCmd = $.request.parameters.get('dataobject');
var data = JSON.parse(aCmd);
$.response.contentType = "application/json";
var conn = await $.hdb.getConnection();

var query = 'SELECT "MT_ID", "MT_DESC", "MT_SEG", "PROFIT" FROM "ZMkt_Sector" WHERE CAST("PROFIT" AS CHAR) = ? LIMIT 1000';
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