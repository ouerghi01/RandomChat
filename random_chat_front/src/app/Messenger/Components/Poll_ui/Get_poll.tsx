import React, { useState, useEffect } from 'react';

interface ResponsePoll {
  id: number;
  question: string;
  options: OptionsResponse[];
  user: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface OptionsResponse {
  id: number;
  content: string;
  users_vote: number[];
}

export default function GetPoll() {
  const [polls, setPolls] = useState<ResponsePoll[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalVotes, setTotalVotes] = useState<number>(0);

  useEffect(() => {
    setTotalVotes(
      polls.reduce(
        (total, poll) =>
          total +
          poll.options.reduce((sum, option) => sum + option.users_vote.length, 0),
        0
      )
    );
  }, [polls]);

  useEffect(() => {
    fetch('http://localhost:3006/poll/getAllPolls', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch polls');
        }
        return response.json();
      })
      .then((data) => {
        setPolls(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  const handleVote = (optionIndex: number) => {
    fetch(`http://localhost:3006/poll/vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify({ optionIndex, userId: localStorage.getItem('user_id') }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to submit vote');
        }
        return response.json();
      })
      .then((updatedPoll) => {
        setPolls((prevPolls) =>
          prevPolls.map((poll) => (poll.id === updatedPoll.id ? updatedPoll : poll))
        );
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  const calculatePercentage = (votes: number) => {
    if (totalVotes === 0) return '0%';
    return ((votes / totalVotes) * 100).toFixed(2) + '%';
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">
        Available Polls
      </h1>

      {isLoading && <p className="text-gray-500 text-center">Loading polls...</p>}

      {error && (
        <p className="text-red-500 text-center">
          Error: {error}. Please try again later.
        </p>
      )}

      {!isLoading && !error && polls.length === 0 && (
        <p className="text-gray-500 text-center">No polls found.</p>
      )}

      {!isLoading && !error && polls.length > 0 && (
        <div className="space-y-8">
          {polls.map((poll) => {
            return (
              <div
                key={poll.id}
                className="p-6 bg-white shadow-lg rounded-lg border-4 border-indigo-500/100 border-gray-200"
              >
                <h2 className="text-xl font-semibold text-blue-700 mb-2">
                  {poll.question}
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Posted by: <span className="font-medium">{poll.user}</span>
                </p>
                <ul className="space-y-4">
                  {poll.options.map((option, index) => (
                    <li
                      key={index}
                      className={`flex items-center justify-between p-3 border rounded-lg transition ${
                        option.users_vote.includes(
                          parseInt(localStorage.getItem('user_id') || '0')
                        )
                          ? 'bg-blue-100 border-blue-400'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                      onClick={() => handleVote(option.id)}
                    >
                      <div className="text-gray-800 font-medium">{option.content}</div>
                      <div className="text-gray-600 text-sm flex items-center space-x-2">
                        <span>{calculatePercentage(option.users_vote.length)}</span>
                        {option.users_vote.includes(
                          parseInt(localStorage.getItem('user_id') || '0')
                        ) && (
                          <span className="text-xs bg-blue-400 text-white px-2 py-1 rounded-full">
                            Voted
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-gray-500 mt-4">
                  Created at: {new Date(poll.createdAt).toLocaleString()}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

