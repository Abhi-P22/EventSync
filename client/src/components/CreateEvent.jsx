import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const CreateEvent = ({ onEventCreated }) => {
    const { user } = useAuth();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    const categories = ['Technology', 'Business', 'Entertainment', 'Health', 'Education', 'Sports'];

    if (!user || user._id === 'guest') {
        return <p className="text-gray-500 text-center">Guests cannot create events.</p>;
    }

    const uploadImage = async (file) => {
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'event_images');

        try {
            const { data } = await axios.post('https://api.cloudinary.com/v1_1/dix852ojt/image/upload', formData);
            setImage(data.secure_url);
            setImagePreview(data.secure_url);
        } catch (error) {
            console.error('Error uploading image:', error);
            setError('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            uploadImage(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(
                'https://eventsync-p66k.onrender.com/api/events/',
                { name, description, date, category, image },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            onEventCreated(data);
            setName('');
            setDescription('');
            setDate('');
            setCategory('');
            setImage(null);
            setImagePreview(null);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to create event');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg max-w-lg mx-auto space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 text-center">Create Event</h2>
            {error && <p className="text-red-500 text-center">{error}</p>}

            <input 
                type="text" 
                placeholder="Event Name" 
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
            />

            <textarea 
                placeholder="Description" 
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                required 
            />

            <input 
                type="date" 
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
                required 
            />

            <select 
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
                required
            >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                ))}
            </select>

            <div className="flex flex-col items-center space-y-2">
                <label htmlFor="imageInput" className="w-full text-center bg-gray-100 p-3 border border-dashed rounded-lg cursor-pointer hover:bg-gray-200">
                    Upload Image
                </label>
                <input 
                    type="file" 
                    id="imageInput"
                    className="hidden" 
                    onChange={handleImageChange} 
                    accept="image/*" 
                />
                {uploading && <p className="text-gray-500">Uploading...</p>}
                {imagePreview && <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded-lg shadow-md" />}
            </div>

            <button 
                type="submit" 
                className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition"
            >
                Create Event
            </button>
        </form>
    );
};

export default CreateEvent;
