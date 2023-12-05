import { Hash } from "lucide-react"
import MobileToggle from "../mobile-toggle"
import UserAvatar from "../user-avatar"
import SocketIndicator from "../socket-indicator"
import ChatVideoButton from "../chat-video"

interface ChatHeaderProps {
    serverId: string
    name: string,
    type: "conversation" | "channel"
    imageUrl?: string
}

const ChatHeader = (
    { serverId, name, type, imageUrl}
    : ChatHeaderProps
) => {
    return (
        <div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200
        dark:border-neutral-800 border-b-2">
            <MobileToggle serverId={serverId}/>
            {type == 'channel' && (
                <Hash className="h-5 w-5 text-zinc-500 mr-2 dark:text-zinc-400"/>
            )}
            {imageUrl && type == 'conversation' && (
                <UserAvatar imageUrl={imageUrl} className="w-8 h-8 md:h-8 md:w-8 mr-2"/>
            )}
            <p className="text-md font-semibold text-black dark:text-white">
                {name}
            </p>
            <div className="ml-auto text-md font-semibold">
                {type == "conversation" && (
                    <ChatVideoButton/>
                )}
                <SocketIndicator/>
            </div>
        </div>
    )
}

export default ChatHeader