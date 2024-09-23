import React from 'react';

const ProfileModal = ({ closeModal }) => {
  // Fetch the user data from localStorage (or assume mock data)
  const userProfile = JSON.parse(localStorage.getItem('user'));
  console.log(userProfile)
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      {/* Modal Content */}
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
          onClick={closeModal}
        >
          &times;
        </button>

        <div className="text-center mb-4">
          <h2 className="text-2xl font-semibold">{userProfile.associateName}</h2>
          <p className="text-sm text-gray-500">{userProfile.role.roleDescription}</p>
        </div>

        <div className="space-y-2">
        <p><strong>Username:</strong> {userProfile.userName}</p>
          <p><strong>ID:</strong> {userProfile.associateId}</p>
          <p><strong>Status:</strong> {userProfile.active ? 'Active' : 'Inactive'}</p>
          <p><strong>Role:</strong> {userProfile.role.roleName}</p>
        </div>

        {/* Modal footer with action buttons */}
        <div className="mt-4 flex justify-between">
          <button
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            onClick={() => alert('Password change functionality')}
          >
            Change Password
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={() => alert('Logging out...')}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
