import { db } from "./prismadb";


const getOrCreateConversation = async (memberOneId: string, memberTwoId: string) => {
    let conversation = await findConversation(memberOneId, memberTwoId) || await findConversation(memberTwoId, memberOneId)

    if (!conversation) {
        conversation = await createConversation(memberOneId, memberTwoId);
    }

    return conversation
}

const findConversation = async (memberOneId: string, memberTwoId: string) => {
    try {
        return await db.conversation.findFirst({
            where: {
                memberOneId: memberOneId,
                memberTwoId: memberTwoId
            },
            include: {
                memberOne: {
                    include: {
                        profile: true
                    }
                },
                memberTwo: {
                    include: {
                        profile: true
                    }
                }
            }
        })
    } catch(err) {
        console.log(err);
    }
}

const createConversation = async (memberOneId: string, memberTwoId: string) => {
    try {
        const conversation = await db.conversation.create({
            data: {
                memberOneId,
                memberTwoId
            },
            include: {
                memberOne: {
                    include: {
                        profile: true
                    }
                },
                memberTwo: {
                    include: {
                        profile: true
                    }
                }
            }
        })
        return conversation
    } catch(err) {
        console.log(err);
    }
}

export { getOrCreateConversation }