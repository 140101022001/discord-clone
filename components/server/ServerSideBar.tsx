import currentProfile from "@/lib/current-profile"
import { db } from "@/lib/prismadb";
import { redirectToSignIn } from "@clerk/nextjs";
import { ChannelType, MemberRole } from "@prisma/client";
import ServerHeader from "./ServerHeader";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import ServerSearch from "./ServerSearch";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import ServerSection from "./ServerSection";
import ServerChannels from "./ServerChannels";
import ServerMembers from "./ServerMembers";

const iconsMap = {
    [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
    [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
    [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />
}

const membersRoleMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.ADMIN]: <ShieldAlert className='h-4 w-4 mr-2 text-rose-500' />,
    [MemberRole.MODERATOR]: <ShieldCheck className='h-4 w-4 mr-2 text-indigo-500' />
}

const ServerSideBar = async ({ serverId }: { serverId: string }) => {
    const profile = await currentProfile();

    if (!profile) redirectToSignIn()

    const server = await db.servers.findUnique({
        where: {
            id: serverId
        },
        include: {
            channel: {
                orderBy: {
                    createdAt: 'asc'
                }
            },
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

    const textChannels = server?.channel.filter((channel) => channel.type === ChannelType.TEXT);
    const audioChannels = server?.channel.filter((channel) => channel.type === ChannelType.AUDIO);
    const videoChannels = server?.channel.filter((channel) => channel.type === ChannelType.VIDEO);

    const members = server?.member.filter((member) => member.profileId !== profile?.id)
    const role = server?.member.find((members) => members.profileId == profile?.id)?.role

    return (
        <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
            <ServerHeader
                server={server!}
                role={role} />
            <ScrollArea className="flex-1 px-3">
                <div className="mt-2">
                    <ServerSearch
                        data={[
                            {
                                label: "Text channel",
                                type: "channel",
                                data: textChannels?.map((item) => ({
                                    id: item.id,
                                    name: item.name,
                                    icon: iconsMap[item.type]
                                }))
                            },
                            {
                                label: "Voice channel",
                                type: "channel",
                                data: audioChannels?.map((item) => ({
                                    id: item.id,
                                    name: item.name,
                                    icon: iconsMap[item.type]
                                }))
                            },
                            {
                                label: "Video channel",
                                type: "channel",
                                data: videoChannels?.map((item) => ({
                                    id: item.id,
                                    name: item.name,
                                    icon: iconsMap[item.type]
                                }))
                            },
                            {
                                label: "Members",
                                type: "member",
                                data: members?.map((item) => ({
                                    id: item.id,
                                    name: item.profile.name,
                                    icon: membersRoleMap[item.role]
                                }))
                            },
                        ]}
                    />
                </div>
                <Separator className="bg-zinc-200 dark:bg-zinc-700 w-full rounded-md my-2" />
                {!!textChannels?.length && (
                    <div className="mb-2">
                        <ServerSection
                            sectionType="channel"
                            channelType={ChannelType.TEXT}
                            role={role}
                            label="Text channels"
                            server={server!}
                        />
                        <div className="space-y-[2px]">
                            {textChannels.map((channel) => (
                                <ServerChannels
                                    key={channel.id}
                                    server={server!}
                                    channel={channel}
                                    role={role}
                                />
                            ))}
                        </div>
                    </div>
                )}
                <div className="space-y-[2px]">
                    {!!audioChannels?.length && (
                        <div className="mb-2">
                            <ServerSection
                                sectionType="channel"
                                channelType={ChannelType.AUDIO}
                                role={role}
                                label="Voice channels"
                                server={server!}
                            />
                            {audioChannels.map((channel) => (
                                <ServerChannels
                                    key={channel.id}
                                    server={server!}
                                    channel={channel}
                                    role={role}
                                />
                            ))}
                        </div>
                    )}
                </div>
                <div className="space-y-[2px]">
                    {!!videoChannels?.length && (
                        <div className="mb-2">
                            <ServerSection
                                sectionType="channel"
                                channelType={ChannelType.VIDEO}
                                role={role}
                                label="Video channels"
                                server={server!}
                            />
                            {videoChannels.map((channel) => (
                                <ServerChannels
                                    key={channel.id}
                                    server={server!}
                                    channel={channel}
                                    role={role}
                                />
                            ))}
                        </div>
                    )}
                </div>
                <div className="space-y-[2px]">
                    {!!members?.length && (
                        <div className="mb-2">
                            <ServerSection
                                sectionType="member"
                                role={role}
                                label="Members"
                                server={server!}
                            />
                            <div className="space-y-[2px]">
                                {members.map((member) => (
                                    <ServerMembers key={member.id}
                                        member={member}
                                        server={server!}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    )
}

export default ServerSideBar