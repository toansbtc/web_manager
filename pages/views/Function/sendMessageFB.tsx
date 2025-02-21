import axios from "axios";

export default function sendMessageToUser(userID, messageText, pageAccessToken) {
    if (typeof window !== 'undefined') {
        const url = "https://graph.facebook.com/v22.0/me/messages?access_token=" + pageAccessToken;
        const response = axios.post(url,
            {
                recipient: { id: userID },
                messaging_type: "RESPONSE",
                message: { text: messageText }
            },
            {
                headers: {
                    'Content-Type': "application/json"
                }
            }
        )
        return response
    }
}
