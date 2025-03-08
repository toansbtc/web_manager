import axios from "axios";

export default async function sendMessageZalo(id_user, message) {
    try {
        const access_token = process.env.access_token
        const resultSendMessToUser = await axios.post('https://openapi.zalo.me/v3.0/oa/message/cs',
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
        return resultSendMessToUser
    } catch (error) {
        console.error(error)
    }
}
