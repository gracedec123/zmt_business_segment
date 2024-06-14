var data = $.request.body.asString();
data = JSON.parse(data);

$.response.contentType = "application/json";

try {
	var conn = await $.db.getConnection();

	var aCmd = $.request.parameters.get("cmd");
	switch (aCmd) {
	case "insertupdate":
		await insertUpdateInitial(data);
		break;
	case "insertupdatefinal":
		await insertUpdateFinal(data);
		break;
	case "delete":
		await deleteInitial(data);
		break;
	case "filter":
		await InitialFilter(data);
		break;
	case "save":
		await insertUpdateSave(data);
		break;
	default:
		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		await $.response.setBody("Invalid Request Method");
	}

	// Commit the transaction
	await conn.commit();

} catch (error) {
	// Handle errors appropriately
	$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
	$.response.setBody(JSON.stringify({
		error: error.message
	}));
} finally {
	// Close the connection in the 'finally' block to ensure it's closed even if an error occurs
	if (conn) {
		await conn.close();
	}
}

async function insertUpdateInitial(data) {
	// Use parameterized queries to prevent SQL injection
	var query = 'UPSERT "ZMT_Initial_data" VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) WHERE "MT_KEY" = ?';
	var pstmt = await conn.prepareStatement(query);

	pstmt.setString(1, data.MT_KEY);
	if (data.SOLD_TO != "") {
		pstmt.setString(2, data.SOLD_TO);
	};
	if (data.SOLD_TO_DESC != "") {
		pstmt.setString(3, data.SOLD_TO_DESC);
	};
	if (data.MATNR != "") {
		pstmt.setString(4, data.MATNR);
	};
	if (data.MAKTX != "") {
		pstmt.setString(5, data.MAKTX);
	};
	if (data.MT_SEG_ID != "") {
		pstmt.setString(6, data.MT_SEG_ID);
	};
	if (data.MT_SEG_DESC != "") {
		pstmt.setString(7, data.MT_SEG_DESC);
	};
	if (data.MT_SEG_ID_SAP != "") {
		pstmt.setString(8, data.MT_SEG_ID_SAP);
	};
	if (data.MT_SEG_DESC_SAP != "") {
		pstmt.setString(9, data.MT_SEG_DESC_SAP);
	};
	if (data.MARKET_SEG != "") {
		pstmt.setString(10, data.MARKET_SEG);
	};
	if (data.COMMENTS != "") {
		pstmt.setString(11, data.COMMENTS);
	};
	if (data.MKT_SIGN != "") {
		pstmt.setString(12, data.MKT_SIGN);
	};
	if (data.CREATED_ON != "") {
		pstmt.setString(13, data.CREATED_ON);
	};
	if (data.LAST_MODIFIED_USER != "") {
		pstmt.setString(14, data.LAST_MODIFIED_USER);
	};
	if (data.LAST_MODIFIED_TIMESTAMP != "") {
		pstmt.setString(15, data.LAST_MODIFIED_TIMESTAMP);
	};
	pstmt.setString(16, data.MT_KEY);

	// Execute the prepared statement
	await pstmt.execute();
	$.response.status = $.net.http.OK;
	$.response.setBody(JSON.stringify({
		success: true
	}));
}
async function insertUpdateSave(dataArray) {
	// Use parameterized queries to prevent SQL injection
	var query = 'INSERT "ZMT_Initial_data" VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) WHERE "MT_KEY" = ?';
	var pstmt = await conn.prepareStatement(query);

	try {
		for (const data of dataArray) {
			pstmt.setString(1, data.MT_KEY || null);
			pstmt.setString(2, data.SOLD_TO || null);
			pstmt.setString(3, data.SOLD_TO_DESC || null);
			pstmt.setString(4, data.MATNR || null);
			pstmt.setString(5, data.MAKTX || null);
			pstmt.setString(6, data.MT_SEG_ID || null);
			pstmt.setString(7, data.MT_SEG_DESC || null);
			pstmt.setString(8, data.MT_SEG_ID_SAP || null);
			pstmt.setString(9, data.MT_SEG_DESC_SAP || null);
			pstmt.setString(10, data.MARKET_SEG || null);
			pstmt.setString(11, data.COMMENTS || null);
			pstmt.setString(12, data.MKT_SIGN || null);
			pstmt.setString(13, data.CREATED_ON || null);
			pstmt.setString(14, data.LAST_MODIFIED_USER || null);
			pstmt.setString(15, data.LAST_MODIFIED_TIMESTAMP || null);
			pstmt.setString(16, data.MT_KEY);
			await pstmt.addBatch();
		}
		await pstmt.executeBatch();
		conn.commit(); // Commit the transaction
		return {
			success: true
		};
	} catch (error) {
		conn.rollback(); 
		throw error;
	} finally {
		pstmt.close();
		conn.close();
	}
}
async function insertUpdateFinal(data) {
	// Use parameterized queries to prevent SQL injection
	var query = 'UPSERT "ZMT_Final_data" VALUES(?,?,?,?,?,?,?,?,?) WHERE "MATNR" = ?';
	var pstmt = await conn.prepareStatement(query);

	pstmt.setString(1, data.MATNR);
	if (data.MAKTX != "") {
		pstmt.setString(2, data.MAKTX);
	};
	if (data.SOLD_TO != "") {
		pstmt.setString(3, data.SOLD_TO);
	};
	if (data.SOLD_TO_DESC != "") {
		pstmt.setString(4, data.SOLD_TO_DESC);
	};
	if (data.MT_SEG_ID != "") {
		pstmt.setString(5, data.MT_SEG_ID);
	};
	if (data.MT_SEG_DESC != "") {
		pstmt.setString(6, data.MT_SEG_DESC);
	};
	if (data.MARKET_SEG != "") {
		pstmt.setString(7, data.MARKET_SEG);
	};
	if (data.LAST_MODIFIED_USER != "") {
		pstmt.setString(8, data.LAST_MODIFIED_USER);
	};
	if (data.LAST_MODIFIED_TIMESTAMP != "") {
		pstmt.setString(9, data.LAST_MODIFIED_TIMESTAMP);
	};
	pstmt.setString(10, data.MATNR);
	// Execute the prepared statement
	await pstmt.execute();
	$.response.status = $.net.http.OK;
	$.response.setBody(JSON.stringify({
		success: true
	}));
}

async function deleteInitial(data) {
	var query = 'DELETE FROM "ZMT_Initial_data" WHERE "MT_KEY" = ?';
	var pstmt = await conn.prepareStatement(query);

	pstmt.setString(1, data.MT_KEY);

	await pstmt.execute();
	$.response.status = $.net.http.OK;
	$.response.setBody(JSON.stringify({
		success: true
	}));
}
async function InitialFilter(data) {
	var query =
		`
   SELECT "MT_KEY", "SOLD_TO", "SOLD_TO_DESC", "MATNR", "MAKTX", "MT_SEG_ID", "MT_SEG_DESC", "MT_SEG_ID_SAP", "MT_SEG_DESC_SAP", "MARKET_SEG", "COMMENTS", "MKT_SIGN", "CREATED_ON", "LAST_MODIFIED_USER", "LAST_MODIFIED_TIMESTAMP"
   FROM "ZMT_Initial_data"
   WHERE "LAST_MODIFIED_TIMESTAMP" BETWEEN TO_DATE(?, 'YYYY-MM-DD') AND TO_DATE(?, 'YYYY-MM-DD')
`;
	var pstmt = await conn.prepareStatement(query);
	pstmt.setString(1, chdatef);
	pstmt.setString(2, chdatet);
	var rs = await pstmt.execute();

	$.response.contentType = "application/json";
	var body = "";
	body = $.response.setBody(JSON.stringify(rs));
	$.response.status = $.net.http.OK;
}