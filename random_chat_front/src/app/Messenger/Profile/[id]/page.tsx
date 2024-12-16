'use client'
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import  '/home/aziz/mysaas/random_chat_front/src/app/globals.css';
import Link from 'next/link';

export interface User_info {
  name: string; // User's name
  email: string; // User's email
  gender: string; // User's gender
  age: number; // User's age
  profile_picture_url?: string; // Optional: URL to the user's profile picture
  bio?: string; // Optional: User's biography or description
  city?: string; // Optional: City of the user
  country?: string; // Optional: Country of the user
  timezone?: string; // Optional: User's timezone
  phone_number?: string; // Optional: User's phone number
  birthday?: Date | null; // Optional: User's birthday
  social_link?: string; // Optional: Social media or personal website link
}


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Page() {
  const { id } = useParams(); // Destructure `id`
  const [user_info, SetUser_info] = useState<User_info | null>(null);
  const user_main = localStorage.getItem('user_email');
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  const [show_edit_profile,SetShowProfile]=useState<boolean>(false);
  const [profile_img, setProfile_img] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [timezone, setTimezone] = useState<string>("");
  const [birthday, setBirthday] = useState<string>("");
  const [phone_number, setPhone_number] = useState<string>("");
  const [social_link, setSocial_link] = useState<string>("");
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setProfile_img(fileReader.result as string);
      };
      fileReader.readAsDataURL(event.target.files[0]);
    }
  };
  async function addProfile(profileData:unknown) {
    const response = await fetch(`${API_BASE_URL}user/CreateProfile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(profileData )
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    const data = await response.json();
    return data;
  }
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const profileData = {
      userId: id,
      profile_picture_url: profile_img,
      bio,
      city,
      country,
      timezone,
      birthday: new Date(birthday),
      phone_number,
      social_link,
    };
    console.log(profileData);
    addProfile(profileData);
    
    // Send `profileData` to your backend
  };

  useEffect(() => {
    if (!id || !token) return;

    fetch(`${API_BASE_URL}user/GetUserInfos/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        SetUser_info(data);
      })
      .catch((error) => {
        console.error('Error fetching user info:', error);
      });
  }, [id, token]);


  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
  {user_info ? (
  <div>
    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 pb-10 pr-9">

      {/* Profile Picture or Placeholder */}
      {user_info.profile_picture_url ? (
        <img
          src={user_info.profile_picture_url}
          alt={`${user_info.name}'s Profile Picture`}
          className="w-24 h-24 rounded-full shadow-lg object-cover"
        />
      ) : (
        <div className="w-24 h-24 rounded-full shadow-lg bg-gray-300 flex items-center justify-center text-gray-700 text-xl font-semibold">
          {user_info.name.charAt(0).toUpperCase()}
        </div>
      )}

      {/* User Information and Actions */}
      <div className="flex flex-col items-center md:items-start gap-4">
        <h1 className="text-2xl font-bold text-gray-800">{user_info.name}</h1>
        
        {user_main === user_info.email && (
          <button 
            className="px-5 py-2 bg-blue-600 text-white font-medium rounded-md shadow-md hover:bg-blue-500 transition duration-200" 
            onClick={() => SetShowProfile(!show_edit_profile)}
          >
            Edit Profile
          </button>
        )}

        <Link 
          href="/Messenger/" 
          className="px-5 py-2 bg-gray-200 text-gray-800 font-medium rounded-md shadow-md hover:bg-gray-300 transition duration-200 flex items-center gap-2"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={1.5} 
            stroke="currentColor" 
            className="w-5 h-5"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M15.75 19.5L8.25 12l7.5-7.5" 
            />
          </svg>
          Back to Messenger
        </Link>
      </div>
    </div>

    <div className="bg-white p-6 rounded-lg shadow-md">
      <p className="text-gray-600 mb-2">
        <span className="font-medium text-gray-700">Intro</span> 
      </p>
      <p className="text-gray-600 mb-2">
        <span className="font-medium text-gray-700">Email:</span> {user_info.email}
      </p>
      <p className="text-gray-600 mb-2">
        <span className="font-medium text-gray-700">Gender:</span> {user_info.gender}
      </p>
      <p className="text-gray-600 mb-2">
        <span className="font-medium text-gray-700">Age:</span> {user_info.age}
      </p>
     
      {user_info.bio && (
        <p className="text-gray-600 mb-2">
          <span className="font-medium text-gray-700">Bio:</span> {user_info.bio}
        </p>
      )}
      {user_info.city && (
        <p className="text-gray-600 mb-2">
          <span className="font-medium text-gray-700">City:</span> {user_info.city}
        </p>
      )}
      {user_info.country && (
        <p className="text-gray-600 mb-2">
          <span className="font-medium text-gray-700">Country:</span> {user_info.country}
        </p>
      )}
      {user_info.social_link && (
        <p className="text-gray-600">
          <span className="font-medium text-gray-700">Social Link:</span>{' '}
          <a
            href={user_info.social_link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {user_info.social_link}
          </a>
        </p>
      )}
    </div>
  </div>
) : (
  <div className="flex items-center justify-center h-32">
    <p className="text-gray-500">Loading user information...</p>
  </div>
)}

      </div>
      <div className="flex items-center justify-center mt-4">
        
        {
          show_edit_profile && id && (
             (
              <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
                <div className="max-w-lg w-full bg-white shadow-lg rounded-lg p-6">
                  <h1 className="text-2xl font-bold text-gray-800 mb-4">Create Profile</h1>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Profile Picture */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Profile Picture</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                      />
                      {profile_img && (
                        <img src={profile_img} alt="Profile" className="mt-4 w-24 h-24 rounded-full object-cover" />
                      )}
                    </div>
          
                    {/* Bio */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Bio</label>
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-500"
                        rows={3}
                        placeholder="Tell us about yourself"
                      />
                    </div>
          
                    {/* City */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">City</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-500"
                        placeholder="City"
                      />
                    </div>
          
                    {/* Country */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Country</label>
                      <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-500"
                        placeholder="Country"
                      />
                    </div>
          
                    {/* Timezone */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Timezone</label>
                      <input
                        type="text"
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-500"
                        placeholder="Timezone (e.g., GMT+1)"
                      />
                    </div>
          
                    {/* Birthday */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Birthday</label>
                      <input
                        type="date"
                        value={birthday}
                        onChange={(e) => setBirthday(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-500"
                      />
                    </div>
          
                    {/* Phone Number */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={phone_number}
                        onChange={(e) => setPhone_number(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-500"
                        placeholder="Phone Number"
                      />
                    </div>
          
                    {/* Social Link */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Social Link</label>
                      <input
                        type="url"
                        value={social_link}
                        onChange={(e) => setSocial_link(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-500"
                        placeholder="Social Link (e.g., LinkedIn, GitHub)"
                      />
                    </div>
          
                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white rounded-lg p-3 hover:bg-blue-700 focus:ring focus:ring-blue-500"
                    >
                      Create Profile
                    </button>
                  </form>
                </div>
              </div>
            )
          )
        }

      </div>
    </div>
  );
}
