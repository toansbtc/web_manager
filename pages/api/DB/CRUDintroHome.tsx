import { Prisma, PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import ActionDB from "./actionDB"
import { where } from "firebase/firestore";

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
                console.log("formData", formData)
                result = await prisma.intro_home.findFirst({
                    where: {
                        type: formData.type
                    }
                })
                break;
            case ActionDB.CREATE:
                console.log(formData)
                result = await prisma.intro_home.create({
                    data: {
                        introduct: formData.introduct,
                        type: formData.type,
                        ...(formData.image_path && {
                            image_path: {
                                create: {
                                    image_path: formData.image_path,
                                },
                            },
                        }),
                    },
                });
                break;
            case ActionDB.UPDATE:
                await prisma.intro_home.update({
                    data: {
                        introduct: formData.introduct,
                        ...(formData.image_path && {
                            image_path: {
                                create: {
                                    image_path: formData.image_path,
                                },
                            },
                        }),
                    },
                    where: {
                        id: formData.id

                    }
                })

                break;
            case ActionDB.DELETE:
                result = await prisma.intro_home.delete({
                    // include: { image_path: true },
                    where: {
                        id: formData.id
                    }
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


