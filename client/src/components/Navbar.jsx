import React from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onResetFilters }) => {
    const { user, logout } = useAuth();

    return (
        <div className="bg-white shadow-md p-4 flex justify-between items-center px-6 md:px-10">
            {/* 🔥 Click "Event Manager" to reset filters */}
            <h1
                className="text-2xl font-semibold text-gray-800 cursor-pointer hover:text-blue-500 transition"
                onClick={onResetFilters}
            >
                EventSync
            </h1>

            {/* 🔥 Show Logout Button if User is Logged In */}
            {user && (
                <button
                    onClick={logout}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition"
                >
                    Logout
                </button>
            )}
        </div>
    );
};

export default Navbar;
