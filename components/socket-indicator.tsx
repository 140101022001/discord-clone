'use client'

import { useSocket } from "./socket.io-provider"
import { Badge } from "./ui/badge";

const SocketIndicator = () => {
    const { isConnected } = useSocket();
    
    if (!isConnected) {
        return (
            <Badge variant="outline" className="bg-yellow-600 text-white border-none">
                Fallback: every 1s
            </Badge>
        )
    }
    return (
        <Badge variant="outline" className="bg-emerald-600 text-white border-none">
            Real Time
        </Badge>
    )
}

export default SocketIndicator