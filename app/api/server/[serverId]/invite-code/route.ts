import currentProfile from "@/lib/current-profile";
import { db } from "@/lib/prismadb";
import { NextResponse } from "next/server";
import {v4 as uuidv4} from 'uuid';

export async function PATCH(
    req: Request,
    { params }: { params: { serverId: string } }
) {
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
                profileId: profile.id,
                id: params.serverId
            },
            data: {
                inviteCode: uuidv4()
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