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
    <div className="max-w-4xl  mx-auto p-6">
      {posts.length > 0 ? (
        <div className="flex-col ">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg gap-9 shadow-md hover:shadow-lg transition-shadow p-4"
            >
              <UserInfo
                userId={post.userId}
                email={post.email}
                profile_image={post.profile_image}
                isAnonymous={post.isAnonymous}
                CreatedAt={post.CreatedAt}
              />
              <div className="mt-4">
                <h2 className="text-lg font-bold text-gray-800">{post.title}</h2>
                <p className="text-gray-600 mt-2">{post.content}</p>
                <Image
                  src={post.post_image}
                  alt="post_image"
                  width={300}
                  height={200}
                  className="rounded-lg mt-4"
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <h1 className="text-center text-gray-500 text-lg">No posts available</h1>
      )}
    </div>
  );
}

