import { Prisma, PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import ActionDB from "./actionDB"
import prisma from "./prisma";

// const prisma = new PrismaClient({
//     log: ["error"],
// })

// prisma.$connect()
export default async function prisma_sql(req: NextApiRequest, res: NextApiResponse) {
    const action = req.body.action;
    const formData = req.body.data;
    let result = null;
    try {

        switch (action) {

            case ActionDB.GETLISTDATA:
                result = await prisma.active_title.findMany()
                break;
            case ActionDB.CREATE:
                result = await prisma.active_title.create({
                    data: {
                        title: formData.title,
                        list_image: formData.list_image
                    }
                }
                );
                break;
            case ActionDB.UPDATE:
                const existingRecord = await prisma.active_title.findUnique({
                    where: { id: formData.id },
                });
                result = await prisma.active_title.update({
                    data: {
                        list_image: existingRecord.list_image += "," + formData.list_image

                    },
                    where: {
                        id: formData.id
                    }
                })
                break;
            case ActionDB.DELETE:
                result = await prisma.active_title.delete({
                    where: { id: formData.id }
                })
                break;


            default:
                break;
        }

        res.status(200).send(result);
    } catch (error) {
        console.error(`error excute query intro_home--${action}`, error)
    }
    finally {
        await prisma.$disconnect();
    }
}


