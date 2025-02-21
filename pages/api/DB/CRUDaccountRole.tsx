import { Prisma, PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import ActionDB from "./actionDB"

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
                console.log(sql)
                result = await prisma.$queryRaw(Prisma.sql([sql]))
                break;
            case ActionDB.GETLISTDATA:
                result = await prisma.account_role.findMany({
                    select: {
                        user_token: true,
                        role: true,
                        is_active: true,
                        infor: {
                            select: {
                                name: true,
                                birth_day: true,
                                number_phone: true,
                                address: true,
                                situation: true,
                                job: true,
                                reading: true,
                                self_introduc: true,
                                image_path: true

                            }
                        }
                    },
                    where: {
                        role: { not: 0 }
                    },
                    orderBy: [
                        {
                            role: "asc"
                        },
                        {
                            is_active: "asc"
                        }]
                })
                break;
            case ActionDB.GETDATA:
                result = await prisma.account_role.findUnique({
                    select: {
                        user_token: true,
                        role: true,
                        infor: {
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
                    },
                    where: {
                        user_token: formData.user_token
                    }
                })
                break;
            case ActionDB.CREATE:
                result = await prisma.account_role.create({
                    data: {

                        user_token: formData.user_token,
                        role: formData.role,
                        is_active: formData.is_active,
                        // infor:{
                        //     create:{

                        //     }
                        // }
                    },
                })
                break;
            case ActionDB.UPDATE:
                result = await prisma.account_role.update({
                    data: {
                        role: formData?.role,
                        is_active: formData?.is_active,
                        password: formData?.password,
                    }, where: {
                        user_token: formData.user_token
                    }
                })

                break;
            case ActionDB.UPDATEMANY:
                const update = (user) => {
                    return prisma.account_role.update({
                        data: {
                            role: user.role,
                            is_active: user.active
                        }, where: {
                            user_token: user.user_token
                        },
                        select: {
                            user_token: true,
                            role: true,
                            is_active: true
                        }
                    })
                }
                result = await prisma.$transaction(
                    formData.map(user => update(user))
                )

                break;
            case ActionDB.DELETE:
                result = await prisma.account_role.delete({
                    where: {
                        user_token: formData.user_token
                    },
                    include: {
                        infor: true
                    }
                })
                break;

            default:
                break;
        }

        res.status(200).send(result);
    } catch (error) {
        console.error(`error excute query account_role--${action}`, error)
    }
    finally {
        await prisma.$disconnect();
    }
}


