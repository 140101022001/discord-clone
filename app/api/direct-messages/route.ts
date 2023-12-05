import currentProfile from "@/lib/current-profile";
import { db } from "@/lib/prismadb";
import { DirectMessage } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const MESSAGE_FILTER = process.env.MESSAGE_FILTER ? Number(process.env.MESSAGE_FILTER) : 10;
        
        const profile = await currentProfile();
        if (!profile) {
            return new NextResponse('Unauthorized', { status: 401 })
        }
        const { searchParams } = new URL(req.url);
        const conversationId = searchParams.get('conversationId');
        const cursor = searchParams.get('cursor');
        if (!conversationId) {
            return new NextResponse('conversation Id Missing', { status: 400 })
        }

        let directmessages: DirectMessage[] = [];

        if (cursor) {
            directmessages = await db.directMessage.findMany({
                take: MESSAGE_FILTER,
                skip: 1,
                cursor: {
                    id: cursor
                },
                where: {
                    conversationId
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            })
        } else {
            directmessages = await db.directMessage.findMany({
                take: MESSAGE_FILTER,
                where: {
                    conversationId
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            })
        }
        let nextCursor = null;

        if (directmessages.length == MESSAGE_FILTER) {
            nextCursor = directmessages[MESSAGE_FILTER - 1].id;
        }

        return NextResponse.json({
            items: directmessages,
            nextCursor
        })
    } catch (err) {
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}