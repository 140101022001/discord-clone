'use client'

import { ServerWithMemberWithProfile } from '@/type';
import { MemberRole } from '@prisma/client';

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { ChevronDown, LogOut, PlusCircle, Settings, Trash, UserPlus, Users } from 'lucide-react';
import { useModalStore } from '../hooks/use-modal';

interface ServerHeaderProps {
    server: ServerWithMemberWithProfile
    role?: MemberRole
}

const ServerHeader = ({
    server,
    role
}: ServerHeaderProps) => {
    const { onOpen } = useModalStore();
    const isAdmin = role == MemberRole.ADMIN
    const isModerator = role == MemberRole.MODERATOR || isAdmin
    
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild className='focus:outline-none'>
                <button className='
                w-full text-md font-semibold px-3 flex
                items-center h-12 border-neutral-200 dark:border-neutral-800
                border-b-2 hover:bg-zinc-700/10 dark:bg-zinc-700/50 transition'>
                    {server.name}
                    <ChevronDown className='h-5 w-5 md:ml-auto ml-2'/>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
            className='w-56 text-xs font-medium text-black space-y-[2px] dark:text-neutral-400'>
                {isModerator && (
                    <DropdownMenuItem className='text-sm text-indigo-500 dark:text-indigo-400 cursor-pointer px-3 py-2'
                    onClick={() =>onOpen('invite', { server })}>
                        Invite People
                        <UserPlus className='ml-auto h-4 w-4'/>
                    </DropdownMenuItem>
                )}
                {isAdmin && (
                    <DropdownMenuItem className='text-sm text-indigo-500 dark:text-indigo-400 cursor-pointer px-3 py-2'
                    onClick={() =>onOpen('editServer', { server })}>
                        Server Settings
                        <Settings className='ml-auto h-4 w-4'/>
                    </DropdownMenuItem>
                )}
                {isAdmin && (
                    <DropdownMenuItem className='text-sm text-indigo-500 dark:text-indigo-400 cursor-pointer px-3 py-2'
                    onClick={() =>onOpen('members', { server })}>
                        Manage Members
                        <Users className='ml-auto h-4 w-4'/>
                    </DropdownMenuItem>
                )}
                {isModerator && (
                    <DropdownMenuItem className='text-sm text-indigo-500 dark:text-indigo-400 cursor-pointer px-3 py-2'
                    onClick={() =>onOpen('createChannel', { server })}>
                        Create Channels
                        <PlusCircle className='ml-auto h-4 w-4'/>
                    </DropdownMenuItem>
                )}
                {isModerator && (
                    <DropdownMenuSeparator/>
                )}
                {isAdmin && (
                    <DropdownMenuItem className='text-sm text-rose-500 dark:text-rose-400 cursor-pointer px-3 py-2'
                    onClick={() =>onOpen('deleteServer', { server })}>
                        Delete Server
                        <Trash className='ml-auto h-4 w-4'/>
                    </DropdownMenuItem>
                )}
                {!isAdmin && (
                    <DropdownMenuItem className='text-sm text-rose-500 dark:text-rose-400 cursor-pointer px-3 py-2'
                    onClick={() =>onOpen('leaveServer', { server })}>
                        Leave Server
                        <LogOut className='ml-auto h-4 w-4'/>
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default ServerHeader