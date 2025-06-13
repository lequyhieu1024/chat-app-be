import prisma from "../libs/prisma";

export const getMessages = async (req: any, res: any) => {
    try {
        // mặc định user đang login là id = 1, sau này làm auth sẽ làm thêm sau
        const currentId = 1;
        const conversationId = req.params.id;
        let messages = await prisma.message.findMany({where: {conversationId: Number(conversationId)}})

        messages = messages.map(message => {
            return {...message, isOwn: message.senderId == currentId}
        })

        return res.json({success: true, messages: messages})
    } catch (e) {
        return res.json({success: false, errors: (e as Error).message})
    }
}

export const postMessage = async (req: any, res: any) => {
    try {
        const newData = await prisma.message.create({
            data: req.body,
        })

        return res.json({success: true, messages: newData})
    } catch (e) {
        return res.json({success: false, errors: (e as Error).message})
    }
}