import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    category: { type: String, required: false },
    location: { type: String},
    image: { type: String, required: false },
    attendees: [{ type: mongoose.Schema.Types.Mixed, ref: 'User' }] // 🔥 Stores unique mixed attendees values
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);
export default Event;

