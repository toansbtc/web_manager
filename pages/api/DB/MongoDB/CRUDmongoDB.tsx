import { NextApiRequest, NextApiResponse } from "next";
import actionDB from "../actionDB";
import { mongo_feedback, mongo_infor } from "./model";
import connectionDB from "./mongoose";

export default async function CRUD(req: NextApiRequest, res: NextApiResponse) {
    const action = req.body.action;
    const data = req.body.data;
    await connectionDB()

    switch (action) {
        case actionDB.CREATE:
            try {
                const info = await mongo_infor.create({ userName: data.name, numberPhone: data.numberPhone })
                await mongo_feedback.create({ inforId: info._id, feedback: data.feedback, title: data.title })
                res.status(200).json({})
            } catch (error) {
                console.log(error)
                res.status(500).json({ error })
            }
            break;
        case actionDB.GETDATA:
            try {
                // const getAllData = await mongo_feedback.find().populate('inforId')
                const getAllData = await mongo_feedback.aggregate([
                    {
                        $lookup: {
                            from: 'infors',
                            localField: 'inforId',
                            foreignField: '_id',
                            as: 'user'
                        }
                    },
                    {
                        $unwind: '$user'
                    },
                    {
                        $group: {
                            _id: '$user.numberPhone',
                            // numberPhone: { $first: '$user.numberPhone' },
                            // userName: { $first: '$user.userName' },
                            feedback: {
                                $push: {
                                    id: '$inforId',
                                    title: '$title',
                                    feedback: '$feedback',
                                    userName: '$user.userName'
                                }
                            }
                        }
                    },
                    {
                        $project: {
                            userName: 1,
                            numberPhone: 1,
                            feedback: 1,
                            _id: 1
                        }
                    }
                ])
                res.status(200).json(getAllData)
            } catch (error) {
                console.log(error)
                res.status(500).json({ error })

            }
            break;
        case actionDB.DELETE:
            try {
                await mongo_feedback.deleteMany({ inforId: { $in: data.listData } })
                await mongo_infor.deleteMany({ _id: { $in: data.listData } })
                res.status(200)
            } catch (error) {
                console.log(error)
                res.status(500).json(error)
            }

            break;

        default:
            break;
    }
}