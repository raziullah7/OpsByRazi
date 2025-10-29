import { useEffect, useState } from 'react';
import api from './api/client';

interface User {
  id: number;
  name: string;
}

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState('');

  // Fetch all users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get<User[]>('/users');
        setUsers(res.data);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };
    fetchUsers();
  }, []);

  // Add a new user
  const addUser = async () => {
    if (!name.trim()) return;

    try {
      const res = await api.post<User>('/users', { name });
      setUsers(prev => [...prev, res.data]);
      setName('');
    } catch (err) {
      console.error('Error adding user:', err);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Users</h1>

      <div style={{ marginBottom: '1rem' }}>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Enter name"
        />
        <button onClick={addUser} style={{ marginLeft: '0.5rem' }}>
          Add User
        </button>
      </div>

      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
