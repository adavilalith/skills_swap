
// Base API URL
const API_BASE_URL = '/api';

// Get user information
export async function getUserInfo(uid) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${uid}`);
    if (!response.ok) throw new Error('Failed to fetch user info');
    return await response.json();
  } catch (error) {
    console.error('Error fetching user info:', error);
    throw error;
  }
}

// Create connection request
export async function createConnectionRequest(targetUid) {
  try {
    const response = await fetch(`${API_BASE_URL}/connections/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ targetUid }),
    });
    if (!response.ok) throw new Error('Failed to create connection request');
    return await response.json();
  } catch (error) {
    console.error('Error creating connection request:', error);
    throw error;
  }
}

// Accept connection request
export async function acceptConnectionRequest(requestId) {
  try {
    const response = await fetch(`${API_BASE_URL}/connections/accept`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ requestId }),
    });
    if (!response.ok) throw new Error('Failed to accept connection request');
    return await response.json();
  } catch (error) {
    console.error('Error accepting connection request:', error);
    throw error;
  }
}

// Follow user
export async function followUser(targetUid) {
  try {
    const response = await fetch(`${API_BASE_URL}/follow`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ targetUid }),
    });
    if (!response.ok) throw new Error('Failed to follow user');
    return await response.json();
  } catch (error) {
    console.error('Error following user:', error);
    throw error;
  }
}

// Unfollow user
export async function unfollowUser(targetUid) {
  try {
    const response = await fetch(`${API_BASE_URL}/unfollow`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ targetUid }),
    });
    if (!response.ok) throw new Error('Failed to unfollow user');
    return await response.json();
  } catch (error) {
    console.error('Error unfollowing user:', error);
    throw error;
  }
}

// Get user connections
export async function getConnections(uid) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${uid}/connections`);
    if (!response.ok) throw new Error('Failed to fetch connections');
    return await response.json();
  } catch (error) {
    console.error('Error fetching connections:', error);
    throw error;
  }
}

// Get user followers
export async function getFollowers(uid) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${uid}/followers`);
    if (!response.ok) throw new Error('Failed to fetch followers');
    return await response.json();
  } catch (error) {
    console.error('Error fetching followers:', error);
    throw error;
  }
}

// Get users being followed
export async function getFollowing(uid) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${uid}/following`);
    if (!response.ok) throw new Error('Failed to fetch following');
    return await response.json();
  } catch (error) {
    console.error('Error fetching following:', error);
    throw error;
  }
}


