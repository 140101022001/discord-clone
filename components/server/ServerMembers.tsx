'use client'

import { cn } from "@/lib/utils"
import { Member, MemberRole, Profile, Servers } from "@prisma/client"
import { ShieldAlert, ShieldCheck } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import UserAvatar from "../user-avatar"

interface ServerMembersProps {
    member: Member & { profile: Profile }
    server: Servers
}

const membersRoleMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.ADMIN]: <ShieldAlert className='h-4 w-4 ml-2 text-rose-500' />,
    [MemberRole.MODERATOR]: <ShieldCheck className='h-4 w-4 ml-2 text-indigo-500' />
}
const ServerMembers = ({
    member, server
}
    : ServerMembersProps) => {
    const params = useParams();
    const router = useRouter();
    const Icon = membersRoleMap[member.role]
    const onclick = () => {
        router.push(`/server/${server.id}/conversations/${member.id}`)
    }
    return (
        <button
        onClick={onclick} 
        className={
            cn(
                "group flex p-2 rounded-md items-center gap-x-1 w-full mb-1 transition hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50",
                params?.memberId == member.id && 'bg-zinc-700/20 dark:bg-zinc-700'
            )
        }>
            <UserAvatar
                imageUrl={member.profile.imageUrl}
                className="h-8 w-8 md:h-8 md:w-8"
            />
            <p className={
                cn(
                    "font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 darl:group-hover:text-zinc-300 transition",
                    params?.memberId == member.id && 'text-primary dark:text-zinc-200 dark:group-hover:text-white'
                )
            }>
                {member.profile.name}
            </p>
            {Icon}
        </button>
    )
}

export default ServerMembers