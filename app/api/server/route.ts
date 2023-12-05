import {v4 as uuidv4} from 'uuid';
import currentProfile from "@/lib/current-profile"
import { db } from "@/lib/prismadb"
import { NextResponse } from "next/server"
import { MemberRole } from '@prisma/client';

export async function POST(req: Request) {
    try {
        const { name, imageUrl } = await req.json();
        const currentUser = await currentProfile();

        if (!currentUser) return new NextResponse('Unauthorized', { status: 401 })

        const server = await db.servers.create({
            data: {
                profileId: currentUser.id,
                name,
                imageUrl,
                inviteCode: uuidv4(),
                channel: {
                    create: {
                        name: 'general',
                        profileId: currentUser.id
                    }
                },
                member: {
                    create: {
                        profileId: currentUser.id,
                        role: MemberRole.ADMIN
                    }
                }
            }
        })
        return NextResponse.json(server);
    } catch(error) {
        console.log(error);
        return new NextResponse('Internal Sever error', { status: 500 })
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get('serverId');
        console.log(serverId);
        
        const profile = await currentProfile();

        if (!profile) return new NextResponse('Unauthorized', { status: 401 })

        if (!serverId) {
            return new NextResponse('Server Id Missing', { status: 400 })
        }
        const server = await db.servers.delete({
            where: {
                id: serverId,
                profileId: profile.id
            }
        })
        return NextResponse.json(server);
    } catch(error) {
        console.log(error);
        return new NextResponse('Internal Sever error', { status: 500 })
    }
}

