import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Login = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Reset error on new submission
        try {
            await login({ email, password });
        } catch (error) {
            setError(error.response?.data?.message || 'Invalid email or password');
        }
    };

    const handleGuestLogin = async () => {
        setError(null);
        try {
            await login({}, true); // Guest login
        } catch (error) {
            setError('Guest login failed. Please try again.');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">Login</h2>

                {error && <p className="text-red-600 text-center mb-4">{error}</p>}

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
                    Login
                </button>

                <p className="mt-4 text-center text-gray-600">
                    No account? <Link to="/register" className="text-blue-500 hover:underline">Register</Link>
                </p>

                <div className="mt-6 text-center">
                    <button 
                        type="button" 
                        onClick={handleGuestLogin} 
                        className="bg-gray-600 text-white font-semibold p-3 rounded-lg w-full hover:bg-gray-700 transition"
                    >
                        Continue as Guest
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Login;
