"use client"

import { Member, Message, Profile } from "@prisma/client"
import ChatWelcome from "./ChatWelcome"
import { useChatQuery } from "../hooks/useChatQuery"
import { Loader2, ServerCrash } from "lucide-react"
import { Fragment, useRef, ElementRef } from "react"
import ChatItem from "./ChatItem"
import { format } from 'date-fns'
import { useChatSocket } from "../hooks/use-chat-socket"
import { useChatScroll } from "../hooks/use-chat-scroll"

interface ChatMessagesProps {
    name: string
    member: Member
    chatId: string
    apiUrl: string
    socketUrl: string
    socketQuery: Record<string, string>
    paramKey: "channelId" | "conversationId"
    paramValue: string
    type: "channel" | "conversation"
}

type MessageWithProfile = Message & {
    member: Member & {
        profile: Profile
    }
}

const DATE_FORMAT = 'd MMM yyyy, HH:mm';

const ChatMessages = ({
    name,
    member,
    chatId,
    apiUrl,
    socketUrl,
    socketQuery,
    paramKey,
    paramValue,
    type
}
    : ChatMessagesProps) => {
    const queryKey = `chat:${chatId}`;
    const addKey = `chat:${chatId}:messages`;
    const updateKey = `chat:${chatId}:messages:update`

    const chatRef = useRef<ElementRef<"div">>(null);
    const bottomRef = useRef<ElementRef<"div">>(null);

    const { hasNextPage, data, fetchNextPage, isFetchingNextPage, status } = useChatQuery({
        apiUrl,
        queryKey,
        paramKey,
        paramValue
    });
    useChatSocket({ addKey, updateKey, queryKey: queryKey });
    useChatScroll({
        chatRef,
        count: data?.pages?.[0]?.items?.length ?? 0,
        bottomRef,
        loadMore: fetchNextPage,
        shouldLoadMore: !isFetchingNextPage && !!hasNextPage
    })

    if (status == "pending") {
        return (
            <div className="flex flex-col flex-1 items-center justify-center">
                <Loader2 className="text-zinc-500 animate-spin my-4 h-8 w-8" />
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Loading Messages...
                </p>
            </div>
        )
    }

    if (status == "error") {
        return (
            <div className="flex flex-col flex-1 items-center justify-center">
                <ServerCrash className="text-zinc-500 my-4 h-8 w-8" />
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Something went wrong!
                </p>
            </div>
        )
    }

    return (
        <div className="flex-1 flex flex-col py-4 overflow-y-auto" ref={chatRef}>
            {!hasNextPage && (
                <>
                    <div className="flex-1" />
                    <ChatWelcome
                        type={type}
                        name={name} />
                </>
            )
            }
            {hasNextPage && (
                <div className="flex justify-center">
                    {isFetchingNextPage ? (
                        <Loader2 className="h-6 w-6 animate-spin my-4 text-zinc-500"/>
                    ): (
                        <button
                        className="text-zinc-500
                        text-sm dark:text-zinc-400 dark:hover:text-zinc-300
                        hover:text-zinc-600 transition"
                        onClick={()=>fetchNextPage()}
                        >
                            Load previous page
                        </button>
                    )}
                </div>
            )}
            <div className="flex flex-col-reverse mt-auto">
                {data?.pages.map((item, i) => {
                    return (
                        <Fragment key={i}>
                            {item.items?.map((message: MessageWithProfile) => {
                                return (
                                    <ChatItem
                                        id={message.id}
                                        currentMember={member}
                                        member={message.member}
                                        key={message.id}
                                        content={message.content}
                                        fileUrl={message.fileUrl}
                                        deleted={message.deleted}
                                        timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                                        isUpdated={message.createdAt !== message.updatedAt}
                                        socketUrl={socketUrl}
                                        socketQuery={socketQuery}
                                    />
                                )
                            })}
                        </Fragment>
                    )
                })}
            </div>
            <div ref={bottomRef} />
        </div>
    )
}

export default ChatMessages