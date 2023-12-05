"use client"

import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { channelSchema } from '@/lib/schema';
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import { useModalStore } from '../hooks/use-modal';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ChannelType } from '@prisma/client';
import qs from 'query-string';
import { useEffect } from 'react';


const CreateChannleModal = () => {
    const { type, isOpen, onClose, data } = useModalStore();
    const { channelType } = data;
    const router = useRouter();
    const params = useParams();

    const isModalOpen = isOpen && type == 'createChannel';

    const form = useForm<z.infer<typeof channelSchema>>({
        resolver: zodResolver(channelSchema),
        defaultValues: {
            name: '',
            type: channelType || ChannelType.TEXT
        }
    })

    useEffect(() => {
        if(channelType) {
            form.setValue('type', channelType)
        } else {
            form.setValue('type', ChannelType.TEXT)
        }
    },[channelType, form])
    
    async function onSubmit(values: z.infer<typeof channelSchema>) {
        try {
            const url = qs.stringifyUrl({
                url: '/api/channel',
                query: {
                    serverId: params?.serverId
                }
            })
            await axios.post(url, values)
            form.reset();
            router.refresh();
            onClose();
        } catch (err) {
            console.log(err)
        }
    }
    const isLoading = form.formState.isSubmitting;

    const handleClose = () => {
        form.reset();
        onClose()
    }
    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className='bg-white text-black'>
                <DialogHeader className='mt-5 p-6'>
                    <DialogTitle className='text-center'>
                        Create a Channel!
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='uppercase text-xs dark:text-secondary/70'>Channel Name</FormLabel>
                                    <FormControl>
                                        <Input className='
                                        bg-zinc-300/50 
                                        border-0
                                        focus-visible:ring-0 
                                        text-black
                                        focus-visible:ring-offset-0
                                        ' placeholder="Enter Channel Name"
                                            disabled={isLoading}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='uppercase text-xs dark:text-secondary/70'>Channel Type</FormLabel>
                                    <Select
                                    disabled={isLoading}
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger
                                            className='bg-zinc-300/50 border-0
                                            focus:ring-0 focus:ring-offset-0 ring-offset-0
                                            text-black capitalize outline-none'>
                                                <SelectValue placeholder='Select A Channel Type'/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.values(ChannelType).map((type) => {
                                                return (
                                                    <SelectItem key={type} value={type} className='capitalize'>
                                                        {type.toLowerCase()}
                                                    </SelectItem>
                                                )
                                            })}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter className='bg-gray-100 px-6 py-4'>
                            <Button variant='primary' type='submit' className='mx-auto' disabled={isLoading}>
                                Create
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateChannleModal