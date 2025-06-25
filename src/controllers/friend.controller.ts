import prisma from "../libs/prisma";

export const getFriends = async (req: any, res: any) => {
    try {
        const query = req.query
        const friends = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                avatar: true
            },
            where: {
                name: { contains: query.name },
                id: {
                    not: req.user.id
                }
            }
        });

        friends.map((friend) => {
            friend.avatar = friend.avatar ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${friend?.name || 'Anonymous'}`
        })

        return res.status(200).json({ success: true, friends: friends })
    } catch (e) {
        return res.status(400).json({ success: false, errors: (e as Error).message })
    }
}

export const getFriend = async (req: any, res: any) => {
    try {
        const id = req.params.id;
        const friend = await prisma.user.findUnique({where: { id: Number(id)}});
        if (!friend) {
            return res.status(400).json({ success: false, errors: 'User not found' })
        }
        friend.avatar = friend.avatar ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${friend?.name || 'Anonymous'}`

        const friendData = JSON.parse(JSON.stringify(friend));

        if (friend.password) {
            delete friendData.password;
        }

        return res.status(200).json({ success: true, friend: friendData })
    } catch (e) {
        return res.status(400).json({ success: false, errors: (e as Error).message })
    }
}


export const addFriend = async (req: any, res: any) => {
    try {
        const data = {
            userId: Number(req.user.id),
            friendId: Number(req.params.id)
        }
        const isExisted = await prisma.friendship.findMany({
            where: {
                userId: data.userId,
                friendId: data.friendId
            }
        })
        if (isExisted.length > 0) {
            return res.status(200).json({ success: true, message: 'Đã gửi lời mời kết bạn tới người này rồi !' })
        }
        const friend = await prisma.friendship.create({
            data: data
        });

        return res.status(200).json({ success: true, message: 'Đã gửi lời mời kết bạn thành công !', data: friend })
    } catch (e) {
        return res.status(400).json({ success: false, errors: (e as Error).message })
    }
}

export const getFriendsRequest = async (req: any, res: any) => {
    try {
        const query = req.query
        const requestFriends = await prisma.friendship.findMany({
            where: {
                friendId: Number(req.user.id),
                status: 'PENDING',
                sender: {
                    name: { contains: query.name },
                }
            },
            include: {
                sender: true
            }
        })

        requestFriends.map((requestFriend) => {
            requestFriend.sender.avatar = requestFriend.sender.avatar ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${requestFriend.sender?.name || 'Anonymous'}`
        })

        return res.status(200).json({ success: true, friends: requestFriends })
    } catch (e) {
        return res.status(400).json({ success: false, errors: (e as Error).message })
    }
}

export const acceptAddFriend = async (req: any, res: any) => {
    try {
        const frship = await prisma.friendship.update({
            where: {
                id: Number(req.params.id),
            },
            data: {
                status: 'ACCEPTED',
            },
        })

        const conv = await prisma.conversation.create({
            data: {
                isGroup: false
            }
        })

        await prisma.participant.create({
            data: {
                userId: frship.userId,
                conversationId: conv.id
            }
        })

        await prisma.participant.create({
            data: {
                userId: frship.friendId,
                conversationId: conv.id
            }
        })

        return res.status(200).json({ success: true, message: 'Đã chấp nhận lời mời kết bạn thành công !'})
    } catch (e) {
        return res.status(400).json({ success: false, errors: (e as Error).message })
    }
}