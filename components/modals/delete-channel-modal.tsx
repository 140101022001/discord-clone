"use client"

import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useModalStore } from '../hooks/use-modal';
import { useState } from 'react';
import { Button } from '../ui/button';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import qs from 'query-string'

const DeleteChannelModal = () => {
    const { type, isOpen, onClose, data } = useModalStore();
    const { server, channel } = data;
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);

    const isModalOpen = isOpen && type == 'deleteChannel';

    const handleDeleteChannel = async () => {
        try {
            setIsLoading(true);
            const url = qs.stringifyUrl({
                url: `/api/channel/${channel?.id}`,
                query: {
                    serverId: server?.id
                }
            })
            await axios.delete(url);
            onClose();
            router.push('/');
            router.refresh();
        } catch(err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className='bg-white text-black'>
                <DialogHeader className='mt-5 p-6'>
                    <DialogTitle className='text-center'>
                        Delete Channel!
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription className='text-center text-zinc-500 text-lg'>
                    Are you sure want to do this? <span className='text-rose-500 font-semibold'>#{channel?.name}</span> will be permanently deleted.
                </DialogDescription>
                <DialogFooter className='bg-gray-100 px-6 py-4'>
                    <div className='flex justify-between items-center w-full'>
                        <Button variant='secondary' className='cursor-pointer' disabled={isLoading}
                        onClick={onClose}>
                            Cancel
                        </Button>
                        <Button variant='rose' disabled={isLoading}
                        onClick={handleDeleteChannel}>
                            Confirm
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteChannelModal