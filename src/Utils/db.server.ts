import { PrismaClient } from "@prisma/client";
// Avoid multiple connections to the database
let db: PrismaClient;

declare global {
    var __db: PrismaClient | undefined
}

if (!global.__db) {
    global.__db = new PrismaClient()
}

db = global.__db

export { db }