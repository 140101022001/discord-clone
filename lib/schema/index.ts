import { ChannelType } from '@prisma/client';
import * as zod from 'zod';

export const serverSchema = zod.object({
    name: zod.string().min(3, { message: 'Tên phải trên 3 kí tự!'}),
    imageUrl : zod.string().min(1, {
        message: 'Chưa thêm ảnh!'
    })
})

export const channelSchema = zod.object({
    name: zod.string().min(3, { message: 'Tên phải trên 3 kí tự!'}).refine(name => name !== 'general', 
    { message: "Channel name can't be 'general'"}),
    type: zod.nativeEnum(ChannelType)
})

export const ChatInputSchema = zod.object({
    content: zod.string().min(1, { message: 'Please enter!' })
})

export const messageFileSchema = zod.object({
    imageUrl: zod.string().min(1, { message: 'Please insert file!' })
})