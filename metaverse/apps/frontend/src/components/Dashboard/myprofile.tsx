import React from 'react';
import { useSelector } from 'react-redux';

const MyProfile: React.FC = () => {
  const { user } = useSelector((state: any) => state.profile); // Replace 'any' with the correct type

  if (!user) {
    return <div>Loading...</div>; // Display a loading message while the data is being fetched
  }

  // Dummy spaces data
  const spaces = [
    { id: 1, name: 'Space 1', imageUrl: 'https://res.cloudinary.com/ddlepk8lb/image/upload/v1733666529/space_xperki.png' },
    { id: 2, name: 'Space 2', imageUrl: 'https://res.cloudinary.com/ddlepk8lb/image/upload/v1733666529/space_xperki.png' },
    { id: 3, name: 'Space 3', imageUrl: 'https://res.cloudinary.com/ddlepk8lb/image/upload/v1733666529/space_xperki.png' },
    { id: 4, name: 'Space 4', imageUrl: 'https://res.cloudinary.com/ddlepk8lb/image/upload/v1733666529/space_xperki.png' },
  ];

  return (
    <div className='flex flex-col gap-y-6'>
      <div className='p-4 text-white shadow-lg rounded-md bg-gradient-to-b from-gray-700 to-black'>
        <h1 className="text-2xl font-bold mb-4">My Profile</h1>
        <div className="flex items-center space-x-4 mb-4">
          <div>
            <img
              src={user.avatar?.imageUrl || '/path/to/default-avatar.jpg'}
              alt={`${user.username}'s avatar`}
              className="h-24 w-24 rounded-full"
            />
            <button className="mt-2 bg-blue-700 text-white py-1 px-3 ml-3 rounded hover:bg-blue-600">
              Upload
            </button>
          </div>
          <div className='flex gap-x-3'>
            <p className="text-xl font-bold"><span className='font-medium'>Username:</span> {user.username}</p>
            <button className="ml-2 bg-blue-700 py-1 px-2 rounded text-white font-medium hover:bg-blue-600">
              Edit
            </button>
          </div>
        </div>
      </div>

      <div className='p-4 text-white shadow-lg rounded-md bg-gradient-to-b from-gray-700 to-black'>
        <h2 className="text-xl font-bold mt-6 mb-4">My Spaces</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {spaces.map((space) => (
            <div key={space.id} className="flex flex-col items-center bg-gray-100 p-4 rounded-lg shadow-md">
              <img
                src={space.imageUrl}
                alt={`Image of ${space.name}`}
                className="h-[95%] w-[95%] rounded-md mb-2"
              />
              <p className="text-center text-sm font-semibold">{space.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
