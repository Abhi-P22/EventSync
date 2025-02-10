import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import EventCard from '../components/EventCard';
import CreateEvent from '../components/CreateEvent';
import { useAuth } from '../context/AuthContext';
import useSocket from '../hooks/useSocket';

const Dashboard = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);

    // Default filter values
    const [filter, setFilter] = useState('upcoming'); 
    const [category, setCategory] = useState('');
    const [selectedDate, setSelectedDate] = useState('');

    // Temporary states for the filters
    const [tempFilter, setTempFilter] = useState('upcoming');
    const [tempCategory, setTempCategory] = useState('');
    const [tempDate, setTempDate] = useState('');

    const socket = useSocket();

    // Predefined event categories
    const categories = ['Technology', 'Business', 'Entertainment', 'Health', 'Education', 'Sports'];

    const fetchUpcomingEvents = async () => {
        try {
            const { data } = await axios.get(`http://localhost:5000/api/events?filter=upcoming`);
            setEvents(data);
        } catch (error) {
            console.error('Error fetching upcoming events:', error);
        }
    };

    const fetchFilteredEvents = async () => {
        try {
            const queryParams = new URLSearchParams({
                filter: tempFilter,
                category: tempCategory || undefined,
                date: tempDate || undefined,
            }).toString();

            const { data } = await axios.get(`http://localhost:5000/api/events?${queryParams}`);
            setEvents(data);
        } catch (error) {
            console.error('Error fetching filtered events:', error);
        }
    };

    useEffect(() => {
        fetchUpcomingEvents();
    }, []);

    const applyFilters = () => {
        setFilter(tempFilter);
        setCategory(tempCategory);
        setSelectedDate(tempDate);
        fetchFilteredEvents();
    };

    const resetFilters = () => {
        setTempFilter('upcoming');
        setTempCategory('');
        setTempDate('');

        setFilter('upcoming');
        setCategory('');
        setSelectedDate('');

        fetchUpcomingEvents();
    };

    useEffect(() => {
        socket.on('newEvent', (newEvent) => {
            setEvents((prevEvents) => {
                const exists = prevEvents.some(event => event._id === newEvent._id);
                if (!exists) {
                    return [newEvent, ...prevEvents];
                }
                return prevEvents;
            });
        });

        return () => {
            socket.off('newEvent');
        };
    }, [socket]);

    const handleNewEvent = (newEvent) => {
        setEvents((prevEvents) => {
            const exists = prevEvents.some(event => event._id === newEvent._id);
            return exists ? prevEvents : [newEvent, ...prevEvents];
        });
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <Navbar onResetFilters={resetFilters} />
            <div className="p-6 max-w-6xl mx-auto">
                <h2 className="text-3xl font-semibold mb-6 text-gray-800">Events</h2>

                {/* 🔥 Filters */}
                <div className="flex flex-wrap gap-4 mb-6 p-4 bg-white shadow-sm rounded-lg">
                    <select value={tempFilter} onChange={(e) => setTempFilter(e.target.value)} className="p-2 border rounded w-full sm:w-auto">
                        <option value="upcoming">Upcoming Events</option>
                        <option value="past">Past Events</option>
                    </select>

                    <select value={tempCategory} onChange={(e) => setTempCategory(e.target.value)} className="p-2 border rounded w-full sm:w-auto">
                        <option value="">All Categories</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>

                    <input
                        type="date"
                        value={tempDate}
                        onChange={(e) => setTempDate(e.target.value)}
                        className="p-2 border rounded w-full sm:w-auto"
                    />

                    <button onClick={applyFilters} className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full sm:w-auto hover:bg-blue-600 transition">
                        Apply Filters
                    </button>
                </div>

                {/* 🔥 Render Event List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.length > 0 ? (
                        events.map((event) => <EventCard key={event._id} event={event} />)
                    ) : (
                        <p className="text-gray-500 col-span-full text-center">No events found.</p>
                    )}
                </div>

                {/* 🔥 Hide Create Event for Guests */}
                {user && !user.isGuest && (
                    <div className="mt-10 bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
                        <h2 className="text-xl font-bold mb-4">Create New Event</h2>
                        <CreateEvent onEventCreated={handleNewEvent} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
