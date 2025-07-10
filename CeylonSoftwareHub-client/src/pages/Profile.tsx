import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Lock, Save } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      zipCode: user?.address?.zipCode || '',
      country: user?.address?.country || ''
    }
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProfile(profileData);
    } catch (error) {
      // Error handled in context
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setLoading(true);
    // Password change logic would go here
    setLoading(false);
  };

  const isGoogleUser = user?.googleId;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Profile Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-sky-100 dark:bg-sky-900/20 rounded-full flex items-center justify-center">
                      <span className="text-sky-600 dark:text-sky-400 font-bold text-lg">
                        {user?.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {user?.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {user?.email}
                    </p>
                    {isGoogleUser && (
                      <span className="inline-flex items-center px-2 py-1 mt-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded-full">
                        Google Account
                      </span>
                    )}
                  </div>
                </div>

                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      activeTab === 'profile'
                        ? 'bg-sky-100 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>Profile Info</span>
                    </div>
                  </button>
                  
                  {!isGoogleUser && (
                    <button
                      onClick={() => setActiveTab('password')}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        activeTab === 'password'
                          ? 'bg-sky-100 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Lock className="h-4 w-4" />
                        <span>Password</span>
                      </div>
                    </button>
                  )}
                </nav>

                {isGoogleUser && (
                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                      This account is linked to Google. Password changes are managed through your Google account.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Profile Information
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    Update your personal information and address
                  </p>
                </div>

                <form onSubmit={handleProfileSubmit} className="p-6 space-y-6">
                  {/* Personal Info */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="email"
                          value={user?.email}
                          disabled
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
                        />
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Email cannot be changed
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                      <MapPin className="h-5 w-5" />
                      <span>Address Information</span>
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Street Address
                        </label>
                        <input
                          type="text"
                          value={profileData.address.street}
                          onChange={(e) => setProfileData({
                            ...profileData,
                            address: { ...profileData.address, street: e.target.value }
                          })}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          value={profileData.address.city}
                          onChange={(e) => setProfileData({
                            ...profileData,
                            address: { ...profileData.address, city: e.target.value }
                          })}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          State/Province
                        </label>
                        <input
                          type="text"
                          value={profileData.address.state}
                          onChange={(e) => setProfileData({
                            ...profileData,
                            address: { ...profileData.address, state: e.target.value }
                          })}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          ZIP/Postal Code
                        </label>
                        <input
                          type="text"
                          value={profileData.address.zipCode}
                          onChange={(e) => setProfileData({
                            ...profileData,
                            address: { ...profileData.address, zipCode: e.target.value }
                          })}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Country
                        </label>
                        <input
                          type="text"
                          value={profileData.address.country}
                          onChange={(e) => setProfileData({
                            ...profileData,
                            address: { ...profileData.address, country: e.target.value }
                          })}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-sky-600 hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                    >
                      <Save className="h-4 w-4" />
                      <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'password' && !isGoogleUser && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Change Password
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    Update your password to keep your account secure
                  </p>
                </div>

                <form onSubmit={handlePasswordSubmit} className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-sky-600 hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                    >
                      <Save className="h-4 w-4" />
                      <span>{loading ? 'Updating...' : 'Update Password'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;