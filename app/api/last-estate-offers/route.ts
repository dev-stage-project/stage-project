import {PrismaClient} from "@prisma/client";
import {NextResponse} from "next/server";

const prisma = new PrismaClient();

export async function GET() {

    try {
        const offers = await prisma.realEstateOffer.findMany({
            take: 10,
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json(offers, {status: 200});
    } catch (error) {
        console.error('Error getting last estate offers:', error);
        return NextResponse.json({error: 'Error getting last estate offers'}, {status: 500});
    }
}