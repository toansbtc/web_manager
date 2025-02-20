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

            case ActionDB.GETDATA:
                result = await prisma.capcha_code.findFirst()

                break;
            case ActionDB.CREATE:
                // await prisma.capcha_code.deleteMany();
                result = await prisma.capcha_code.upsert({
                    update: {
                        capcha_code: formData.capcha_code,

                    }, where: {
                        id: 1
                    },
                    create: {
                        capcha_code: formData.capcha_code
                    }

                });
                console.log("capcha create", result)
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


