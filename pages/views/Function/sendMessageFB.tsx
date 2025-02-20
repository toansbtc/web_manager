export default function sendMessageToUser(userID, messageText) {
    if (typeof window !== 'undefined') {
        const url = "https://graph.facebook.com/v15.0/me/messages";
        const pageAccessToken = process.env.pageAccessToken;


        const response = fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${pageAccessToken}`,
            },
            body: JSON.stringify({
                messaging_type: "RESPONSE",
                recipient: { id: userID },
                message: { text: messageText },
            }),
        });
        return response
    }
}
