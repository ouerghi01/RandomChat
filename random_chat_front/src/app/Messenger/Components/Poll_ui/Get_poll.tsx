import React from 'react'
interface ResponsePoll {
  id: number;
  question: string;
  options: string[];
  user :string;
  createdAt: Date;
  updatedAt: Date;
}
export default function Get_poll() {
  const [polls,setPolls] = React.useState<ResponsePoll[]>([]);
  React.useEffect(() => {
    fetch('http://localhost:3006/poll/getAllPolls'
      , {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    )
     .then(response => response.json())
     .then(data => {console.log(data);
      setPolls(data)});
  }, []);
  return (
    <div>
      {
      polls.length >0 &&
      polls.map(poll => (
        <div key={poll.id}>
          <h2>{poll.question}</h2>
          <p>Posted by: {poll.user}</p>
        
          { poll.options.length > 0 &&
            poll.options.map((option,index) => (
              
              <p key={index}>{option}</p>
            ))
          }
      
        </div>
      ))}
      
     {polls.length === 0 && <p>No polls found.</p>}
      
    </div>
  )
}
