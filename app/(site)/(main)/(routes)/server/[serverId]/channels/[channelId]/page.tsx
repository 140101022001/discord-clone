import ChatHeader from "@/components/chats/ChatHeader"
import ChatInput from "@/components/chats/ChatInput"
import ChatMessages from "@/components/chats/ChatMessages"
import MediaRoom from "@/components/media-room"
import currentProfile from "@/lib/current-profile"
import { db } from "@/lib/prismadb"
import { redirectToSignIn } from "@clerk/nextjs"
import { ChannelType } from "@prisma/client"
import { redirect } from "next/navigation"

interface ChannelIdPageProps {
    params: {
        serverId: string
        channelId: string
    }
}

const ChannelIdPage = async ({ params }
    : ChannelIdPageProps) => {
    const profile = await currentProfile();
    if (!profile) return redirectToSignIn();

    const channel = await db.channel.findUnique({
        where: {
            id: params.channelId
        }
    })

    const member = await db.member.findFirst({
        where: {
            serverId: params.serverId,
            profileId: profile.id
        }
    })
    if (!channel || !member) return redirect('/');

    return (
        <div
            className="flex bg-white dark:bg-[#313338] flex-col h-full"
        >
            <ChatHeader name={channel.name} serverId={params.serverId} type="channel" />
            {channel.type == ChannelType.TEXT && (
                <>
                    <ChatMessages
                        name={channel.name}
                        member={member}
                        type="channel"
                        apiUrl="/api/messages"
                        socketQuery={{
                            channelId: channel.id,
                            serverId: channel.serverId
                        }}
                        paramKey="channelId"
                        paramValue={channel.id}
                        chatId={channel.id}
                        socketUrl="/api/socket/messages"
                    />
                    <ChatInput
                        name={channel.name}
                        apiUrl="/api/socket/messages"
                        query={{
                            channelId: channel.id,
                            serverId: channel.serverId
                        }}
                        type="channel"
                    />
                </>
            )}
            {channel.type == ChannelType.AUDIO && (
                <MediaRoom
                    chatId={channel.id}
                    video={false}
                    audio={true}
                />
            )}
            {channel.type == ChannelType.VIDEO && (
                <MediaRoom
                    chatId={channel.id}
                    video={true}
                    audio={false}
                />
            )}
        </div>
    )
}

export default ChannelIdPage