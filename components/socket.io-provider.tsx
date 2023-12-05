"use client"

import { useEffect, useContext, createContext, useState } from 'react';
import { io as ClientIO } from 'socket.io-client';

type SocketIOContextType = {
    isConnected: boolean;
    socket: any | null
}

const SocketIOContext = createContext<SocketIOContextType>({
    socket: null,
    isConnected: false
})

export const useSocket = () => {
    return useContext(SocketIOContext);
}

export const SocketProvider = ({children}: {children: React.ReactNode}) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    useEffect(() => {
        const socketInstance = new (ClientIO as any)(process.env.NEXT_PUBLIC_SITE_URL!, {
            path: '/api/socket/io',
            addTrailingSlash: false,
        });
        socketInstance.on("connect", () => {
            setIsConnected(true)
        })
        socketInstance.on("disconnect", () => {
            setIsConnected(false)
        })
        setSocket(socketInstance);
        
        return () => {
            socketInstance.disconnect();
        }
    },[])
    return (
        <SocketIOContext.Provider value={{socket, isConnected}}>
            {children}
        </SocketIOContext.Provider>
    )
}