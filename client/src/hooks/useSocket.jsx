import { useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000'); // Backend URL

// const useSocket = (setAttendeeCount) => {
//     useEffect(() => {
//         socket.on('attendeeUpdate', (data) => {
//             console.log('Received real-time update:', data);
//             setAttendeeCount(data.attendees);
//         });

//         return () => {
//             socket.off('attendeeUpdate');
//         };
//     }, [setAttendeeCount]);

//     return socket;
// };

// export default useSocket;
const useSocket = (setEvents) => {
    useEffect(() => {
        const handleAttendeeUpdate = ({ eventId, attendees }) => {
            if (setEvents) {
                // If setEvents is provided, update global event state
                setEvents((prevEvents) =>
                    prevEvents.map((event) =>
                        event._id === eventId ? { ...event, attendees } : event
                    )
                );
            }
        };

        socket.on('attendeeUpdate', handleAttendeeUpdate);

        return () => {
            socket.off('attendeeUpdate', handleAttendeeUpdate);
        };
    }, [setEvents]);

    return socket;
};

export default useSocket;



