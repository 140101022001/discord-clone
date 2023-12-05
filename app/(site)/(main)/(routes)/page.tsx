import InitialModal from "@/components/modals/initial-modal";
import { initialProfile } from "@/lib/initialProfile"
import { db } from "@/lib/prismadb";
import { redirect } from "next/navigation";

const SetupPage = async () => {
    const profile = await initialProfile();

    const server = await db.servers.findFirst({
        where: {
            member: {
                some: {
                    profileId: profile.id
                }
            }
        }
    })
    if (server) {
        return redirect(`/server/${server.id}`)
    }
    
    return (
        <InitialModal />
    )
}

export default SetupPage