"use client"

import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useModalStore } from '../hooks/use-modal';
import { useState } from 'react';
import { Button } from '../ui/button';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const LeaveServerModal = () => {
    const { type, isOpen, onClose, data, onOpen } = useModalStore();
    const { server } = data;
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);

    const isModalOpen = isOpen && type == 'leaveServer';

    const handleLeaveServer = async () => {
        try {
            setIsLoading(true);
            const res = await axios.patch(`/api/server/${server?.id}/leave`)
            router.refresh();
            onOpen('leaveServer', { server: res.data })
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
                        Leave Server!
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription className='text-center text-zinc-500 text-lg'>
                    Are you sure want to leave server <span className='text-rose-500 font-semibold'>{server?.name}</span>?
                </DialogDescription>
                <DialogFooter className='bg-gray-100 px-6 py-4'>
                    <div className='flex justify-between items-center w-full'>
                        <Button variant='secondary' type='button' disabled={isLoading}
                        onClick={onClose}>
                            Cancel
                        </Button>
                        <Button variant='rose' type='button' disabled={isLoading}
                        onClick={handleLeaveServer}>
                            Confirm
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default LeaveServerModal