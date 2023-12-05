'use client'

import { ServerWithMemberWithProfile } from "@/type"
import { ChannelType, MemberRole } from "@prisma/client"
import TooltipAction from "../navigation/Tool-tip"
import { Plus, Settings } from "lucide-react"
import { useModalStore } from "../hooks/use-modal"

interface ServerSectionProps {
    label: string,
    role?: MemberRole,
    sectionType: 'channel' | 'member',
    channelType?: ChannelType,
    server: ServerWithMemberWithProfile
}

const ServerSection = (
    {label, role, sectionType, server, channelType}
:ServerSectionProps) => {
    const { onOpen} = useModalStore();
    return (
        <div className="flex items-center justify-between py-2">
            <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
                {label}
            </p>
            {role !== MemberRole.GUEST && sectionType === 'channel'
            && (
                <TooltipAction label={"Create Channel"} side="top">
                    <button
                    onClick={() => onOpen('createChannel', { channelType })}
                    className="
                    text-zinc-600 dark:text-zinc-400 hover:text-zinc-500 dark:hover:text-zinc-300 transition">
                        <Plus className="h-4 w-4"/>
                    </button>
                </TooltipAction>
            )}
            {role == MemberRole.ADMIN && sectionType == 'member'
            && (
                <TooltipAction label="Manage Members" side="top">
                    <button
                    onClick={() => onOpen('members', { server: server })}
                    className="
                    text-zinc-600 dark:text-zinc-400 hover:text-zinc-500 dark:hover:text-zinc-300 transition">
                        <Settings className="h-4 w-4"/>
                    </button>
                </TooltipAction>
            )}
        </div>
    )
}

export default ServerSection