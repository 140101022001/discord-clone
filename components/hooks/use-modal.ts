import { create } from 'zustand';
import { Channel, ChannelType, Servers } from '@prisma/client'

export type Modaltype = "createServer" | "invite" | "editServer" | "members" | "createChannel" 
| "leaveServer" | "deleteServer" | "deleteChannel" | "editChannel" | "messageFile" | "deleteMessage"

interface ModalData {
    server?: Servers,
    channelType?: ChannelType,
    channel?: Channel
    apiUrl?: string,
    query?: Record<string, any>
}

interface ModalStore {
    type: Modaltype | null,
    data: ModalData,
    isOpen: boolean,
    onOpen: (type: Modaltype, data?: ModalData) => void,
    onClose: () => void
}


export const useModalStore = create<ModalStore>((set) => ({
    type: null,
    data: {},
    isOpen: false,
    onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
    onClose: () => set({ isOpen: false, type: null })
}))