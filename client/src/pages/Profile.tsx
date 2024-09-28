import React from 'react';
import UploadForm from '../components/UploadForm';

const Profile: React.FC = () => {
    return (
        <div className="font-sans">
            <section className="py-20 text-center">
                <h2 className="text-3xl font-semibold mb-6">Upload Your Resume</h2>
                <UploadForm />
            </section>
        </div>
    );
};

export default Profile;