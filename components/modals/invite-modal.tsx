"use client"

import { Dialog, DialogContent, DialogTitle, DialogHeader } from '@/components/ui/dialog';
import { useModalStore } from '../hooks/use-modal';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Check, Copy, RefreshCcw } from 'lucide-react';
import useOrigin from '../hooks/use-origin';
import TooltipAction from '../navigation/Tool-tip';
import { useState } from 'react';
import axios from 'axios';

const InviteModal = () => {
    const { type, isOpen, onClose, data, onOpen } = useModalStore();
    const origin = useOrigin();
    const { server } = data;
    const [isCopied, setIsCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const isModalOpen = isOpen && type == 'invite';

    const inviteUrl = `${origin}/invite/${server?.inviteCode}`

    const onCopy = () => {
        navigator.clipboard.writeText(inviteUrl);
        setIsCopied(true);

        setTimeout(() => {
            setIsCopied(false);
        }, 2000);
    }

    const newCode = async () => {
        try {
            setIsLoading(true);
            const res = await axios.patch(`/api/server/${server?.id}/invite-code`)
            console.log(res);
            onOpen('invite', { server: res.data })
            
        }catch(err) {
            console.log(err);
        }finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className='bg-white text-black'>
                <DialogHeader className='mt-5 p-6'>
                    <DialogTitle className='text-center'>
                        Invite Friends!
                    </DialogTitle>
                </DialogHeader>
                <div className='p-6'>
                    <Label className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
                        Server invite link
                    </Label>
                    <div className='flex items-center mt-2 gap-x-2'>
                        <Input className='bg-zinc-200/70 border-0 text-black focus-visible:ring-0 focus-visible:ring-offset-0'
                            value={inviteUrl} readOnly />
                        <TooltipAction
                            side='right'
                            align='center'
                            label={isCopied ? 'Copied': 'Copy this'}
                        >
                            <Button size='icon' onClick={onCopy} disabled={isLoading}>
                                {isCopied ? <Check className='h-4 w-4' /> :
                                    <Copy className='h-4 w-4' />
                                }
                            </Button>
                        </TooltipAction>
                    </div>
                    <Button size='sm' variant='link' className='text-xs mt-4 text-zinc-400'
                    onClick={newCode} disabled={isLoading}>
                        Generate a new link
                        <RefreshCcw className='h-4 w-4 ml-3' />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default InviteModal