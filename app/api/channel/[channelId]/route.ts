import currentProfile from "@/lib/current-profile";
import { db } from "@/lib/prismadb";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function DELETE(req: Request,
    { params }: { params: { channelId: string } }) {
    try {
        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get('serverId');
        const profile = await currentProfile();

        if (!profile) return new NextResponse('Unauthorized', { status: 401 })

        if (!serverId) {
            return new NextResponse('Server Id Missing', { status: 400 })
        }
        if (!params.channelId) {
            return new NextResponse('Channel Id Missing', { status: 400 })
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
                    delete: {
                        id: params.channelId,
                        name: {
                            not: 'general'
                        }
                    }
                }
            }
        })
        return NextResponse.json(server);
    } catch (error) {
        console.log(error);
        return new NextResponse('Internal Sever error', { status: 500 })
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { channelId: string } }
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
        if (!params.channelId) {
            return new NextResponse('Channel Id Missing', { status: 400 })
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
                    update: {
                        where: {
                            id: params.channelId,
                            name: {
                                not: 'general'
                            }
                        },
                        data: {
                            name: name,
                            type: type
                        }
                    }
                }
            }
        })
        return NextResponse.json(server);
    } catch (err) {
        return new NextResponse('Internal Sever Error', { status: 500 })
    }

}
