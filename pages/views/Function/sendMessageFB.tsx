import axios from "axios";

export default async function sendMessageToUser(userID, messageText, pageAccessToken) {
    try {
        console.log("adadadad", userID, messageText, pageAccessToken)
        if (typeof window !== 'undefined') {
            const url = "https://graph.facebook.com/v22.0/122147223470399846/messages?access_token=" + pageAccessToken;
            const response = await axios.post(url,
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
    } catch (error) {
        console.error(error)
    }

}
