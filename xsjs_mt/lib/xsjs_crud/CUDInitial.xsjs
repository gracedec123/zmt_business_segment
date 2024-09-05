var data = $.request.body.asString();
if (data) {
	data = JSON.parse(data);
}
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

async function insertUpdateInitial(dataArray) {
	var query =
		'UPDATE "ZMT_Initial_data" SET "MT_SEG_ID" = ?, "MT_SEG_DESC" = ?, "MT_SEG_ID_SAP" = ?, "MT_SEG_DESC_SAP" = ?, "COMMENTS" = ?, "MKT_SIGN" = ?, "LAST_MODIFIED_USER" = ?, "LAST_MODIFIED_TIMESTAMP" = ? WHERE "MT_KEY" = ?';

	var insquery =
		'INSERT INTO "ZMT_Initial_data" ("MT_KEY", "SOLD_TO", "SOLD_TO_DESC", "MATNR", "MAKTX", "MT_SEG_ID", "MT_SEG_DESC", "MT_SEG_ID_SAP", "MT_SEG_DESC_SAP", "MARKET_SEG", "COMMENTS", "MKT_SIGN", "CREATED_ON", "LAST_MODIFIED_USER", "LAST_MODIFIED_TIMESTAMP") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

	var inspstmt;
	var pstmt;

	try {
		await conn.setAutoCommit(false); // Start transaction

		for (var i = 0; i < dataArray.length; i++) {
			var data = dataArray[i];

			// Check if the record exists
			var existsQuery = 'SELECT COUNT(*) FROM "ZMT_Initial_data" WHERE "MT_KEY" = ?';
			var existsPstmt = await conn.prepareStatement(existsQuery);
			existsPstmt.setString(1, data.MT_KEY);
			var resultSet = await existsPstmt.executeQuery();
			resultSet.next();
			var count = resultSet.getInt(1);
			await existsPstmt.close();

			console.log(`Processing entry with MT_KEY: ${data.MT_KEY}, Exists: ${count > 0}`);

			if (count > 0) {
				// Update operation
				if (!pstmt) {
					pstmt = await conn.prepareStatement(query);
				}
				pstmt.setString(1, data.MT_SEG_ID);
				pstmt.setString(2, data.MT_SEG_DESC);
				pstmt.setString(3, data.MT_SEG_ID_SAP);
				pstmt.setString(4, data.MT_SEG_DESC_SAP);
				pstmt.setString(5, data.COMMENTS);
				pstmt.setString(6, data.MKT_SIGN);
				pstmt.setString(7, data.LAST_MODIFIED_USER);
				pstmt.setString(8, data.LAST_MODIFIED_TIMESTAMP);
				pstmt.setString(9, data.MT_KEY);

				pstmt.addBatch(); // Add update to batch
				console.log(`Added update for MT_KEY: ${data.MT_KEY}`);
			} else {
				// Insert operation
				if (!inspstmt) {
					inspstmt = await conn.prepareStatement(insquery);
				}
				inspstmt.setString(1, data.MT_KEY);
				inspstmt.setString(2, data.SOLD_TO);
				inspstmt.setString(3, data.SOLD_TO_DESC);
				inspstmt.setString(4, data.MATNR);
				inspstmt.setString(5, data.MAKTX);
				inspstmt.setString(6, data.MT_SEG_ID);
				inspstmt.setString(7, data.MT_SEG_DESC);
				inspstmt.setString(8, data.MT_SEG_ID_SAP);
				inspstmt.setString(9, data.MT_SEG_DESC_SAP);
				inspstmt.setString(10, data.MARKET_SEG);
				inspstmt.setString(11, data.COMMENTS);
				inspstmt.setString(12, data.MKT_SIGN);
				inspstmt.setString(13, data.CREATED_ON);
				inspstmt.setString(14, data.LAST_MODIFIED_USER);
				inspstmt.setString(15, data.LAST_MODIFIED_TIMESTAMP);

				inspstmt.addBatch(); // Add insert to batch
				console.log(`Added insert for MT_KEY: ${data.MT_KEY}`);
			}
		}

		// Execute both batches
		if (pstmt) {
			var updateCounts = await pstmt.executeBatch(); // Execute update batch
		}
		if (inspstmt) {
			var insertCounts = await inspstmt.executeBatch(); // Execute insert batch
		}

		await conn.commit(); // Commit transaction

		console.log(`Update counts: ${updateCounts?.length || 0}, Insert counts: ${insertCounts?.length || 0}`);

		return {
			success: true,
			counts: updateCounts,
			countsins: insertCounts
		};
	} catch (error) {
		console.error("Error during batch operation:", error);
		await conn.rollback(); // Rollback on error
		return {
			success: false,
			message: error.message
		};
	} finally {
		if (pstmt) {
			await pstmt.close(); // Close prepared statement
		}
		if (inspstmt) {
			await inspstmt.close(); // Close prepared statement
		}
	}
}
async function insertUpdateSave(data) {
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
async function insertUpdateFinal(dataArray) {
	var query =
		'UPDATE "ZMT_Final_data" SET "MT_SEG_ID" = ?, "MT_SEG_DESC" = ?, "LAST_MODIFIED_USER" = ?, 		"LAST_MODIFIED_TIMESTAMP" = ? WHERE "SOLD_TO" = ? AND "MATNR" = ?';

	var insquery = 'INSERT INTO "ZMT_Final_data" VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

	var inspstmt;
	var pstmt;

	try {
		await conn.setAutoCommit(false); // Start transaction

		for (var i = 0; i < dataArray.length; i++) {
			var data = dataArray[i];

			// Check if the record exists
			var existsQuery = 'SELECT COUNT(*) FROM "ZMT_Final_data" WHERE "SOLD_TO" = ? AND "MATNR" = ?';
			var existsPstmt = await conn.prepareStatement(existsQuery);
			existsPstmt.setString(1, data.SOLD_TO);
			existsPstmt.setString(2, data.MATNR);
			var resultSet = await existsPstmt.executeQuery();
			resultSet.next();
			var count = resultSet.getInt(1);
			await existsPstmt.close();

			if (count > 0) {
				// Update operation
				if (!pstmt) {
					pstmt = await conn.prepareStatement(query);
				}
				pstmt.setString(1, data.MT_SEG_ID);
				pstmt.setString(2, data.MT_SEG_DESC);
				pstmt.setString(3, data.LAST_MODIFIED_USER);
				pstmt.setString(4, data.LAST_MODIFIED_TIMESTAMP);
				pstmt.setString(5, data.SOLD_TO);
				pstmt.setString(6, data.MATNR);

				pstmt.addBatch(); // Add update to batch
			} else {
				// Insert operation
				if (!inspstmt) {
					inspstmt = await conn.prepareStatement(insquery);
				}
				inspstmt.setString(1, data.SOLD_TO);
				inspstmt.setString(2, data.MATNR);
				inspstmt.setString(3, data.MAKTX);
				inspstmt.setString(4, data.SOLD_TO_DESC);
				inspstmt.setString(5, data.MT_SEG_ID);
				inspstmt.setString(6, data.MT_SEG_DESC);
				inspstmt.setString(7, data.MARKET_SEG);
				inspstmt.setString(8, data.LAST_MODIFIED_USER);
				inspstmt.setString(9, data.LAST_MODIFIED_TIMESTAMP);

				inspstmt.addBatch(); // Add insert to batch
			}
		}

		// Execute both batches
		if (pstmt) {
			var updateCounts = await pstmt.executeBatch(); // Execute update batch
		}
		if (inspstmt) {
			var insertCounts = await inspstmt.executeBatch(); // Execute insert batch
		}

		await conn.commit(); // Commit transaction

		console.log(`Update counts: ${updateCounts?.length || 0}, Insert counts: ${insertCounts?.length || 0}`);

		return {
			success: true,
			counts: updateCounts,
			countsins: insertCounts
		};
	} catch (error) {
		console.error("Error during batch operation:", error);
		await conn.rollback(); // Rollback on error
		return {
			success: false,
			message: error.message
		};
	} finally {
		if (pstmt) {
			await pstmt.close(); // Close prepared statement
		}
		if (inspstmt) {
			await inspstmt.close(); // Close prepared statement
		}
	}

	/*	var pstmt;
		var query;

		try {
			await conn.setAutoCommit(false); // Start transaction

			// Prepare the UPSERT statement
			//( "SOLD_TO", "MATNR", "MAKTX", "SOLD_TO_DESC", "MT_SEG_ID", "MT_SEG_DESC", "MARKET_SEG", "LAST_MODIFIED_USER", "LAST_MODIFIED_TIMESTAMP") 
			query = 'INSERT INTO "ZMT_Final_data" VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
			//WHERE "SOLD_TO" = ?';
			pstmt = await conn.prepareStatement(query);

			for (var i = 0; i < dataArray.length; i++) {
				var data = dataArray[i];

				// Set parameters for UPSERT
				pstmt.setString(1, data.SOLD_TO);
				pstmt.setString(2, data.MATNR || null); // Use null if empty
				pstmt.setString(3, data.MAKTX || null); // Use null if empty
				pstmt.setString(4, data.SOLD_TO_DESC || null); // Use null if empty
				pstmt.setString(5, data.MT_SEG_ID || null); // Use null if empty
				pstmt.setString(6, data.MT_SEG_DESC || null); // Use null if empty
				pstmt.setString(7, data.MARKET_SEG || null); // Use null if empty
				pstmt.setString(8, data.LAST_MODIFIED_USER || null); // Use null if empty
				pstmt.setString(9, data.LAST_MODIFIED_TIMESTAMP || null); // Use null if empty

				pstmt.addBatch(); // Add to batch
			}

			// Execute the batch
			var updateCounts = await pstmt.executeBatch(); // Execute batch
			await conn.commit(); // Commit transaction

			$.response.status = $.net.http.OK;
			$.response.setBody(JSON.stringify({
				success: true,
				counts: updateCounts
			}));
		} catch (error) {
			console.error("Error during batch UPSERT operation:", error);
			await conn.rollback(); // Rollback on error
			$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
			$.response.setBody(JSON.stringify({
				success: false,
				message: error.message
			}));
		} finally {
			if (pstmt) {
				await pstmt.close(); // Close prepared statement
			}
		}*/
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
	SELECT "MT_KEY", "SOLD_TO", "SOLD_TO_DESC", "MATNR", "MAKTX", "MT_SEG_ID", "MT_SEG_DESC", "MT_SEG_ID_SAP", "MT_SEG_DESC_SAP", "MARKET_SEG",
		"COMMENTS", "MKT_SIGN", "CREATED_ON", "LAST_MODIFIED_USER", "LAST_MODIFIED_TIMESTAMP"
	FROM "ZMT_Initial_data"
	WHERE "LAST_MODIFIED_TIMESTAMP"
	BETWEEN TO_DATE( ? , 'YYYY-MM-DD') AND TO_DATE( ? , 'YYYY-MM-DD')
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