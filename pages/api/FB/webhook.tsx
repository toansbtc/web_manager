import { NextApiRequest, NextApiResponse } from "next";

const VERIFY_TOKEN = "myWebhookSecret"; // Use the same verify token in the Facebook dashboard

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const mode = req.query["hub.mode"];
        const token = req.query["hub.verify_token"];
        const challenge = req.query["hub.challenge"];

        if (mode === "subscribe" && token === VERIFY_TOKEN) {
            console.log("WEBHOOK VERIFIED!");
            res.status(200).send(challenge); // ✅ Facebook needs this response
        } else {
            res.status(403).send("Forbidden");
        }
    } else if (req.method === "POST") {
        // ✅ Handle incoming Facebook messages/events here
        console.log("Webhook Event Received:", req.body);
        res.status(200).send("EVENT_RECEIVED");
    } else {
        res.status(405).send("Method Not Allowed");
    }
}
