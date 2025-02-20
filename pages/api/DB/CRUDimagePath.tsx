import { Prisma, PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import ActionDB from "./actionDB"
import { where } from "firebase/firestore";
import { create } from "domain";

const prisma = new PrismaClient({
    log: ["error"],
})

prisma.$connect()
export default async function prisma_sql(req: NextApiRequest, res: NextApiResponse) {
    const action = req.body.action;
    const formData = req.body.data;
    let result = null;
    try {

        switch (action) {
            case ActionDB.NATIVESQL:
                const sql = formData.sql;
                result = await prisma.$queryRaw(Prisma.sql([sql]))
                break;
            case ActionDB.GETDATA:
                const id = formData.id
                if (typeof id === "number")
                    result = await prisma.image_path.findUnique({
                        where: {
                            id_image_path: formData.id_image_path
                        }
                    })
                else
                    result = await prisma.image_path.findMany({
                        where: {
                            id_image_path: {
                                in: id
                            }
                        }
                    })
                break;
            case ActionDB.CREATE:
                result = await prisma.image_path.create({
                    data: {
                        image_path: formData.image_path
                    },
                })
                break;
            case ActionDB.UPDATE:
                result = await prisma.image_path.update({
                    data: {
                        image_path: formData.image_path
                    },
                    where: {
                        id_image_path: formData.id_image_path
                    }
                })
                break;
            case ActionDB.DELETE:
                result = await prisma.image_path.delete({
                    where: {
                        id_image_path: formData.id_image_path
                    }
                })
                break;

            default:
                break;
        }

        res.status(200).send(result);
    } catch (error) {
        console.error(`error excute query image_path--${action}`, error)
    }
    finally {
        await prisma.$disconnect();
    }
}


