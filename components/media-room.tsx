"use client"

import { useState, useEffect } from "react";
import { LiveKitRoom, VideoConference } from '@livekit/components-react';
import '@livekit/components-styles';
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

interface MediaRoomProps {
    chatId: string,
    audio: boolean,
    video: boolean
}

const MediaRoom = ({
    chatId, video, audio
}
    : MediaRoomProps) => {

    const { user } = useUser();
    const [token, setToken] = useState('');

    useEffect(() => {
        if (!user?.firstName || !user.lastName) return

        const name = user.firstName + ' ' + user.lastName;

        (async () => {
            try {
                const res = await fetch(`/api/livekit?room=${chatId}&username=${name}`)
                const data = await res.json();
                setToken(data.token)
            } catch (err) {
                console.log(err);
            }
        })()

    }, [user, chatId])

    if (token == "") {
        return (
            <div className="flex flex-col flex-1 justify-center items-center">
                <Loader2 className="h-8 w-8 text-zinc-600 animate-spin my-4" />
                <p className="text-xs text-zinc-500 dark:text-zinc-300">
                    Loading...
                </p>
            </div>
        )
    }

    return (
        <LiveKitRoom
            serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
            token={token}
            connect={true}
            video={video}
            audio={audio}
            data-lk-theme="default"
        >
            <VideoConference />
        </LiveKitRoom>
    )
}

export default MediaRoom