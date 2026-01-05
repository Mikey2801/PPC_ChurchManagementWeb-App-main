// src/mock/adminDatabase.js

// Mock data for admin dashboard
export const users = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Admin',
    status: 'Active',
    lastLogin: '2023-05-15T14:30:00',
    joinDate: '2022-01-15',
    avatar: '',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'User',
    status: 'Active',
    lastLogin: '2023-05-16T09:15:00',
    joinDate: '2022-02-20',
    avatar: '',
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    role: 'Ministry Leader',
    status: 'Inactive',
    lastLogin: '2023-04-30T16:45:00',
    joinDate: '2022-03-10',
    avatar: '',
  },
  {
    id: 4,
    name: 'Sarah Williams',
    email: 'sarah.williams@example.com',
    role: 'User',
    status: 'Suspended',
    lastLogin: '2023-05-10T11:20:00',
    joinDate: '2022-04-05',
    avatar: '',
  },
  {
    id: 5,
    name: 'David Brown',
    email: 'david.brown@example.com',
    role: 'User',
    status: 'Active',
    lastLogin: '2023-05-17T08:45:00',
    joinDate: '2022-05-12',
    avatar: '',
  },
];

export const ministries = [
  {
    id: 1,
    name: 'Music Ministry',
    description: 'Leads the congregation in worship through music.',
    leader: 'John Doe',
    members: 12,
    status: 'Active',
    category: 'Worship',
    createdDate: '2022-01-15',
    upcomingEvents: 3,
  },
  {
    id: 2,
    name: 'Youth Ministry',
    description: 'Engages and nurtures the spiritual growth of young members.',
    leader: 'Jane Smith',
    members: 25,
    status: 'Active',
    category: 'Community',
    createdDate: '2022-02-20',
    upcomingEvents: 2,
  },
  {
    id: 3,
    name: 'Outreach Program',
    description: 'Organizes community service and evangelism activities.',
    leader: 'Mike Johnson',
    members: 8,
    status: 'Active',
    category: 'Service',
    createdDate: '2022-03-10',
    upcomingEvents: 1,
  },
  {
    id: 4,
    name: 'Prayer Group',
    description: 'Dedicated to intercessory prayer for the church and community needs.',
    leader: 'Sarah Williams',
    members: 15,
    status: 'Inactive',
    category: 'Spiritual Growth',
    createdDate: '2022-04-05',
    upcomingEvents: 0,
  },
  {
    id: 5,
    name: "Children's Ministry",
    description: 'Provides spiritual education and activities for children.',
    leader: 'David Brown',
    members: 18,
    status: 'Active',
    category: 'Education',
    createdDate: '2022-05-12',
    upcomingEvents: 4,
  },
];

// Example mock CRUD functions (not persistent)
export function getUsers() {
  return users;
}

export function getMinistries() {
  return ministries;
}

export function addUser(user) {
  users.push({ ...user, id: users.length + 1 });
}

export function addMinistry(ministry) {
  ministries.push({ ...ministry, id: ministries.length + 1 });
}

export function deleteUser(id) {
  const idx = users.findIndex(u => u.id === id);
  if (idx > -1) users.splice(idx, 1);
}

export function deleteMinistry(id) {
  const idx = ministries.findIndex(m => m.id === id);
  if (idx > -1) ministries.splice(idx, 1);
}

// Add more CRUD functions as needed for events, donations, etc.
