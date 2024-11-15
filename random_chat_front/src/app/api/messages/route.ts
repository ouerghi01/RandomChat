import prisma from "@/lib/prisma";
// this api to et all messages by room_id
export async function POST(req: Request) {
    const { roomId } = await  req.json();

    if (!roomId) {
        return new Response(JSON.stringify({ error: 'Missing required fields' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    try{
        let messages = await prisma.messages.findMany({
            where: {
                room_id: roomId
            },
            select: {
                content: true,
                date_created: true,
                room_id: true,
                sender_id: true,
                receiver_id: true,
            },
            
        });
        messages = await Promise.all(messages.map(async message => {
            const sender = message.sender_id ? await prisma.users.findUnique({ where: { id: message.sender_id } }) : null;
            return {
                content: message.content,
                date_created: message.date_created,
                room_id: message.room_id,
                sender_id: message.sender_id,
                sender: sender?.email,
                receiver_id: message.receiver_id,
            }
        }));
        return new Response(JSON.stringify(messages), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
        
    }
    catch(e){
        console.error(e);
        return new Response(JSON.stringify({ error: `Internal server error` }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }

}