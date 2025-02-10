import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';  
import { Link } from 'react-router-dom';

const Register = () => {
    const { register } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null); // Reset error before submission

        try {
            await register({ name, email, password });
        } catch (error) {
            setError(error.response?.data?.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <form onSubmit={handleRegister} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">Register</h2>

                {error && <p className="text-red-600 text-center mb-4">{error}</p>}

                <div className="mb-4">
                    <label className="block text-gray-700 font-medium">Name</label>
                    <input 
                        type="text" 
                        placeholder="Enter your name" 
                        className="mt-1 p-3 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-medium">Email</label>
                    <input 
                        type="email" 
                        placeholder="Enter your email" 
                        className="mt-1 p-3 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 font-medium">Password</label>
                    <input 
                        type="password" 
                        placeholder="Enter your password" 
                        className="mt-1 p-3 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>

                <button type="submit" className="bg-blue-500 text-white font-semibold p-3 rounded-lg w-full hover:bg-blue-600 transition">
                    Register
                </button>

                <p className="mt-4 text-center text-gray-600">
                    Already have an account? <Link to="/" className="text-blue-500 hover:underline">Login</Link>
                </p>
            </form>
        </div>
    );
};

export default Register;
