"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from '../../../utils/api';

export interface User {
  _id: string;
  username: string;
  email: string;
  role?: string;
  createdAt?: string;
  __v?: number;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/users`,{credentials:"include"});
        const data = await response.json();
        setUsers(data);
        
      } catch  {
        
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="space-y-8 p-4 animate__fadeIn">
      <h1 className="text-4xl font-bold text-yellow-900">Users - Books Store</h1>
      <div className="card p-6 overflow-y-auto" style={{ maxHeight: "70vh" }}>
        <ul className="space-y-4">
          {users.map((user) => (
            <li key={user._id} className="border-b py-3 flex justify-between items-center animate__fadeInUp">
              <span className="text-gray-800">
                {user.username} ({user.email}) 
                {user.createdAt && ` - Joined: ${new Date(user.createdAt).toLocaleDateString()}`}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}