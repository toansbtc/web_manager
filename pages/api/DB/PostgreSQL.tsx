// import { prisma } from './prisma'

import { Prisma, PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient()
export default async function prisma_sql(req: NextApiRequest, res: NextApiResponse) {
    const sql = req.body.sql;
    try {

        const result = await prisma.$queryRaw(Prisma.sql([sql]))
        res.status(200).send(result);
    } catch (error) {
        console.error(`error excute query--${sql}`, error)
    }
    finally {
        prisma.$disconnect();
    }
}
