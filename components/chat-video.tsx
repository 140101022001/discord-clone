"use client"

import React from 'react'
import qs from 'query-string'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import TooltipAction from './navigation/Tool-tip'
import { Mic, MicOff, Video, VideoOff } from 'lucide-react'

const ChatVideoButton = () => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const isVideo = searchParams?.get('video');
    const isAudio = searchParams?.get('audio')
    const VideoIcon = isVideo ? Video : VideoOff;
    const AudioIcon = isAudio ? Mic : MicOff

    const onClick = () => {
        const url = qs.stringifyUrl({
            url: pathname || "",
            query: {
                video: isVideo ? undefined : true
            }
        },
            { skipNull: true })

        router.push(url)
    }

    const onClickOpenAudio = () => {
        const url = qs.stringifyUrl({
            url: pathname || "",
            query: {
                audio: isAudio ? undefined : true
            }
        },
            { skipNull: true })

        router.push(url)
    }
    return (
        <>
            <TooltipAction label={isVideo ? 'Turn off video' : 'Start video call'}>
                <button className='hover:opacity-75 transition mr-4' onClick={onClick}>
                    <VideoIcon className='h-5 w-5 text-zinc-500 dark:text-zinc-300' />
                </button>
            </TooltipAction>
            <TooltipAction label={isAudio ? 'Turn off audio' : 'Start audio call'}>
                <button className='hover:opacity-75 transition mr-4' onClick={onClickOpenAudio}>
                    <AudioIcon className='h-5 w-5 text-zinc-500 dark:text-zinc-300' />
                </button>
            </TooltipAction>
        </>
    )
}

export default ChatVideoButton