import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CreatePoll() {
  const [options, setOptions] = useState<string[]>([""]);
  const [question, setQuestion] = useState<string>("");
  const [isCreatingPoll, setIsCreatingPoll] = useState<boolean>(false);
  const user_id = localStorage.getItem("user_id");

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const handleSubmit = () => {
    console.log("Poll created:", { question, options });
    fetch(
      "http://localhost:3006/poll/createPoll",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",  
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({ question, options, user_id }),
      }
    )
    setQuestion("");
    setOptions([""]);
    setIsCreatingPoll(false);
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      {/* Create Poll Button */}
      <button
        onClick={() => setIsCreatingPoll(!isCreatingPoll)}
        className="p-3 bg-purple-500 text-white rounded-md shadow-md hover:bg-blue-700 transition duration-200"
      >
        Create Poll
      </button>

      {/* Poll Creation Form */}
      <AnimatePresence>
        {isCreatingPoll && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md bg-white p-4 rounded-lg shadow-md"
          >
            <h2 className="text-lg font-semibold mb-4 text-gray-700">Create a Poll</h2>

            {/* Question Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Question
              </label>
              <input
                type="text"
                placeholder="Enter your question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Options */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Options
              </label>
              {options.map((option, index) => (
                <input
                  key={index}
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                />
              ))}
              <button
                onClick={addOption}
                className="mt-2 w-full text-blue-500 bg-blue-100 py-2 rounded-md hover:bg-blue-200 transition duration-200"
              >
                + Add Option
              </button>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!question || options.some((opt) => !opt.trim())}
              className={`w-full mt-4 p-2 rounded-md text-white ${
                question && !options.some((opt) => !opt.trim())
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              } transition duration-200`}
            >
              Submit Poll
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

