import currentProfile from "@/lib/current-profile";
import { db } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { memberId: string } }
) {
    try {
        const { searchParams } = new URL(req.url);
        const { role } = await req.json();
        const profile = await currentProfile();
        if (!profile) {
            return new NextResponse('Unauthorized', { status: 401 })
        }
        if (!params.memberId) {
            return new NextResponse('Member Id Missing', { status: 400 })
        }

        const serverId = searchParams.get('serverId');

        if (!serverId) {
            return new NextResponse('Server Id Missing', { status: 400 })
        }

        const server = await db.servers.update({
            where: {
                profileId: profile.id,
                id: serverId
            },
            data: {
                member: {
                    update: {
                        where: {
                            id: params.memberId,
                            profileId: {
                                not: profile.id
                            }
                        },
                        data: {
                            role
                        }
                    }
                }
            },
            include: {
                member: {
                    include: {
                        profile: true
                    },
                    orderBy: {
                        role: 'asc'
                    }
                }
            }
        })
        if (!server) {
            return new NextResponse('Server Not Found', { status: 404 })
        }
        return NextResponse.json(server)
    } catch (err) {
        return new NextResponse('Internal Sever Error', { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { memberId: string } }
) {
    try {
        const { searchParams } = new URL(req.url);
        const profile = await currentProfile();
        if (!profile) {
            return new NextResponse('Unauthorized', { status: 401 })
        }
        if (!params.memberId) {
            return new NextResponse('Member Id Missing', { status: 400 })
        }

        const serverId = searchParams.get('serverId');

        if (!serverId) {
            return new NextResponse('Server Id Missing', { status: 400 })
        }

        const server = await db.servers.update({
            where: {
                profileId: profile.id,
                id: serverId
            },
            data: {
                member: {
                    delete: {
                        id: params.memberId,
                        profileId: {
                            not: profile.id
                        }
                    }
                }
            },
            include: {
                member: {
                    include: {
                        profile: true
                    },
                    orderBy: {
                        role: 'asc'
                    }
                }
            }
        })
        if (!server) {
            return new NextResponse('Server Not Found', { status: 404 })
        }
        return NextResponse.json(server)
    } catch (err) {
        return new NextResponse('Internal Sever Error', { status: 500 })
    }
}