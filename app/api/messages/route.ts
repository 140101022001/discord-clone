import currentProfile from "@/lib/current-profile";
import { db } from "@/lib/prismadb";
import { Message } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const MESSAGE_FILTER = process.env.MESSAGE_FILTER ? Number(process.env.MESSAGE_FILTER) : 10;
        
        const profile = await currentProfile();
        if (!profile) {
            return new NextResponse('Unauthorized', { status: 401 })
        }
        const { searchParams } = new URL(req.url);
        const channelId = searchParams.get('channelId');
        const cursor = searchParams.get('cursor');
        if (!channelId) {
            return new NextResponse('Channel Id Missing', { status: 400 })
        }

        let messages: Message[] = [];

        if (cursor) {
            messages = await db.message.findMany({
                take: MESSAGE_FILTER,
                skip: 1,
                cursor: {
                    id: cursor
                },
                where: {
                    channelId
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
            messages = await db.message.findMany({
                take: MESSAGE_FILTER,
                where: {
                    channelId
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

        if (messages.length == MESSAGE_FILTER) {
            nextCursor = messages[MESSAGE_FILTER - 1].id;
        }

        return NextResponse.json({
            items: messages,
            nextCursor
        })
    } catch (err) {
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}