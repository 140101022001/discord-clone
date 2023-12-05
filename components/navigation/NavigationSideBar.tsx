import currentProfile from "@/lib/current-profile"
import { db } from "@/lib/prismadb";
import { redirect } from "next/navigation";
import NavigationAction from "./NavigationAction";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import NavigationItem from "./NavigationItem";
import { ModeToggle } from "../change-mode";
import { UserButton } from "@clerk/nextjs";

const NavigationSideBar = async () => {
    const profile = await currentProfile();

    if (!profile) redirect('/')

    const servers = await db.servers.findMany({
        where: {
            member: {
                some: {
                    profileId: profile.id
                }
            }
        }
    })

    return (
        <div
            className="space-y-4 flex flex-col items-center h-full w-full text-primary py-3 dark:bg-[#1E1F22] bg-[#E5E3E8]"
        >
            <NavigationAction/>
            <Separator
            className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto"/>
            <ScrollArea className="flex-1 w-full">
                {servers.map((server) => {
                    return(
                        <div key={server.id} className="mb-4">
                            <NavigationItem id={server.id} name={server.name} imageUrl={server.imageUrl}/>
                        </div>
                    )
                })}
            </ScrollArea>
            <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
                <ModeToggle/>
                <UserButton
                afterSignOutUrl="/"
                appearance={{
                    elements: {
                        avatarBox: 'h-[48px] w-[48px]'
                    }
                }}
                />
            </div>
        </div>
    )
}

export default NavigationSideBar