var data = $.request.body.asString();
data = JSON.parse(data);

$.response.contentType = "application/json";

try {
    var conn = await $.db.getConnection();

var aCmd = $.request.parameters.get("cmd");
switch (aCmd) {
case "insertupdate":
	await insertUpdateMT(data);
	break; 
case "delete":
	await deleteMT(data);
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
    $.response.setBody(JSON.stringify({ error: error.message }));
} finally {
    // Close the connection in the 'finally' block to ensure it's closed even if an error occurs
    if (conn) {
        await conn.close();
    }
}

async function insertUpdateMT(data){ 
    // Use parameterized queries to prevent SQL injection
    var query = 'UPSERT "ZMkt_Sector" VALUES(?,?,?,?) WHERE "MT_ID" = ?';
    var pstmt = await conn.prepareStatement(query);
    
    pstmt.setString(1, data.MT_ID);
    if(data.MT_DESC != ""){
    pstmt.setString(2, data.MT_DESC);
    };
    if(data.MT_SEG != ""){
    pstmt.setString(3, data.MT_SEG);
    };
    if(data.PROFIT != ""){
    pstmt.setString(4, data.PROFIT);
    };
    pstmt.setString(5, data.MT_ID);

    // Execute the prepared statement
    await pstmt.execute();
    $.response.status = $.net.http.OK;
    $.response.setBody(JSON.stringify({ success: true }));
}

async function deleteMT(data){ 
    var query = 'DELETE FROM "ZMkt_Sector" WHERE "MT_ID" = ?';
    var pstmt = await conn.prepareStatement(query);
    
    pstmt.setString(1, data.MT_ID);

    await pstmt.execute();
    $.response.status = $.net.http.OK;
    $.response.setBody(JSON.stringify({ success: true }));
}