"use client"

import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useModalStore } from '../hooks/use-modal';
import { useState } from 'react';
import { Button } from '../ui/button';
import axios from 'axios';
import qs from 'query-string'

const DeleteMessageModal = () => {
    const { type, isOpen, onClose, data } = useModalStore();
    const { apiUrl, query } = data;

    const [isLoading, setIsLoading] = useState(false);

    const isModalOpen = isOpen && type == 'deleteMessage';

    const handleDeleteMessage = async () => {
        try {
            setIsLoading(true);
            const url = qs.stringifyUrl({
                url: apiUrl as string,
                query
            })
            await axios.delete(url);
            onClose();
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
                    Are you sure want to do this? <span className='text-rose-500 font-semibold'></span>This message will be permanently deleted.
                </DialogDescription>
                <DialogFooter className='bg-gray-100 px-6 py-4'>
                    <div className='flex justify-between items-center w-full'>
                        <Button variant='secondary' className='cursor-pointer' disabled={isLoading}
                        onClick={onClose}>
                            Cancel
                        </Button>
                        <Button variant='rose' disabled={isLoading}
                        onClick={handleDeleteMessage}>
                            Confirm
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteMessageModal