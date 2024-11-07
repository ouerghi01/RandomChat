
/*
The idea here is to instantiate a single instance PrismaClient and save it on the globalThis object.

We will check globalThis to see if anything is stored on it. 
If nothing is on the object, we will create a new PrismaClient; otherwise, we will just reuse the one stored.
*/ 
import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma