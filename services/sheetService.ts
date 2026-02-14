import { FinalReportData, Message } from '../types';

export const submitToGoogleSheet = async (
    reportData: FinalReportData,
    messages: Message[]
) => {
    const sheetUrl = import.meta.env.VITE_GOOGLE_SHEET_URL;

    if (!sheetUrl) {
        console.warn('VITE_GOOGLE_SHEET_URL is not defined in .env.local');
        return;
    }

    // Format Chat History
    const chatHistory = messages
        .map(msg => `[${msg.role.toUpperCase()}]: ${msg.text}`)
        .join('\n\n');

    // Prepare Payload
    const payload = {
        ...reportData,
        chatHistory: chatHistory
    };

    try {
        // Mode 'no-cors' is required for Google Script Web Apps
        // This means we won't get a readable response JSON, but the request will succeed.
        await fetch(sheetUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        console.log('Data submitted to Google Sheets successfully (opaque response).');
    } catch (error) {
        console.error('Error submitting to Google Sheets:', error);
    }
};
