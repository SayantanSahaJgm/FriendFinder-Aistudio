import type { NearbyUser, User } from './types';

// This data is now internal to the API module.
const mockUsers: User[] = [
  { id: 2, name: 'Sarah', avatarUrl: 'https://picsum.photos/id/1011/200' },
  { id: 3, name: 'Alex', avatarUrl: 'https://picsum.photos/id/1012/200' },
  { id: 4, name: 'Maya', avatarUrl: 'https://picsum.photos/id/1027/200' },
  { id: 5, name: 'Jordan', avatarUrl: 'https://picsum.photos/id/1062/200' },
  { id: 6, name: 'Alex Rodriguez', avatarUrl: 'https://picsum.photos/id/1012/200' },
  { id: 7, name: 'Sarah Chen', avatarUrl: 'https://picsum.photos/id/1011/200' },
  { id: 8, name: 'Chris Lee', avatarUrl: 'https://picsum.photos/id/1025/200' },
  { id: 9, name: 'Emily White', avatarUrl: 'https://picsum.photos/id/1026/200' },
];

/**
 * Simulates fetching a list of nearby users from an API using Geolocation.
 * @param currentUserId The ID of the current user to exclude from the list.
 */
export const fetchNearbyUsers = (currentUserId: number): Promise<NearbyUser[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Exclude the current user
      const otherUsers = mockUsers.filter(u => u.id !== currentUserId);

      // Shuffle and pick a few random users to display
      const shuffled = [...otherUsers].sort(() => 0.5 - Math.random());
      const selectedUsers = shuffled.slice(0, 5);

      const result: NearbyUser[] = selectedUsers.map(user => ({
        ...user,
        // Assign a random realistic distance for demonstration purposes.
        distance: `${(Math.random() * 2 + 0.1).toFixed(1)} km away`,
      }));

      resolve(result);
    }, 800); // Simulate network latency
  });
};

/**
 * Simulates fetching a list of nearby users via Bluetooth scan.
 * @param currentUserId The ID of the current user to exclude from the list.
 */
export const fetchNearbyBluetoothUsers = (currentUserId: number): Promise<NearbyUser[]> => {
    return new Promise((resolve) => {
    setTimeout(() => {
      const otherUsers = mockUsers.filter(u => u.id !== currentUserId);
      const shuffled = [...otherUsers].sort(() => 0.5 - Math.random());
      // Select fewer users for Bluetooth to make it feel more intimate/short-range
      const selectedUsers = shuffled.slice(0, Math.floor(Math.random() * 4) + 1);

      const distances = ["Very Close", "Nearby", "A few meters away"];

      const result: NearbyUser[] = selectedUsers.map(user => ({
        ...user,
        distance: distances[Math.floor(Math.random() * distances.length)],
      }));

      resolve(result);
    }, 2500); // Simulate a longer scan time
  });
}

/**
 * Simulates fetching a list of users on the same WiFi network.
 * @param currentUserId The ID of the current user to exclude from the list.
 */
export const fetchNearbyWifiUsers = (currentUserId: number): Promise<NearbyUser[]> => {
    return new Promise((resolve) => {
    setTimeout(() => {
      const otherUsers = mockUsers.filter(u => u.id !== currentUserId);
      const shuffled = [...otherUsers].sort(() => 0.5 - Math.random());
      // Select a variable number of users for WiFi
      const selectedUsers = shuffled.slice(0, Math.floor(Math.random() * 5) + 2);

      const result: NearbyUser[] = selectedUsers.map(user => ({
        ...user,
        distance: "On your network",
      }));

      resolve(result);
    }, 1500); // Simulate a network scan time
  });
}