import { getAuth } from "@clerk/nextjs/server";
import { db } from "./prismadb";
import { NextApiRequest } from "next";

const currentProfilePages = async (req: NextApiRequest) => {
    const { userId } = getAuth(req);
    

    if (!userId) null

    const profile = await db.profile.findUnique({
        where: {
            userId: userId as string
        }
    })
    return profile
}

export default currentProfilePages;