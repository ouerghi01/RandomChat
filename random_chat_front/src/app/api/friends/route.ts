// app/api/fetchFriend/route.js
import prisma from "@/lib/prisma";

export async function POST(req:Request) {
    const { userId } = await req.json(); // Use req.json() to parse the request body

    if (!userId) {
        return new Response(JSON.stringify({ error: 'Missing required fields' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
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
        
        // Map to get only the IDs that are not equal to userId
        const friendIds = friends.map(friend =>
            friend.sender_id === userId ? friend.receiver_id : friend.sender_id
        )
        const friend_distinct = [...new Set(friendIds)];
        
        const friendsWithRooms = await Promise.all(friend_distinct.filter(friendId => friendId !== null).map(
            async friendId => {
            const user = await prisma.users.findUnique({
            where: { 
                id: friendId
             },
            select: { 
            email: true,
            id: true
             }
            });
            const room = await prisma.rooms.findFirst({
            where: {
                OR: [
                { sender_id: friendId },
                { receiver_id: friendId }
                ]
            },
            select: {
                id: true,
                
            }
            })
         
            if (user && room) {
            return { name: user.email, id: user.id, roomId: room.id };
            }
            return null;
        }));
        

        return new Response(JSON.stringify({ friends: friendsWithRooms }), {
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
