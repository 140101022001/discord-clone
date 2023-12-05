'use client'

import { cn } from "@/lib/utils"
import { Channel, ChannelType, MemberRole, Servers } from "@prisma/client"
import { Edit, Hash, Lock, Mic, Trash, Video } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import TooltipAction from "../navigation/Tool-tip"
import { Modaltype, useModalStore } from "../hooks/use-modal"

interface ServerChannelsProps {
    server: Servers,
    channel: Channel,
    role?: MemberRole
}
const iconsMap = {
    [ChannelType.TEXT]: Hash,
    [ChannelType.AUDIO]: Mic,
    [ChannelType.VIDEO]: Video
}
const ServerChannels = (
    { server, channel, role }
        : ServerChannelsProps) => {
    const Icon = iconsMap[channel.type]
    const params = useParams();
    const router = useRouter();
    const {onOpen} = useModalStore();
    const onClick = () => {
        router.push(`/server/${server.id}/channels/${channel.id}`);
    }
    const onAction = (e:React.MouseEvent, action: Modaltype) => {
        e.stopPropagation();
        onOpen(action, { server, channel })
    }
    return (
        <button
        onClick={onClick}
        className={cn(
            "group p-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 mb-1 dark:hover:bg-zinc-700/50 transition",
            params?.channelId == channel.id && "bg-zinc-700/20 dark:bg-zinc-700")}>
            <Icon className="w-5 h-5 flex-shrink-0 text-zinc-500 dark:text-zinc-400"/>
            <p className={cn(
                "line-clamp-1 font-semibold text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-500 dark:hover:bg-zinc-300 transiton",
                params?.channelId == channel.id && "text-primary dark:text-zinc-200 dark:group-hover:text-white"
            )}>
                {channel.name}
            </p>
            {channel.name !== 'general' && role !== MemberRole.GUEST && (
                <div className="ml-auto flex items-center gap-x-2">
                    <TooltipAction label="Edit">
                        <Edit className="
                        hidden group-hover:block text-zinc-500 h-4 w-4 dark:text-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300"
                        onClick={(e) => onAction(e, 'editChannel')}/>
                    </TooltipAction>
                    <TooltipAction label="Delete">
                        <Trash className="
                        hidden group-hover:block text-zinc-500 h-4 w-4 dark:text-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300"
                        onClick={(e) =>onAction(e, 'deleteChannel')}/>
                    </TooltipAction>
                </div>
            )}
            {channel.name == 'general' && (
                <Lock className="ml-auto h-4 w-4 text-zinc-500 dark:text-zinc-400"/>
            )}
        </button>
    )
}

export default ServerChannels