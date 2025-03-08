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
            case ActionDB.NATIVESQL:
                const sql = formData.sql;
                result = await prisma.$queryRaw(Prisma.sql([sql]))
                break;
            case ActionDB.GETDATA:
                result = await prisma.infor.findUnique({
                    where: {
                        user_token_infor: formData.user_token
                    },
                    include: {
                        image_path: true
                    }
                })
                break;
            case ActionDB.UPDATEMANY:
                switch (formData.actionUpdateMany) {
                    case "editReadingMember":
                        console.log(formData.sql)
                        const update = await prisma.$queryRaw(Prisma.sql([formData.sql]))
                        if (update)
                            result = await prisma.$transaction(

                                formData.data.map(value => {
                                    return prisma.infor.update({
                                        where: {
                                            user_token_infor: value.id
                                        },
                                        data: {
                                            reading: value.read,
                                            can_read: true
                                        }
                                    })
                                })
                            )

                        break;
                    case "updateReading":
                        result = await prisma.$transaction(
                            formData.data.map(value => {

                                return prisma.infor.update({
                                    data: {
                                        reading: true
                                    },
                                    where: {
                                        user_token_infor: value.user_token
                                    }
                                })

                            })
                        )
                        break;

                    default:
                        break;
                }
                break;
            case ActionDB.CREATE:
                result = await prisma.infor.create({
                    data: {
                        account_role: {
                            connect: {
                                user_token: formData.user_token
                            }
                        },
                        self_introduc: formData.update.self_introduc,
                        job: formData.update.job,
                        situation: formData.update.situation,
                        address: formData.update.address,
                        number_phone: formData.update.number_phone,
                        name: formData.update.name,
                        birth_day: formData.update.birth_day,
                        image_path: {
                            create: {
                                image_path: formData.update.image_path
                            }
                        }
                    },
                })
                break;
            case ActionDB.UPDATE:
                result = await prisma.infor.upsert({
                    create: {
                        account_role: {
                            connect: {
                                user_token: formData.user_token
                            }
                        },
                        self_introduc: formData.update.self_introduc,
                        job: formData.update.job,
                        situation: formData.update.situation,
                        address: formData.update.address,
                        number_phone: formData.update.number_phone,
                        name: formData.update.name,
                        birth_day: formData.update.birth_day,
                        image_path: {
                            create: {
                                image_path: formData.update.image_path
                            }
                        }

                    },
                    update: {

                        self_introduc: formData.update.self_introduc,
                        job: formData.update.job,
                        situation: formData.update.situation,
                        address: formData.update.address,
                        number_phone: formData.update.number_phone,
                        name: formData.update.name,
                        birth_day: formData.update.birth_day,
                        image_path: {
                            create: {
                                image_path: formData.update.image_path
                            }
                        }
                    },
                    where: {
                        user_token_infor: formData.user_token
                    },
                    select: {
                        name: true,
                        birth_day: true,
                        number_phone: true,
                        address: true,
                        situation: true,
                        job: true,
                        self_introduc: true,
                        image_path: true

                    }
                }
                )
                break;
            case ActionDB.DELETE:
                result = await prisma.infor.delete({
                    where: {
                        user_token_infor: formData.user_token
                    },
                    include: {
                        image_path: true
                    }
                })
                break;

            default:
                break;
        }

        res.status(200).send(result);
    } catch (error) {
        console.error(`error excute query infor--${action}`, error)
    }
    finally {
        await prisma.$disconnect();
    }
}


