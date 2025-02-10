import { Server } from 'socket.io';
import Event from './models/Event.js'
import * as dotenv from 'dotenv';
dotenv.config();

const setupSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:5173' || process.env.ORIGIN ,
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });

//     io.on('connection', (socket) => {
//         console.log(`Client connected: ${socket.id}`);

//         socket.on('joinEvent', async ({ eventId, userId }) => {
//             try {
//                 console.log(`User ${userId} trying to join event: ${eventId}`);
//                 const event = await Event.findById(eventId);

//                 if (!event) return;

//                 // 🔥 Ensure `attendees` is always an array
//                 if (!event.attendees) {
//                     event.attendees = [];
//                 }

//                 // 🔥 Check if user already attended
//                 if (event.attendees.includes(userId)) {
//                     console.log(`User ${userId} already joined.`);
//                     return;
//                 }

//                 event.attendees.push(userId);
//                 await event.save();

//                 io.emit('attendeeUpdate', { eventId, attendees: event.attendees.length });
//             } catch (error) {
//                 console.error('Error updating attendees:', error);
//             }
//         });

//         socket.on('leaveEvent', async ({ eventId, userId }) => {
//             try {
//                 console.log(`User ${userId} leaving event: ${eventId}`);
//                 const event = await Event.findById(eventId);

//                 if (!event) return;

//                 // 🔥 Ensure `attendees` is always an array
//                 if (!event.attendees) {
//                     event.attendees = [];
//                 }

//                 event.attendees = event.attendees.filter(id => id.toString() !== userId);
//                 await event.save();

//                 io.emit('attendeeUpdate', { eventId, attendees: event.attendees.length });
//             } catch (error) {
//                 console.error('Error updating attendees:', error);
//             }
//         });

//         socket.on('disconnect', () => {
//             console.log(`Client disconnected: ${socket.id}`);
//         });
//     });

//     return io;
// };

// export default setupSocket;

// io.on('connection', (socket) => {
//     console.log(`Client connected: ${socket.id}`);

//     socket.on('joinEvent', async ({ eventId, userId }) => {
//         try {
//             const event = await Event.findById(eventId);
//             if (!event) return;

//             // Ensure attendees is always an array
//             if (!event.attendees) event.attendees = [];

//             // Prevent duplicate attendance
//             if (!event.attendees.includes(userId)) {
//                 event.attendees.push(userId);
//                 await event.save();
//             }

//             // 🔥 Broadcast updated attendee list to ALL clients
//             io.emit('attendeeUpdate', { eventId, attendees: event.attendees });
//             console.log(`Broadcasting attendee update for event ${eventId}`);
//         } catch (error) {
//             console.error('Error updating attendees:', error);
//         }
//     });

//     socket.on('leaveEvent', async ({ eventId, userId }) => {
//         try {
//             const event = await Event.findById(eventId);
//             if (!event) return;

//             // Remove user from attendees
//             event.attendees = event.attendees.filter(id => id.toString() !== userId);
//             await event.save();

//             // 🔥 Broadcast updated attendee list to ALL clients
//             io.emit('attendeeUpdate', { eventId, attendees: event.attendees });
//             console.log(`Broadcasting attendee update for event ${eventId}`);
//         } catch (error) {
//             console.error('Error updating attendees:', error);
//         }
//     });

//     socket.on('disconnect', () => {
//         console.log(`Client disconnected: ${socket.id}`);
//     });
// });

// return io;
// };

// export default setupSocket;

io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    const updateAndEmit = async (eventId) => {
        const event = await Event.findById(eventId);
        if (event) {
            io.emit('attendeeUpdate', { eventId, attendees: event.attendees });
        }
    };

    socket.on('joinEvent', async ({ eventId, userId }) => {
        try {
            const event = await Event.findById(eventId);
            if (!event) return;

            // 🔥 Ensure userId is stored as a String for guests
            const userIdString = userId.toString();

            // 🔥 Allow guests (string IDs) and registered users (ObjectId)
            if (!event.attendees.some(attendee => attendee.toString() === userIdString)) {
                event.attendees.push(userIdString);
                await event.save();
            }

            await updateAndEmit(eventId);
        } catch (error) {
            console.error('Error updating attendees:', error);
        }
    });

    socket.on('leaveEvent', async ({ eventId, userId }) => {
        try {
            const event = await Event.findById(eventId);
            if (!event) return;

            const userIdString = userId.toString();

            // 🔥 Remove user regardless of ObjectId or String ID
            event.attendees = event.attendees.filter(attendee => attendee.toString() !== userIdString);
            await event.save();

            await updateAndEmit(eventId);
        } catch (error) {
            console.error('Error updating attendees:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

return io;
};

export default setupSocket;
