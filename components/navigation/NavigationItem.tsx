'use client'

import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import TooltipAction from "./Tool-tip"

interface NavigationItemProps {
    id: string,
    name: string,
    imageUrl: string
}


const NavigationItem = ({
    id,
    name,
    imageUrl
}:NavigationItemProps) => {
    const params = useParams();
    const route = useRouter();
    const onClick = () => {
        route.push(`/server/${id}`)
    }
    return (
        <TooltipAction
        align="center"
        side="right"
        label={name}>
            <button className="group relative flex items-center" onClick={onClick}>
                <div className={cn(`absolute left-0 bg-primary rounded-r-full transition-all w-[4px]`,
                params?.serverId !==id && 'group-hover:h-[20px]',
                params?.serverId ==id ? 'h-[36px]': 'h-[8px]')}/>
                <div className={cn('relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden',
                params?.serverId ==id && 'bg-primary/10 text-primary rounded-[16px]')}>
                    <Image fill src={imageUrl} alt="Channel"/>
                </div>
            </button>
        </TooltipAction>
    )
}

export default NavigationItem