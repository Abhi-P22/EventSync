import React, { useState, useEffect } from 'react';
import useSocket from '../hooks/useSocket';
import { useAuth } from '../context/AuthContext';

const EventCard = ({ event }) => {
    const { user, login } = useAuth();
    const [attendeeCount, setAttendeeCount] = useState(event.attendees?.length || 0);
    const [attending, setAttending] = useState(user && event.attendees?.includes(user._id));
    const socket = useSocket();

    // 🔥 Default Image Placeholder if No Image Available
    const eventImage = event.image || 'https://via.placeholder.com/300x200?text=No+Image';

    useEffect(() => {
        const handleAttendeeUpdate = ({ eventId, attendees }) => {
            if (eventId === event._id) {
                setAttendeeCount(attendees.length);
                setAttending(user ? attendees.includes(user._id) : false);
            }
        };

        socket.on('attendeeUpdate', handleAttendeeUpdate);
        return () => {
            socket.off('attendeeUpdate', handleAttendeeUpdate);
        };
    }, [socket, event._id, user]);

    const handleAttend = () => {
        if (!user) {
            alert("You must log in as a guest or registered user to attend events.");
            return;
        }

        const action = attending ? 'leaveEvent' : 'joinEvent';
        socket.emit(action, { eventId: event._id, userId: user._id });
    };

    return (
        <div className="bg-white shadow-md rounded-xl p-6 m-4 max-w-sm mx-auto transition-transform transform hover:scale-105">
            {/* 🔥 Event Image with Proper Display */}
            <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-lg overflow-hidden">
                <img
                    src={eventImage}
                    alt={event.name}
                    className="max-w-full max-h-full object-contain"
                />
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mt-4">{event.name}</h2>
            <p className="text-gray-600 mb-4">{event.description}</p>
            <p className="text-gray-500 text-sm">{new Date(event.date).toLocaleDateString()}</p>
            <p className="text-blue-600 font-medium mt-2">Attendees: {attendeeCount}</p>

            <button
                onClick={handleAttend}
                className={`mt-4 w-full px-4 py-2 rounded-lg text-white font-medium transition ${
                    attending ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                }`}
            >
                {attending ? 'Leave Event' : 'Attend Event'}
            </button>
        </div>
    );
};

export default EventCard;
