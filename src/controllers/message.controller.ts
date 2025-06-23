import prisma from "../libs/prisma";

export const getMessages = async (req: any, res: any) => {
    try {
        const conversationId = req.params.id;
        const conversation = await prisma.conversation.findFirst({where: { id: Number(conversationId) }});
        const messages = await prisma.message.findMany({
            where: {
                conversationId: Number(conversationId)
            },
            include: {
                sender: {
                    select: {
                        name: true
                    }
                }
            }
        })

        return res.json({success: true, messages: messages, isGroup: conversation?.isGroup || false })
    } catch (e) {
        return res.json({success: false, errors: (e as Error).message})
    }
}

export const postMessage = async (req: any, res: any) => {
    try {
        req.body.senderId = Number(req.body.senderId);
        const newData = await prisma.message.create({
            data: req.body,
        });

        const sender = await prisma.user.findUnique({ where: {id: req.body.senderId}});
        const result = {
            ...newData,
            sender: {
                name: sender!.name
            }
        };
        return res.json({success: true, messages: result})
    } catch (e) {
        return res.json({success: false, errors: (e as Error).message})
    }
}