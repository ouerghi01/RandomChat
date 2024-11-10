// app/api/fetchFriend/route.js
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    const { userId } = await req.json();

    if (!userId) {
        return new Response(JSON.stringify({ error: 'Missing required fields' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        // Fetch all rooms of the user
        const userWithRooms = await prisma.users.findUnique({
            where: { id: userId },
            select: {
                id: true,
                rooms_rooms_receiver_idTousers: {
                    select: {
                        id: true
                    }
                },
                rooms_rooms_sender_idTousers: {
                    select: {
                        id: true
                    }
                }
            }
        });

        if (!userWithRooms) {
            return new Response(JSON.stringify({ error: 'User not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Collect the user's room IDs
        const userRoomIds = [
            ...userWithRooms.rooms_rooms_receiver_idTousers.map(room => room.id),
            ...userWithRooms.rooms_rooms_sender_idTousers.map(room => room.id)
        ];
        const uniqueUserRoomIds = [...new Set(userRoomIds)];

        // Fetch friends where the friendship is accepted
        const friends = await prisma.friendship.findMany({
            where: {
                accepted: true,
                OR: [
                    { sender_id: userId },
                    { receiver_id: userId }
                ]
            },
            select: {
                sender_id: true,
                receiver_id: true
            }
        });

        // Get distinct friend IDs
        const friendIds = [
            ...new Set(friends.map(friend => 
                friend.sender_id === userId ? friend.receiver_id : friend.sender_id
            ))
        ];

        // Fetch each friend's rooms and find shared rooms
        const friendsWithSharedRooms = await Promise.all(
            friendIds.filter(id => id !== null).map(async (friendId) => {
                const friendWithRooms = await prisma.users.findUnique({
                    where: { id: friendId },
                    select: {
                        email: true,
                        id: true,
                        rooms_rooms_receiver_idTousers: {
                            select: {
                                id: true
                            }
                        }
                        ,
                        rooms_rooms_sender_idTousers: {
                            select: {
                                id: true
                            }
                        }
                    }
                });
                if (!friendWithRooms) return null;

                const friendRoomIds = [
                    ...new Set([
                        ...friendWithRooms.rooms_rooms_receiver_idTousers.map(room => room.id),
                        ...friendWithRooms.rooms_rooms_sender_idTousers.map(room => room.id)
                    ])
                ];

                if (!friendWithRooms) return null;

                // Find shared rooms between user and this friend
                const sharedRoom = friendRoomIds.find(room =>
                    uniqueUserRoomIds.includes(room)
                );

                // Return friend details with the shared room_id if any
                if (sharedRoom) {
                    return {
                        name: friendWithRooms.email,
                        id: friendWithRooms.id,
                        roomId: sharedRoom
                    };
                }
                return null; // If no shared room, return null
            })
        );

        // Filter out friends without shared rooms
        const validFriends = friendsWithSharedRooms.filter(friend => friend !== null);

        return new Response(JSON.stringify({ friends: validFriends }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Error fetching friends:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
