import currentProfile from "@/lib/current-profile"
import { db } from "@/lib/prismadb";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const InviteCodePage = async ({params}: {params: { inviteCode: string}}) => {
    const profile = await currentProfile();
    if (!profile) {
        return redirectToSignIn()
    }
    if (!params.inviteCode) {
        return redirect('/')
    }

    const existingServer = await db.servers.findUnique({
        where: {
            inviteCode: params.inviteCode
        },
        include: {
            member: true
        }
    })
    existingServer?.member.map(async (member) => {
        if (member.profileId == profile.id) {
            return redirect(`/server/${existingServer.id}`)
        } else  {
            await db.servers.update({
                where: {
                    inviteCode: params.inviteCode
                },
                data: {
                    member: {
                        create: [
                            {
                                profileId: profile.id
                            }
                        ]
                    }
                }
            })
        }
    })
    if (existingServer) {
        return redirect(`/server/${existingServer.id}`)
    }
    return (
        <div>InviteCodePage</div>
    )
}

export default InviteCodePage