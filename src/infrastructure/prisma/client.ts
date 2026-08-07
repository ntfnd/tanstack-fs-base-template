import { PrismaClient } from "@prisma/client"

class PrismaClientSingleton {
    private static instance: PrismaClient | null = null

    public static getInstance(): PrismaClient {
        if (!PrismaClientSingleton.instance) {
            PrismaClientSingleton.instance = new PrismaClient()
        }
        return PrismaClientSingleton.instance
    }

    public static async disconnect(): Promise<void> {
        if (PrismaClientSingleton.instance) {
            await PrismaClientSingleton.instance.$disconnect()
            PrismaClientSingleton.instance = null
        }
    }
}

export const prisma = PrismaClientSingleton.getInstance()
