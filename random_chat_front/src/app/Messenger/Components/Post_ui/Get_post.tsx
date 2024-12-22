import React from 'react';
import Image from 'next/image';
import ReactionButton from './ReactionButton';

export interface Post {
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
export enum Reaction {
  LIKE = "LIKE",
  LOVE = "LOVE",
  HAHA = "HAHA",
  WOW = "WOW",
  SAD = "SAD",
  ANGRY = "ANGRY",
  CARE = "CARE",
}

export default function GetPosts() {
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [index, setIndex] = React.useState(0);

 
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
    <div className="bg-gray-100 min-h-screen py-6 flex flex-col items-center">
  {/* Navigation Controls */}
  <div className="flex items-center space-x-4 mb-4">
    <button
      className="bg-gray-200 p-3 rounded-full hover:bg-gray-300 transition duration-200"
      onClick={() => {
        setIndex((prevIndex) => (prevIndex - 1 + posts.length) % posts.length);
      }}
    >
      {'<'}
    </button>
    <span className="text-lg font-semibold text-gray-700">
      Post {index + 1} of {posts.length}
    </span>
    <button
      className="bg-gray-200 p-3 rounded-full hover:bg-gray-300 transition duration-200"
      onClick={() => {
        setIndex((prevIndex) => (prevIndex + 1) % posts.length);
      }}
    >
      {'>'}
    </button>
  </div>

  {/* Posts Section */}
  <div className="max-w-4xl w-full">
    {posts.length > 0 ? (
      (() => {
        const post = posts[index]; // Access the post at the current index
        return (
          <div
            key={post.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 m-4"
          >
            {/* Post Header */}
            <div className="flex justify-between items-center mb-4">
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 10h12M6 14h8"
                  />
                </svg>
              </button>
            </div>

            {/* Post Content */}
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{post.title}</h2>
              <p className="text-gray-600">{post.content}</p>
              {post.post_image && (
                <Image
                  src={post.post_image}
                  alt="post_image"
                  width={400}
                  height={250}
                  className="rounded-lg mt-4 object-cover"
                />
              )}
            </div>
            

            {/* Post Actions */}
            <div className="flex justify-between items-center mt-4 border-t pt-4">
              <ReactionButton post={post} sendPostReaction={sendPostReaction} />
              <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500">
                <span className="text-2xl"> 🗨️</span>
                <span>Comment</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-500 hover:text-red-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3.278l3.864 7.9a.5.5 0 01-.44.722H6.576a.5.5 0 01-.44-.722l3.864-7.9z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Share</span>
              </button>
            </div>
          </div>
        );
      })()
    ) : (
      <h1 className="text-center text-gray-500 text-lg">No posts available</h1>
    )}
  </div>
</div>


  );

  function sendPostReaction(post: Post,reaction_type: string) {
    
    fetch(
      `${API_BASE_URL}post/ReactToPost`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({ postId: post.id, reaction: Reaction[reaction_type as keyof typeof Reaction], userId: localStorage.getItem('user_id') }),
      }
    );
  }
}
