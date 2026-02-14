// --- GOOGLE APPS SCRIPT CODE ---
// 1. Create a new Google Sheet.
// 2. Go to Extensions > Apps Script.
// 3. Paste this code entirely, replacing any existing code.
// 4. Save (Ctrl+S).
// 5. Click "Deploy" > "New deployment".
// 6. Select type: "Web app".
// 7. Description: "MentorFlow API".
// 8. Execute as: "Me" (your email).
// 9. Who has access: "Anyone" (Critical for it to work without login).
// 10. Click "Deploy", Authorize access, and COPY the "Web App URL".

function doPost(e) {
    var lock = LockService.getScriptLock();
    lock.tryLock(10000);

    try {
        var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
        var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
        var nextRow = sheet.getLastRow() + 1;

        // Parse the incoming JSON data
        var data = JSON.parse(e.postData.contents);

        // If headers are empty, set them up automatically (First Run)
        if (sheet.getLastRow() === 0) {
            var initialHeaders = [
                "Date",
                "Stage",
                "UserName",
                "UserEmail",
                "UserWhatsapp",
                "CurrentIncome",
                "FinancialGoal",
                "TicketPrice",
                "TrafficScore",
                "SalesScore",
                "ProductScore",
                "ManagementScore",
                "Strengths",
                "Weaknesses",
                "CorrectionPlan",
                "ChatHistory"
            ];
            sheet.getRange(1, 1, 1, initialHeaders.length).setValues([initialHeaders]);
            headers = initialHeaders;
        }

        var newRow = headers.map(function (header) {
            if (header === 'Date') return new Date();

            // Map data fields to headers
            // Note: keys in 'data' must match what we send from frontend
            // We will normalize keys to match header names if possible, or just check fields

            switch (header) {
                case 'Stage': return data.stage;
                case 'UserName': return data.userName;
                case 'UserEmail': return data.userEmail;
                case 'UserWhatsapp': return data.userWhatsapp;
                case 'CurrentIncome': return data.currentIncome;
                case 'FinancialGoal': return data.financialGoal;
                case 'TicketPrice': return data.ticketPrice;
                case 'TrafficScore': return data.pillarScores ? data.pillarScores.traffic : '';
                case 'SalesScore': return data.pillarScores ? data.pillarScores.sales : '';
                case 'ProductScore': return data.pillarScores ? data.pillarScores.product : '';
                case 'ManagementScore': return data.pillarScores ? data.pillarScores.management : '';
                case 'Strengths': return Array.isArray(data.strengths) ? data.strengths.join('\n') : data.strengths;
                case 'Weaknesses': return Array.isArray(data.weaknesses) ? data.weaknesses.join('\n') : data.weaknesses;
                case 'CorrectionPlan': return Array.isArray(data.correctionPlan) ? data.correctionPlan.join('\n') : data.correctionPlan;
                case 'ChatHistory': return data.chatHistory; // Full transcript
                default: return '';
            }
        });

        sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);

        return ContentService
            .createTextOutput(JSON.stringify({ "result": "success", "row": nextRow }))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (e) {
        return ContentService
            .createTextOutput(JSON.stringify({ "result": "error", "error": e }))
            .setMimeType(ContentService.MimeType.JSON);
    } finally {
        lock.releaseLock();
    }
}

function setup() {
    // Run this function once manually if you want to pre-create headers,
    // but the doPost handles it too.
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var headers = [
        "Date",
        "Stage",
        "UserName",
        "UserEmail",
        "UserWhatsapp",
        "CurrentIncome",
        "FinancialGoal",
        "TicketPrice",
        "TrafficScore",
        "SalesScore",
        "ProductScore",
        "ManagementScore",
        "Strengths",
        "Weaknesses",
        "CorrectionPlan",
        "ChatHistory"
    ];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
}
