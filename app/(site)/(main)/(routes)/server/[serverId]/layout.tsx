import ServerSideBar from "@/components/server/ServerSideBar";
import currentProfile from "@/lib/current-profile"
import { db } from "@/lib/prismadb";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";


const ServerIdLayout = async ({
    children,
    params
}: { children: React.ReactNode, params: { serverId: string} }) => {
    const profile = await currentProfile();

    if (!profile) redirectToSignIn()

    const server = await db.servers.findUnique({
        where: {
            id: params.serverId,
            member: {
                some: {
                    profileId: profile?.id
                }
            }
        }
    })

    if(!server) redirect('/')
    
    return (
        <div className="h-full">
            <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
                <ServerSideBar serverId={server.id}/>
            </div>
            <main className="h-full md:pl-60">
                {children}
            </main>
        </div>
    )
}

export default ServerIdLayout