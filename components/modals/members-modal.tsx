"use client"

import qs from 'query-string';
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogDescription } from '@/components/ui/dialog';
import { useModalStore } from '../hooks/use-modal';
import { ServerWithMemberWithProfile } from '@/type';
import { ScrollArea } from '../ui/scroll-area';
import UserAvatar from '../user-avatar';
import { Check, Gavel, Loader2, MoreVertical, Shield, ShieldAlert, ShieldCheck, ShieldQuestion } from 'lucide-react';
import { useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MemberRole } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const membersRoleMap = {
    "GUEST": null,
    "ADMIN": <ShieldAlert className='h-4 w-4 ml-1 text-rose-500' />,
    "MODERATOR": <ShieldCheck className='h-4 w-4 ml-1 text-indigo-500' />
}

const MembersModal = () => {
    const { type, isOpen, onClose, data, onOpen } = useModalStore();

    const [loadingId, setLoadingId] = useState('');
    const router = useRouter();

    const { server } = data as { server: ServerWithMemberWithProfile };
    const isModalOpen = isOpen && type == 'members';

    const handleChangeUserRole = async (memberId: string, role: MemberRole) => {
        try {
            setLoadingId(memberId)
            const url = qs.stringifyUrl({
                url: `/api/members/${memberId}`,
                query: {
                    serverId: server.id
                }
            })
            const res = await axios.patch(url, { role })
            router.refresh();
            onOpen('members', { server: res.data })
        } catch(err) {
            console.log(err);
        } finally {
            setLoadingId('')
        }
    }
    const handleKickUser = async (memberId: string) => {
        try {
            setLoadingId(memberId)
            const url = qs.stringifyUrl({
                url: `/api/members/${memberId}`,
                query: {
                    serverId: server.id
                }
            })
            const res = await axios.delete(url)
            router.refresh();
            onOpen('members', { server: res.data })
        } catch(err) {
            console.log(err);
        } finally {
            setLoadingId('')
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className='bg-white text-black'>
                <DialogHeader className='mt-5 p-6'>
                    <DialogTitle className='text-center'>
                        Invite Friends!
                    </DialogTitle>
                    <DialogDescription className='text-center text-zinc-400'>
                        {server?.member?.length} Member(s)
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className='mt-8 max-h-[420px] pr-6'>
                    {server?.member?.map((member) => {
                        return (
                            <div key={member.id} className='flex items-center mb-6 gap-x-2'>
                                <UserAvatar imageUrl={member.profile.imageUrl} className='' />
                                <div className='flex flex-col gap-y-1'>
                                    <div className='text-sm font-semibold flex items-center'>
                                        {member.profile.name}
                                        {membersRoleMap[member.role]}
                                    </div>
                                    <p className='text-xs text-zinc-500'>
                                        {member.profile.email}
                                    </p>
                                </div>
                                {
                                    server.profileId !== member.profileId &&
                                    loadingId !== member.profileId && (
                                        <div className='ml-auto'>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger>
                                                    <MoreVertical className='h-4 w-4 text-zinc-500'/>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent side='right'>
                                                    <DropdownMenuSub>
                                                        <DropdownMenuSubTrigger className='flex items-center'>
                                                            <ShieldQuestion className='h-4 w-4 mr-2'/>
                                                            <span>Role</span>
                                                        </DropdownMenuSubTrigger>
                                                        <DropdownMenuPortal>
                                                            <DropdownMenuSubContent>
                                                                <DropdownMenuItem onClick={() =>handleChangeUserRole(member.id, MemberRole.GUEST)}>
                                                                    <Shield className='h-4 w-4 mr-2'/>
                                                                    Guest
                                                                    {
                                                                        member.role == MemberRole.GUEST && (
                                                                            <Check className='h-4 w-4 ml-auto'/>
                                                                        )
                                                                    }
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() =>handleChangeUserRole(member.id, MemberRole.MODERATOR)}>
                                                                    <Shield className='h-4 w-4 mr-2'/>
                                                                    Moderator
                                                                    {
                                                                        member.role == MemberRole.MODERATOR && (
                                                                            <Check className='h-4 w-4 ml-auto'/>
                                                                        )
                                                                    }
                                                                </DropdownMenuItem>
                                                            </DropdownMenuSubContent>
                                                        </DropdownMenuPortal>
                                                    </DropdownMenuSub>
                                                    <DropdownMenuSeparator/>
                                                    <DropdownMenuItem onClick={() =>handleKickUser(member.id)}>
                                                        <Gavel className='h-4 w-4 mr-2'/>
                                                        Kick
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    )
                                }
                                {
                                    loadingId === member.profileId && (
                                        <Loader2 className='text-zinc-500 h-4 w-4 animate-spin ml-auto'/>
                                    )
                                }
                            </div>
                        )
                    })}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}

export default MembersModal