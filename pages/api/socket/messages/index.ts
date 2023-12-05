import currentProfilePages from '@/lib/current-profile-pages';
import { db } from '@/lib/prismadb';
import { NextApiResponseServerIO } from '@/type';
import { NextApiRequest } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed!' })
    }
    try {
        const profile = await currentProfilePages(req);
        const { content, imageUrl } = req.body;
        const { serverId, channelId } = req.query;

        if (!profile) {
            return res.status(401).json({ error: 'Unauthorized!' })
        }

        if (!serverId) {
            return res.status(400).json({ error: 'Server Id Missing!' })
        }

        if (!channelId) {
            return res.status(400).json({ error: 'Channel Id Missing!' })
        }

        if (!content) {
            return res.status(400).json({ error: 'Content Missing!' })
        }

        const server = await db.servers.findFirst({
            where: {
                id: serverId as string,
                member: {
                    some: {
                        profileId: profile.id
                    }
                }
            },
            include: {
                member: true
            }
        })

        if (!server) {
            return res.status(404).json({ error: 'Server Not Found!' })
        }

        const channel = await db.channel.findFirst({
            where: {
                id: channelId as string,
                serverId: serverId as string
            }
        })

        if (!channel) {
            return res.status(404).json({ error: 'Channel Not Found!' })
        }

        const member = server.member.find((member) => member.profileId == profile.id);

        if (!member) {
            return res.status(404).json({ error: 'Member Not Found!' })
        }

        const message = await db.message.create({
            data: {
                content: content,
                fileUrl: imageUrl,
                channelId: channelId as string,
                memberId: member.id
            },
            include: {
                member: {
                    include: {
                        profile: true
                    }
                }
            }
        })

        const channelKey = `chat:${channelId}:messages`;

        res?.socket?.server?.io?.emit(channelKey, message);

        return res.status(200).json(message)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error!' })
    }
}