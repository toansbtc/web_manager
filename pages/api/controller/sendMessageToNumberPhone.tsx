import { NextApiRequest, NextApiResponse } from 'next';
import twilio from 'twilio'




export default async function sendMessageToNumberPhone(req: NextApiRequest, res: NextApiResponse) {
    try {
        const SID = process.env.twilio_account_SID;
        const auth_token = process.env.twilio_auth_token;
        const twilio_phone_number = process.env.twilio_phone_number;
        console.log(SID, auth_token)
        const { adminNumberPhone, recivedNumberPhone, message } = req.body
        const client = twilio(SID, auth_token)
        const resultSendMessage = await client.messages.create({
            body: message,
            from: twilio_phone_number,
            to: recivedNumberPhone
        })
        if (resultSendMessage) {
            console.log(resultSendMessage)
            alert(`đã gửi tin nhắn đến sđt:${recivedNumberPhone}\nVới nội dung:${message}`)
        }
        res.status(200).send({})
    } catch (error) {
        console.log(error)
    }


}