"use client"

import { ChatInputSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form"
import * as z from 'zod';
import {
    Form,
    FormField,
    FormControl,
    FormItem
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Plus } from "lucide-react";
import qs from 'query-string';
import axios from "axios";
import { useModalStore } from "../hooks/use-modal";
import EmojiPicker from "./EmojiPicker";
import { useRouter } from "next/navigation";

interface ChatInputProps {
    apiUrl: string,
    query: Record<string, string>,
    name: string
    type: "conversation" | "channel"
}

const ChatInput = ({
    apiUrl,
    query,
    name,
    type
}:
    ChatInputProps) => {
    const { onOpen } = useModalStore();
    const router = useRouter();
    const form = useForm<z.infer<typeof ChatInputSchema>>({
        resolver: zodResolver(ChatInputSchema),
        defaultValues: {
            content: '',
        }
    })

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof ChatInputSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: apiUrl,
                query
            })
            await axios.post(url, values);
            form.reset();
            router.refresh();
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div className="relative p-4 pb-6">
                                    <button
                                        type="button"
                                        onClick={() => onOpen('messageFile', { apiUrl, query })}
                                        className="absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500
                                dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition
                                rounded-full p1 flex items-center justify-center"
                                    >
                                        <Plus className="text-white dark:text-[#313338]" />
                                    </button>
                                    <Input
                                        disabled={isLoading}
                                        className="px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75
                                border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0
                                text-zinc-600 dark:text-zinc-300"
                                        placeholder={`Message to ${type == "channel" ? `#${name}` : name}`}
                                        {...field}
                                    />
                                    <div className="absolute top-7 right-8">
                                        <EmojiPicker 
                                        onChange={(emoji: string) => field.onChange(`${field.value} ${emoji}`)}/>
                                    </div>
                                </div>
                            </FormControl>
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    )
}

export default ChatInput