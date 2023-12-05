import currentProfile from '@/lib/current-profile'
import { db } from '@/lib/prismadb';
import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

const ServerIdPage = async ({params}: {params: { serverId: string }}) => {
  const profile = await currentProfile();
  if(!profile) {
    return redirectToSignIn();
  }
  
  const server = await db.servers.findUnique({
    where: {
      id: params.serverId,
      member: {
        some: {
          profileId: profile.id
        }
      }
    },
    include: {
      channel: {
        where: {
          name: 'general'
        },
        orderBy: {
          createdAt: 'asc'
        }
      }
    }
  })

  const initialChannel = server?.channel[0];

  if (initialChannel?.name !== 'general') return null

  return redirect(`/server/${server?.id}/channels/${initialChannel.id}`)
}

export default ServerIdPage