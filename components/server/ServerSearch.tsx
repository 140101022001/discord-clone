'use client'

import { Search } from "lucide-react"
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"
import { KeyboardEvent, useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"

interface ServerSearchProps {
    data: {
        label: string,
        type: "channel" | "member",
        data: {
            id: string,
            name: string,
            icon: React.ReactNode
        }[] | undefined
    }[]
}

const ServerSearch = ({
    data
}: ServerSearchProps) => {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const params = useParams();

    useEffect(() => {
        const keyDown = (e:KeyboardEvent) => {
            console.log('down');
            if(e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open)
            }
        }
        document.addEventListener('keydown', () => keyDown);
        return () => {
            return document.addEventListener('keydown', () => keyDown);
        }
    },[])
    const onClick = ({id, type}: {id: string, type: 'channel' | 'member'}) => {
        setOpen(false);
        if (type == 'member') {
            router.push(`/server/${params?.serverId}/conversations/${id}`)
        }
        if (type == 'channel') {
            router.push(`/server/${params?.serverId}/channels/${id}`)
        }
    }
    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="group p-2 rounded-md flex items-center gap-x-2 w-full
            bg-zinc-700/10 dark:bg-zinc-700/50 transition">
                <Search className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                <p
                    className="font-semibold text-sm text-zinc-500 group-hover:text-zinc-600
                dark:group-hover:text-zinc-300 transition"
                >Search
                </p>
                <kbd className="h-5 pointer-events-none inline-flex
                select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono
                text-[10px] font-medium ml-auto text-muted-foreground">
                    <span className="text-xs">Ctrl</span>K
                </kbd>
            </button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Search all members and channels" />
                <CommandList>
                    <CommandEmpty>
                        No results found!
                    </CommandEmpty>
                    {data.map(({ label, type, data }) => {
                        if (!data?.length) return null;
                        return (
                            <CommandGroup key={label} heading={label}>
                                {data.map(({ id, icon, name }) => {
                                    return (
                                        <CommandItem key={id} onSelect={() =>onClick({id, type})}>
                                            {icon}
                                            <span>{name}</span>
                                        </CommandItem>
                                    )
                                })}
                            </CommandGroup>
                        )
                    })}
                </CommandList>
            </CommandDialog>
        </>
    )
}

export default ServerSearch