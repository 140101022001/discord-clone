import { Server as NetServer, Socket } from "net";
import { NextApiResponse } from "next";
import { Server as ServerIO} from 'socket.io'
import { Servers, Profile, Member } from "@prisma/client";

export type ServerWithMemberWithProfile = Servers & {
    member: (Member & { profile: Profile })[]
}

export type NextApiResponseServerIO = NextApiResponse & {
    socket: Socket & {
        server: NetServer & {
            io: ServerIO
        }
    }
}