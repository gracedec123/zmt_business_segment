var aCmd = $.request.parameters.get('dataobject');
var data = JSON.parse(aCmd);
var chdatef = data.CHANGEDF;
var chdatet = data.CHANGEDT;
var cdatef = data.CREATEDF;
var cdatet = data.CREATEDT;
var key = data.MTKEY;
var cus = data.MTCUS;
var mat = data.MTMAT;
var cusDesc = data.MTCUSDESC;
var matDesc = data.MTMATDESC;
var mtSeg = data.MTSEG;
var com = data.MTCOM;
var usr = data.MTUSR;                         
var sign = data.MSIGNOFF;
var segm = data.MSEGMENT;
$.response.contentType = "application/json";
var conn = await $.hdb.getConnection();
var baseQuery =
	`
 SELECT "MT_KEY", "SOLD_TO", "SOLD_TO_DESC", "MATNR", "MAKTX", "MT_SEG_ID", "MT_SEG_DESC", "MT_SEG_ID_SAP", "MT_SEG_DESC_SAP", "MARKET_SEG", "COMMENTS", "MKT_SIGN", "CREATED_ON", "LAST_MODIFIED_USER", "LAST_MODIFIED_TIMESTAMP"
 FROM "ZMT_Initial_data"
 WHERE 1=1
`;
var queryParams = [];
// Check and add conditions dynamically
if (key && key !== '') {
	baseQuery += ' AND "MT_KEY" = ?';
	queryParams.push(key);
}
if (cus && cus !== '') {
	baseQuery += ' AND "SOLD_TO" = ?';
	queryParams.push(cus);
}
if (mat && mat !== '') {
	baseQuery += ' AND "MATNR" = ?';
	queryParams.push(mat);
}
if (cusDesc && cusDesc !== '') {
	baseQuery += ' AND TO_VARCHAR("SOLD_TO_DESC") = ?';
	queryParams.push(cusDesc);
}
if (matDesc && matDesc !== '') {
	baseQuery += ' AND TO_VARCHAR("MAKTX") = ?';
	queryParams.push(matDesc);
}
if (mtSeg && mtSeg !== '') {
	baseQuery += ' AND TO_VARCHAR("MARKET_SEG") = ?';
	queryParams.push(mtSeg);
}
if (com && com !== '' && com !== "=") {
	baseQuery += ' AND TO_VARCHAR("COMMENTS") = ?';
	queryParams.push(com);
} else {
	if (com === "=") {
		baseQuery += ' AND TO_VARCHAR("COMMENTS") IS NULL';
	}
}

if (usr && usr !== '') {
	baseQuery += ' AND TO_VARCHAR("LAST_MODIFIED_USER") = ?';
	queryParams.push(usr);
}
if (segm && segm !== '') {
	baseQuery += ' AND "MT_SEG_ID_SAP" = ?';
	queryParams.push(segm);
}
if (sign && sign !== '' && sign !== "=") {
	baseQuery += ' AND TO_VARCHAR("MKT_SIGN") = ?';
	queryParams.push(sign);
} else {
	if (sign === "=") {
		baseQuery += ' AND TO_VARCHAR("MKT_SIGN") IS NULL';
	}
}
if (chdatef && chdatef !== '' && chdatet && chdatet !== '') {
	baseQuery += ' AND "LAST_MODIFIED_TIMESTAMP" BETWEEN TO_DATE(?, \'YYYY-MM-DD\') AND TO_DATE(?, \'YYYY-MM-DD\')';
	queryParams.push(chdatef, chdatet);
}
if (cdatef && cdatef !== '' && cdatet && cdatet !== '') {
	baseQuery += ' AND "CREATED_ON" BETWEEN TO_DATE(?, \'YYYY-MM-DD\') AND TO_DATE(?, \'YYYY-MM-DD\')';
	queryParams.push(cdatef, cdatet);
}
var rs = await conn.executeQuery(baseQuery, queryParams);
$.response.contentType = "application/json";
$.response.setBody(JSON.stringify(rs));
$.response.status = $.net.http.OK;
await conn.close();
export default {
	conn,
	baseQuery,
	rs
};