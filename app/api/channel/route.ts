import currentProfile from "@/lib/current-profile";
import { db } from "@/lib/prismadb";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
) {
    try {
        const profile = await currentProfile();
        if (!profile) {
            return new NextResponse('Unauthorized', { status: 401 })
        }
        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get('serverId');
        const { name, type } = await req.json();
        if (!serverId) {
            return new NextResponse('Server Id Missing', { status: 400 })
        }
        if (name == 'general') {
            return new NextResponse("Channel name can't be 'general'", { status: 400 })
        }
        const server = await db.servers.update({
            where: {
                id: serverId,
                member: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                        }
                    }
                }
            },
            data: {
                channel: {
                    create: {
                        profileId: profile.id,
                        name,
                        type
                    }
                }
            }
        })
        return NextResponse.json(server);
    } catch (err) {
        return new NextResponse('Internal Sever Error', { status: 500 })
    }

}
