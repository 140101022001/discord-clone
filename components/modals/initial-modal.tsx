"use client"

import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { serverSchema } from '@/lib/schema';
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
import { useEffect, useState } from 'react';
import FileUpload from '../file-upload';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const InitialModal = () => {
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();
    const form = useForm<z.infer<typeof serverSchema>>({
        resolver: zodResolver(serverSchema),
        defaultValues: {
            name: '',
            imageUrl: ''
        }

    })
    useEffect(() => {
        setIsMounted(true);
    }, [])
    async function onSubmit(values: z.infer<typeof serverSchema>) {
        try {
            await axios.post('/api/server', values)
            form.reset();
            router.refresh();
            window.location.reload();
        } catch (err) {
            console.log(err)
        }
    }
    const isLoading = form.formState.isSubmitting;
    if (!isMounted) {
        return null
    }
    return (
        <Dialog open>
            <DialogContent className='bg-white text-black'>
                <DialogHeader className='mt-5 p-6'>
                    <DialogTitle className='text-center'>
                        Create a Server!
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
                                        endpoint='serverImage'
                                        value={field.value}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='uppercase text-xs dark:text-secondary/70'>Server Name</FormLabel>
                                    <FormControl>
                                        <Input className='
                                        bg-zinc-300/50 
                                        border-0
                                        focus-visible:ring-0 
                                        text-black
                                        focus-visible:ring-offset-0
                                        ' placeholder="Enter Server Name"
                                            disabled={isLoading}
                                            {...field}
                                        />
                                    </FormControl>
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

export default InitialModal