import React from 'react';
import Image from 'next/image';

interface Post {
  title: string;
  content: string;
  post_image: string;
  id: number;
  userId: number;
  email: string;
  profile_image: string;
  isAnonymous: boolean;
  CreatedAt: Date;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function GetPosts() {
  const [posts, setPosts] = React.useState<Post[]>([]);

  React.useEffect(() => {
    fetch(`${API_BASE_URL}post/GetAllPosts`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setPosts(data));
  }, []);

  const UserInfo = ({ userId, email, profile_image, isAnonymous, CreatedAt }: Omit<Post, 'title' | 'content' | 'post_image' | 'id'>) => (
    <div className="flex items-center space-x-4" key={userId}>
      {isAnonymous ? (
        <div
          className="w-12 h-12 rounded-full bg-blue-400 flex justify-center items-center text-white font-bold text-lg"
        >
          A
        </div>
      ) : (
        <Image src={profile_image} alt="profile_image" width={48} height={48} className="rounded-full" />
      )}
      <div>
        <p className="text-sm font-medium text-gray-700">{isAnonymous ? 'Unknown' : email}</p>
        <p className="text-xs text-gray-500">{new Date(CreatedAt).toLocaleString()}</p>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-100 w-96 min-h-screen py-6">
      <div className="max-w-4xl mx-auto">
        {/* Posts Section */}
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg m-4 transition-shadow p-4"
            >
              {/* Post Header */}
              <div className="flex justify-between items-center">
                <UserInfo
                  userId={post.userId}
                  email={post.email}
                  profile_image={post.profile_image}
                  isAnonymous={post.isAnonymous}
                  CreatedAt={post.CreatedAt}
                />
                <button className="text-gray-500 hover:text-gray-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 10h12M6 14h8" />
                  </svg>
                </button>
              </div>

              {/* Post Content */}
              <div className="mt-4">
                <h2 className="text-lg font-bold text-gray-800">{post.title}</h2>
                <p className="text-gray-600 mt-2">{post.content}</p>
                {post.post_image && (
                  <Image
                    src={post.post_image}
                    alt="post_image"
                    width={600}
                    height={400}
                    className="rounded-lg mt-4 object-cover"
                  />
                )}
              </div>

              {/* Post Actions */}
              <div className="flex justify-between items-center mt-4 border-t pt-2">
                <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3.172 5.172a4 4 0 010-5.656A4 4 0 018.656 5.172l-.482.482a4 4 0 01-5.656 0zM9.828 12.828a4 4 0 010-5.656A4 4 0 015.172 12.828l.482.482a4 4 0 01-5.656 0z" />
                  </svg>
                  <span>Like</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M2 5a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm10 3a1 1 0 00-1-1H4a1 1 0 000 2h5a1 1 0 001-1z" clipRule="evenodd" />
                  </svg>
                  <span>Comment</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-500 hover:text-red-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3.278l3.864 7.9a.5.5 0 01-.44.722H6.576a.5.5 0 01-.44-.722l3.864-7.9z" clipRule="evenodd" />
                  </svg>
                  <span>Share</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <h1 className="text-center text-gray-500 text-lg">No posts available</h1>
        )}
      </div>
    </div>
  );
}
