"use client"

import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { messageFileSchema } from '@/lib/schema';
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import FileUpload from '../file-upload';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useModalStore } from '../hooks/use-modal';
import qs from 'query-string'

const MessageFileModal = () => {
    const {isOpen, onClose, data, type } = useModalStore();

    const { apiUrl, query } = data;
    const router = useRouter();
    const form = useForm<z.infer<typeof messageFileSchema>>({
        resolver: zodResolver(messageFileSchema),
        defaultValues: {
            imageUrl: ''
        }

    })
    const isModalOpen = isOpen && type == 'messageFile';

    async function onSubmit(values: z.infer<typeof messageFileSchema>) {
        try {
            const url = qs.stringifyUrl({
                url: apiUrl as string,
                query
            })
            await axios.post(url, { content: values.imageUrl, imageUrl: values.imageUrl})
            form.reset();
            router.refresh();
            onClose();
        } catch (err) {
            console.log(err)
        }
    }
    const isLoading = form.formState.isSubmitting;
    
    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className='bg-white text-black'>
                <DialogHeader className='mt-5 p-6'>
                    <DialogTitle className='text-center'>
                        Send a File!
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                            control={form.control}
                            name="imageUrl"
                            render={({ field }) => (
                                <FormItem className='flex justify-center items-center flex-col'>
                                    <FormLabel className='uppercase text-xs dark:text-secondary/70'>File Upload</FormLabel>
                                    <FormControl>
                                        <FileUpload
                                        onChange={field.onChange}
                                        endpoint='messageFile'
                                        value={field.value}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter className='bg-gray-100 px-6 py-4'>
                            <Button variant='primary' type='submit' className='mx-auto' disabled={isLoading}>
                                Send
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default MessageFileModal