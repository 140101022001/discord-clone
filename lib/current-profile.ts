import { auth } from "@clerk/nextjs";
import { db } from "./prismadb";

const currentProfile = async () => {
    const { userId } = auth();
    

    if (!userId) null

    const profile = await db.profile.findUnique({
        where: {
            userId: userId as string
        }
    })
    return profile
}

export default currentProfile;