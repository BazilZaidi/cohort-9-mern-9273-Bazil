import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Trash2, Pencil, Check, X, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getProfile, updateProfile } from '../services/authService';

const MAX_IMAGE_SIZE_BYTES = 1 * 1024 * 1024; // 1MB

function Profile() {
  const { logoutUser, updateUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getProfile();
      setProfile(data);
      setNameInput(data.name);
    } catch (err) {
      console.error(err);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const handleSaveName = async () => {
    if (!nameInput.trim()) {
      setError('Name cannot be empty');
      return;
    }
    try {
      setSaving(true);
      setError('');
      const updated = await updateProfile({ name: nameInput.trim() });
      setProfile(updated);
      updateUser({ name: updated.name });
      setEditingName(false);
    } catch (err) {
      console.error(err);
      setError('Failed to update name');
    } finally {
      setSaving(false);
    }
  };

  const handlePictureChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setError('Image must be under 1MB');
      e.target.value = '';
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        setSaving(true);
        setError('');
        const updated = await updateProfile({ profilePicture: reader.result });
        setProfile(updated);
        updateUser({ profilePicture: updated.profilePicture });
      } catch (err) {
        console.error(err);
        setError('Failed to upload picture');
      } finally {
        setSaving(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePicture = async () => {
    try {
      setSaving(true);
      setError('');
      const updated = await updateProfile({ profilePicture: null });
      setProfile(updated);
      updateUser({ profilePicture: updated.profilePicture });
    } catch (err) {
      console.error(err);
      setError('Failed to remove picture');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div role="status" aria-label="Loading profile" className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950">
        <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8">
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to notes
        </button>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 px-3 py-2 rounded-lg mb-4">{error}</p>
        )}

        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            {profile?.profilePicture ? (
              <img
                src={profile.profilePicture}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-gray-100 dark:border-gray-800"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-900 dark:bg-gray-700 text-white flex items-center justify-center text-3xl font-semibold">
                {profile?.name?.[0]?.toUpperCase()}
              </div>
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={saving}
              aria-label="Change profile picture"
              className="absolute bottom-0 right-0 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 p-2 rounded-full hover:bg-gray-800 dark:hover:bg-white transition-colors disabled:opacity-50"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePictureChange}
              className="hidden"
            />
          </div>

          {profile?.profilePicture && (
            <button
              type="button"
              onClick={handleRemovePicture}
              disabled={saving}
              className="flex items-center gap-1 text-xs text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 mt-3 disabled:opacity-50"
            >
              <Trash2 className="w-3 h-3" />
              Remove photo
            </button>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">
            Name
          </label>
          {editingName ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-500"
                autoFocus
              />
              <button
                type="button"
                onClick={handleSaveName}
                disabled={saving}
                aria-label="Save name"
                className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 disabled:opacity-50"
              >
                <Check className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingName(false);
                  setNameInput(profile.name);
                  setError('');
                }}
                aria-label="Cancel edit"
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{profile?.name}</p>
              <button
                type="button"
                onClick={() => setEditingName(true)}
                aria-label="Edit name"
                className="text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">
            Email
          </label>
          <p className="text-base text-gray-700 dark:text-gray-300">{profile?.email}</p>
        </div>

        {profile?.createdAt && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-6">
            Member since {new Date(profile.createdAt).toLocaleDateString()}
          </p>
        )}

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-gray-700 px-4 py-2.5 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;