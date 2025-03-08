import mongoose from "mongoose";
interface infor extends Document {
    userName: string,
    numberPhone: string
}
interface feedback extends Document {
    inforId: mongoose.Schema.Types.ObjectId,
    feedback: string,
    title: string
}



const inforSchema: mongoose.Schema<infor> = new mongoose.Schema({
    userName: { type: String, required: true },
    numberPhone: { type: String, required: true },

}
)
const mongo_infor: mongoose.Model<infor> = mongoose.models.infor || mongoose.model<infor>("infor", inforSchema)





const feedbackSchema: mongoose.Schema<feedback> = new mongoose.Schema({
    inforId: { type: mongoose.Schema.Types.ObjectId, ref: "infor", required: true },
    feedback: { type: String, required: true, },
    title: { type: String, required: true, }
})
const mongo_feedback: mongoose.Model<feedback> = mongoose.models.feedback || mongoose.model<feedback>("feedback", feedbackSchema)


export { mongo_feedback, mongo_infor };