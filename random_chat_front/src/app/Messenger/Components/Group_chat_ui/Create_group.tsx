import React, { useState } from 'react';
import { Input } from "@nextui-org/input";
export default function CreateGroup() {
  const [isCreatingGroup, setIsCreatingGroup] = useState<boolean>(false);
  const [createGroup, setCreateGroup] = useState({
    admin: localStorage.getItem("user_id"),
    name: "",
    description: "",
    logo_group: "",
    max_member_count: 0,
  });

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCreateGroup({
      ...createGroup,
      [name]: value,
    });
  };

  // Toggle group creation form state
  const handleCreateGroup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3006/group/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify(createGroup),
      });
      if (response.ok) {
        alert("Group created successfully!");
        setCreateGroup({
          name: "",
          description: "",
          max_member_count: 0,
          logo_group: "",
          admin: localStorage.getItem("user_id"),
        });
        setIsCreatingGroup(false);
      } else {
        alert("Failed to create group!");
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setIsCreatingGroup(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setCreateGroup({
          ...createGroup,
          logo_group: fileReader.result as string,
        });
      };
      fileReader.readAsDataURL(event.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-4 ">
      {/* Create Button */}
      <button
        onClick={() => setIsCreatingGroup(!isCreatingGroup)}
        className="p-3 bg-sky-800 text-white rounded-md shadow-md hover:bg-purple-700 transition duration-200"
      >
        Create Group
      </button>

      {/* Group Creation Form */}
      {isCreatingGroup && (
        <form onSubmit={handleCreateGroup} className="flex flex-col space-y-4 w-full max-w-md bg-slate-500">
          {/* Group Name Input */}
          <Input
            label="Group Name"
            placeholder="Enter group name"
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={handleChange}
            name="name"
            value={createGroup.name}
          />

          {/* Group Description Input */}
          <Input
            label="Group Description"
            placeholder="Enter group description"
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={handleChange}
            name="description"
            value={createGroup.description}
          />

          {/* Group Number Max Input */}
          <Input
            type="number"
            label="Max Members"
            placeholder="Enter max number of members"
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={handleChange}
            name="number_max"
            value={createGroup.max_member_count.toString()}
          />

          {/* Group Logo Input */}
          <Input
            type="file"
            
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            accept="image/*"
            onChange={handleImageUpload}
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="p-3  bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-700 transition duration-200"
          >
            Create Group
          </button>
        </form>
      )}
    </div>
  );
}

