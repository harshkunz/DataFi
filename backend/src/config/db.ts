import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import ENV from './env';

const pool = new Pool({
    connectionString: ENV.DATABASE_URL,
    max: 10
})

const adapter = new PrismaPg(pool);

declare global {
    var __prisma__: PrismaClient | undefined;
}

const db = global.__prisma__ ?? new PrismaClient({adapter});

if(ENV.NODE_ENV !== "production") {
    global.__prisma__ = db;
}

export default db;
export { db };
