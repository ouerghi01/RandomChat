import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Post } from './Get_post';

interface ReactionButtonProps {
  post: Post;
  sendPostReaction: (post: Post, reaction: string) => void;
}

const ReactionButton: React.FC<ReactionButtonProps> = ({ post, sendPostReaction }) => {
  const [showReactions, setShowReactions] = useState(false);

  return (
    <button
      className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 relative"
      onMouseEnter={() => setShowReactions(true)}
      onMouseLeave={() => setShowReactions(false)}
    >
      {/* Main Reaction Button */}
      <div
        id="main-reaction"
        className="border-none p-2 bg-no-repeat bg-none text-2xl"
        onClick={() => sendPostReaction(post, 'LIKE')}
      >
        👍 
      </div>
      <h1>Like</h1>

      {/* Reaction Popup */}
      <AnimatePresence>
        {showReactions && (
          <motion.div
            className="absolute bottom-12 left-0 flex space-x-3 bg-white p-3 rounded-lg shadow-lg z-10"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            {/* Individual Reaction Icons */}
            <motion.div
              id="love"
              whileHover={{ scale: 1.8 }}
              className="cursor-pointer text-lg"
              onClick={() => sendPostReaction(post, 'LOVE')}
            >
              ❤️
            </motion.div>
            <motion.div
              id="like"
              whileHover={{ scale: 1.8 }}
              className="cursor-pointer text-lg"
              onClick={() => sendPostReaction(post, 'LIKE')}
            >
              👍
            </motion.div>
            <motion.div
              id="haha"
              whileHover={{ scale: 1.8 }}
              className="cursor-pointer text-lg"
              onClick={() => sendPostReaction(post, 'HAHA')}
            >
              🤣
            </motion.div>
            <motion.div
              id="wow"
              whileHover={{ scale: 1.8 }}
              className="cursor-pointer text-lg"
              onClick={() => sendPostReaction(post, 'WOW')}
            >
              😮
            </motion.div>
            <motion.div
              id="sad"
              whileHover={{ scale: 1.8 }}
              className="cursor-pointer text-lg"
              onClick={() => sendPostReaction(post, 'SAD')}
            >
              😢
            </motion.div>
            <motion.div
              id="angry"
              whileHover={{ scale: 1.8 }}
              className="cursor-pointer text-lg"
              onClick={() => sendPostReaction(post, 'ANGRY')}
            >
              😡
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
};

export default ReactionButton;
