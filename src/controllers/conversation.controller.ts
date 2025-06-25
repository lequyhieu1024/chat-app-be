import prisma from "../libs/prisma";
import {randomInt} from "node:crypto";

export const getConversations = async (req: any, res: any) => {
    const currentUserId = req.user.id;
    try {
        const nameFilter = req.query.name as string | undefined;

        const orConditions = [];

        if (nameFilter) {
            orConditions.push({
                title: {
                    contains: nameFilter,
                }
            });

            orConditions.push({
                participants: {
                    some: {
                        user: {
                            name: {
                                contains: nameFilter,
                            }
                        }
                    }
                }
            });
        }

        const conversations = await prisma.conversation.findMany({
            where: {
                ...(orConditions.length > 0 && {
                    OR: orConditions
                }),
                participants: {
                    some: {
                        userId: currentUserId,
                    }
                }
            },
            include: {
                participants: {
                    include: {
                        user: true
                    }
                },
                messages: {
                    orderBy: {
                        sentAt: 'desc'
                    },
                    take: 1
                }
            }
        });


        const sortedConversations = conversations
            .map((conv) => {
                const lastMessage = conv.messages[0] || null;

                const isGroup = conv.isGroup;

                let title = conv.title || '';
                let avatar = '';

                if (!isGroup) {
                    const otherUser = conv.participants.find(p => p.userId !== currentUserId)?.user;
                    title = otherUser?.name || 'Người lạ';
                    avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherUser?.name || 'Anonymous'}`;
                } else {
                    avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=Anonymous}`;
                }

                return {
                    id: conv.id,
                    isGroup,
                    title,
                    avatar,
                    lastMessage,
                    participants: conv.participants.map(p => ({
                        id: p.user.id,
                        name: p.user.name,
                        email: p.user.email
                    })),
                    timestamp: lastMessage?.sentAt || conv.updatedAt,
                    unreadCount: randomInt(0,10),
                    isOnline: randomInt(0,2)
                };
            })
            .sort((a, b) => {
                const timeA = new Date(a.timestamp).getTime();
                const timeB = new Date(b.timestamp).getTime();
                return timeB - timeA;
            });

        const user = await prisma.user.findMany({
            where: {
                name: nameFilter
            }
        })

        return res.json({ success: true, conversations: sortedConversations });

    } catch (e) {
        return res.status(500).json({ success: false, error: (e as Error).message });
    }
};
