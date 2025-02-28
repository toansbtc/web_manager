import axios from "axios";

export default function sendMessageToUser(userID, messageText, pageAccessToken) {
    try {
        console.log("adadadad", userID, messageText, pageAccessToken)
        if (typeof window !== 'undefined') {
            const url = "https://graph.facebook.com/v22.0/122147223470399846/messages?access_token=" + pageAccessToken;
            const response = apiSendMessage(url, userID, messageText)
            return response
        }
    } catch (error) {
        console.error(error)
    }

}

const apiSendMessage = async (url, userID, messageText) => {
    return await axios.post(url,
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
}