import mongoose from "mongoose"

const password = process.env.MONGODB_ALIAS_PASS
const mongoose_uri = `mongodb+srv://anhem4nguoi:${password}@mailbox.0nxbk.mongodb.net/feebackDB?retryWrites=true&w=majority&appName=mailbox`


let isConnected = false;

const connectionDB = async () => {
    if (isConnected) {
        console.log("⚠️ Already connected to MongoDB.");
        return;
    }
    try {
        await mongoose.connect(mongoose_uri,
            {
                serverSelectionTimeoutMS: 30000,
                socketTimeoutMS: 45000,
            })
        isConnected = true
        console.log("✅ MongoDB Atlas Connected!");
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error);
    }
}

export default connectionDB