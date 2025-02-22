import { PrismaClient } from '@prisma/client';

declare global {
    var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient({ log: ["error"] });

if (process.env.NODE_ENV !== "production") {
    global.prisma = prisma;
}

process.on("SIGINT", async () => {
    await prisma.$disconnect();
    console.log("Prisma disconnected due to SIGINT");
    process.exit(0);
});

process.on("SIGTERM", async () => {
    await prisma.$disconnect();
    console.log("Prisma disconnected due to SIGTERM");
    process.exit(0);
});

export default prisma;