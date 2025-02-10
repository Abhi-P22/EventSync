import Event from '../models/Event.js';
import cloudinary from '../config/cloudinary.js';

export const createEvent = async (req, res) => {
    try {
        if (req.user.isGuest) {
            return res.status(403).json({ message: 'Guests cannot create events' });
        }

        const { name, description, date, category,location, image } = req.body;

        // 🔥 Upload image to Cloudinary if provided
        let imageUrl = image;
        if (image) {
            const uploadResponse = await cloudinary.v2.uploader.upload(image, {
                folder: 'event_images',
            });
            imageUrl = uploadResponse.secure_url;
        }

        const event = new Event({
            user: req.user.id,
            name,
            description,
            date,
            category,
            location,
            image: imageUrl,
            attendees: [],
        });

        await event.save();
        req.io.emit('newEvent', event);
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 🔥 Get Events with Filtering
export const getEvents = async (req, res) => {
    try {
        let { filter, category, date } = req.query;
        let query = {};

        // ✅ Show ALL events, not just the ones created by the logged-in user

        // 🔥 Upcoming & Past Events Filter
        if (filter === 'upcoming') {
            query.date = { $gte: new Date() }; // Events in the future
        } else if (filter === 'past') {
            query.date = { $lt: new Date() }; // Events in the past
        }

        // 🔥 Category Filter
        if (category) {
            query.category = category;
        }

        // 🔥 Single Date Filter
        if (date) {
            const selectedDate = new Date(date);
            selectedDate.setHours(0, 0, 0, 0);
            const nextDay = new Date(selectedDate);
            nextDay.setDate(selectedDate.getDate() + 1);
            query.date = {
                $gte: selectedDate,
                $lt: nextDay,
            };
        }

        const events = await Event.find(query).sort({ date: 1 });

        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
