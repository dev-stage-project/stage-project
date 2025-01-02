import {PrismaClient} from "@prisma/client";
import {NextResponse} from "next/server";

const prisma = new PrismaClient();
export async function GET() {

    try {
        const offers = await prisma.vehicleOffer.findMany({
            where: {
                validated: true,
                active: true
            },
            take: 3,
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json(offers, {status: 200});
    } catch (error) {
        console.error('Error getting last automotive offers:', error);
        return NextResponse.json({error: 'Error getting last automotive offers'}, {status: 500});
    }
}