import axios from "axios";

export default function sendMessageZalo(id_user, message) {
    try {
        if (typeof window !== 'undefined') {
            const access_token = process.env.access_token
            const resultSendMessToUser = fetchSendMessage(id_user, message, access_token)
            return resultSendMessToUser
        }
        else
            return null
    } catch (error) {
        console.error(error)
    }
}

async function fetchSendMessage(id_user, message, access_token) {
    await axios.post('https://openapi.zalo.me/v3.0/oa/message/cs',
        {
            "recipient": {
                "user_id": id_user
            },
            "message": {
                "text": message
            }
        },
        {
            headers: {
                "Content-Type": "application/json",
                access_token: access_token
            }

        }
    )
}
