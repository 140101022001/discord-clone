import currentProfile from "@/lib/current-profile";
import { db } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function PATCH(req: Request,
    { params }: { params: { serverId: string } }) {
    try {
        const profile = await currentProfile();
        if (!profile) {
            return new NextResponse('Unauthorized', { status: 401 })
        }
        
        if (!params.serverId) {
            return new NextResponse('Server Id Missing', { status: 400 })
        }

        const server = await db.servers.update({
            where: {
                id: params.serverId,
                profileId: {
                    not: profile.id
                },
                member: {
                    some: {
                        profileId: profile.id
                    }
                }
            },
            data: {
                member: {
                    deleteMany: {
                        profileId: profile.id
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