"use client"

import * as z from 'zod'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Member, MemberRole, Profile } from "@prisma/client"
import UserAvatar from "../user-avatar"
import TooltipAction from "../navigation/Tool-tip"
import { Edit, FileIcon, MoreVertical, ShieldAlert, ShieldCheck, Trash } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import {
    Form,
    FormControl,
    FormField,
    FormItem
} from '@/components/ui/form'
import { ChatInputSchema } from '@/lib/schema';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import qs from 'query-string'
import axios from 'axios';
import { useModalStore } from '../hooks/use-modal';
import { useRouter, useParams } from 'next/navigation';

interface ChatItemProps {
    id: string
    content: string
    member: Member & {
        profile: Profile
    }
    timestamp: string,
    fileUrl: string | null,
    deleted: boolean,
    currentMember: Member
    isUpdated: boolean
    socketUrl: string,
    socketQuery: Record<string, string>
}

const membersRoleMap = {
    "GUEST": null,
    "ADMIN": <ShieldAlert className='h-4 w-4 ml-1 text-rose-500' />,
    "MODERATOR": <ShieldCheck className='h-4 w-4 ml-1 text-indigo-500' />
}
const ChatItem = ({
    id,
    content,
    member, timestamp,
    fileUrl,
    deleted,
    currentMember,
    isUpdated,
    socketUrl,
    socketQuery
}: ChatItemProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const { onOpen } = useModalStore();
    const params = useParams();
    const router = useRouter();

    const form = useForm<z.infer<typeof ChatInputSchema>>({
        resolver: zodResolver(ChatInputSchema),
        defaultValues: {
            content: content
        }
    })

    useEffect(() => {
        form.reset({
            content: content
        })
    }, [content, form, isEditing])

    const onMemberClick = () => {
        if (member.id == currentMember.id) {
            return
        }
        router.push(`/server/${params?.serverId}/conversations/${member.id}`)
    }

    const onSubmit = async (values: z.infer<typeof ChatInputSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: `${socketUrl}/${id}`,
                query: socketQuery
            })
            await axios.patch(url, values);
            form.reset();
            setIsEditing(false);
        } catch (error) {

        }
    }
    
    const fileType = fileUrl?.split('.').pop();

    const isAdmin = currentMember.role == MemberRole.ADMIN
    const isModerator = currentMember.role == MemberRole.MODERATOR
    const isOwner = currentMember.id == member.id;
    const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
    const canUpdateMessage = !deleted && isOwner && !fileUrl;
    const isPdf = fileUrl && fileType == 'pdf';
    const isImage = fileUrl && (fileType == 'png' || fileType == 'jpg');
    const isVideo = fileUrl && fileType == 'mp4';

    const isLoading = form.formState.isSubmitting;

    return (
        <div className="relative group flex items-center hover:bg-black/5
        p-4 transition w-full">
            <div className="group flex gap-x-2 items-start w-full">
                <div className="cursor-pointer hover:drop-shadow-md transition" onClick={onMemberClick}>
                    <UserAvatar imageUrl={member.profile.imageUrl} className="" />
                </div>
                <div className="flex flex-col w-full">
                    <div className="flex items-center gap-x-2">
                        <div className="flex items-center">
                            <p className="font-semibold text-sm cursor-pointer hover:underline" onClick={onMemberClick}>
                                {member.profile.name}
                            </p>
                            <TooltipAction label={member.role}>
                                {membersRoleMap[member.role]}
                            </TooltipAction>
                        </div>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                            {timestamp}
                        </span>
                    </div>
                    {isImage && (
                        <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative aspect-square mt-2 rounded-md overflow-hidden
                        h-60 w-60 border flex items-center bg-secondary"
                        >
                            <Image
                                src={fileUrl}
                                alt={content}
                                fill
                                className="object-cover"
                            />
                        </a>
                    )}
                    {
                        isPdf && (
                            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
                                <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
                                <a
                                    href={fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
                                >
                                    PDF file
                                </a>
                            </div>
                        )
                    }
                    {
                        !fileUrl && (
                            <p className={
                                cn('text-sm text-zinc-600 dark:text-zinc-300',
                                    deleted && 'text-xs mt-1 italic text-zinc-500 dark:text-zinc-400')
                            }>
                                {content}
                                {isUpdated && !deleted && (
                                    <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                                        (edited)
                                    </span>
                                )}
                            </p>
                        )
                    }
                    {
                        !fileUrl && isEditing && (
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)}
                                    className='flex items-center w-full pt-2 gap-x-2'>
                                    <FormField
                                        control={form.control}
                                        name='content'
                                        render={({ field }) => (
                                            <FormItem className='flex-1'>
                                                <FormControl>
                                                    <div className='relative w-full'>
                                                        <Input className='p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0
                                                    focus-visible:ring-0 focus-visible:ring-offset-0
                                                    text-zinc-600 dark:text-zinc-200'
                                                            placeholder='Edit message'
                                                            {...field}
                                                        disabled={isLoading}
                                                        />
                                                    </div>
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <Button type='button' variant='rose' size='sm' onClick={() => setIsEditing(false)} disabled={isLoading}>Cancel</Button>
                                    <Button type='submit' variant='primary' size='sm' disabled={isLoading}>Save</Button>
                                </form>
                                <span className='text-[12px] mt-1 text-zinc-400'>
                                    Press Enter to save
                                </span>
                            </Form>
                        )
                    }
                    {
                        isVideo && (
                            <>
                                <video width="640" height="360" controls className="mt-3">
                                    <source src={fileUrl} type="video/mp4" />
                                </video>
                            </>
                        )
                    }
                </div>
            </div>
            {canDeleteMessage && (
                <>
                    {canUpdateMessage && (
                        !isEditing &&
                        <div>
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <MoreVertical className='h-5 w-5 text-zinc-700 dark:text-zinc-200 p-1 border' />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent side='top'>
                                    <DropdownMenuItem onClick={() => setIsEditing(true)}>
                                        <TooltipAction label="Edit">
                                            <div className='flex gap-x-2'>
                                                <Edit
                                                    className='h-4 w-4 text-zinc-500 dark:text-zinc-300'
                                                />
                                                <span>Edit</span>
                                            </div>
                                        </TooltipAction>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => onOpen('deleteMessage', {apiUrl: `${socketUrl}/${id}`, query: socketQuery })}>
                                        <TooltipAction label="Delete">
                                            <div className='flex gap-x-2'>
                                                <Trash
                                                    className='h-4 w-4 text-zinc-500 dark:text-zinc-300'
                                                />
                                                <span>Delete</span>
                                            </div>
                                        </TooltipAction>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                    )}
                </>
            )}
        </div>
    )
}

export default ChatItem