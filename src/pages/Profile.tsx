import React from 'react';

const Profile: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Profile Page</h1>
                <p>This is a protected profile page accessible to all authenticated users.</p>
            </div>
        </div>
    );
};

export default Profile; 