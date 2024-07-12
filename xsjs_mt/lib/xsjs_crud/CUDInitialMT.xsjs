//not using 
//var dataArray = $.request.body.asString();
//dataArray = JSON.parse(dataArray);
$.response.contentType = "application/json";
var conn = await $.db.getConnection();

async function insertUpdateInitialBatch(dataArray) {
	var query = 'UPSERT "ZMT_Initial_data" VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) WHERE "MT_KEY" = ?';
	var pstmt = await conn.prepareStatement(query);
	try {
		for (var i = 0; i< dataArray.length -1 ; i++) {
			const getString = (value) => (value ? String(value) : null);

			pstmt.setString(1, dataArray[i].MT_KEY || null);
			pstmt.setString(2, dataArray[i].SOLD_TO || null);
			pstmt.setString(3, dataArray[i].SOLD_TO_DESC || null);
			pstmt.setString(4, dataArray[i].MATNR || null);
			pstmt.setString(5, dataArray[i].MAKTX || null);
			pstmt.setString(6, dataArray[i].MT_SEG_ID || null);
			pstmt.setString(7, dataArray[i].MT_SEG_DESC || null);
			pstmt.setString(8, dataArray[i].MT_SEG_ID_SAP || null);
			pstmt.setString(9, dataArray[i].MT_SEG_DESC_SAP || null);
			pstmt.setString(10, dataArray[i].MARKET_SEG || null);
			pstmt.setString(11, dataArray[i].COMMENTS || null);
			pstmt.setString(12, dataArray[i].MKT_SIGN || null);
			pstmt.setString(13, dataArray[i].CREATED_ON || null);
			pstmt.setString(14, dataArray[i].LAST_MODIFIED_USER || null);
			pstmt.setString(15, dataArray[i].LAST_MODIFIED_TIMESTAMP || null);
			pstmt.setString(16, getString(dataArray[i].MT_KEY));
			await pstmt.addBatch();
			if (i % 500 == 0) {
				await pstmt.executeBatch();
			}
		}
		await pstmt.executeBatch();
		await conn.commit(); // Commit the transaction
	} catch (error) {
		await conn.rollback();
		throw error;
	} finally {
		await pstmt.close();
		await conn.close();
	}
}