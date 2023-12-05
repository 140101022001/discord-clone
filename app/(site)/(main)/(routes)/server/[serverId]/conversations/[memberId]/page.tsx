import ChatHeader from "@/components/chats/ChatHeader";
import ChatInput from "@/components/chats/ChatInput";
import ChatMessages from "@/components/chats/ChatMessages";
import MediaRoom from "@/components/media-room";
import { getOrCreateConversation } from "@/lib/conversation";
import currentProfile from "@/lib/current-profile"
import { db } from "@/lib/prismadb";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface MemberIdPageProps {
    params: {
        memberId: string,
        serverId: string
    }
    searchParams: {
        video?: boolean;
        audio?: boolean;
    }
}

const MemberIdPage = async (
    { params, searchParams }: MemberIdPageProps
) => {
    const profile = await currentProfile();

    if (!profile) return redirectToSignIn();

    const currentMember = await db.member.findFirst({
        where: {
            serverId: params.serverId,
            profileId: profile.id
        },
        include: {
            profile: true
        }
    })

    if (!currentMember) return redirect('/')

    const conversation = await getOrCreateConversation(currentMember.id, params.memberId);

    if (!conversation) return redirect(`/server/${params.serverId}`)

    const { memberOne, memberTwo } = conversation;

    const otherMember = memberOne.profileId == profile.id ? memberTwo : memberOne;

    return (
        <div className="flex flex-col h-full bg-white dark:bg-[#313338]">
            {searchParams.video && (
                <MediaRoom
                    chatId={`${conversation.id}:video`}
                    video={true}
                    audio={false}
                />
            )}
            {searchParams.audio && (
                <MediaRoom
                    chatId={`${conversation.id}:audio`}
                    video={false}
                    audio={true}
                />
            )}
            {!searchParams.video && !searchParams.audio && (
                <>
                    <ChatHeader name={otherMember.profile.name}
                        imageUrl={otherMember.profile.imageUrl}
                        serverId={params.serverId}
                        type="conversation" />
                    <ChatMessages
                        member={currentMember}
                        name={otherMember.profile.name}
                        chatId={conversation.id}
                        type="conversation"
                        apiUrl="/api/direct-messages"
                        paramKey="conversationId"
                        paramValue={conversation.id}
                        socketUrl="/api/socket/direct-messages"
                        socketQuery={{
                            conversationId: conversation.id
                        }}
                    />
                    <ChatInput
                        name={otherMember.profile.name}
                        type="conversation"
                        apiUrl="/api/socket/direct-messages"
                        query={{
                            conversationId: conversation.id
                        }}
                    />
                </>
            )}
        </div>
    )
}

export default MemberIdPage