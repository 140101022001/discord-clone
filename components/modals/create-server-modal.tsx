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
import FileUpload from '../file-upload';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useModalStore } from '../hooks/use-modal';

const CreateServerModal = () => {
    const {type, isOpen, onClose } = useModalStore();
    const router = useRouter();

    const isModalOpen = isOpen && type == 'createServer';

    const form = useForm<z.infer<typeof serverSchema>>({
        resolver: zodResolver(serverSchema),
        defaultValues: {
            name: '',
            imageUrl: ''
        }

    })
    async function onSubmit(values: z.infer<typeof serverSchema>) {
        try {
            const res = await axios.post('/api/server', values)
            form.reset();
            router.push(`/server/${res.data.id}`)
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

export default CreateServerModal