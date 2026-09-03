const BASE_URL = 'https://6a8d3963baf2ac84246cd751.mockapi.io/api/v1/routes';

// 1. GET: Fetch Routes
export const fetchRoutes = async () => {
  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching routes:', error);
    throw error;
  }
};

// 2. POST: Add Route
export const addRoute = async (newRoute) => {
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRoute),
    });
    if (!response.ok) throw new Error('Failed to add route');
    return await response.json();
  } catch (error) {
    console.error('Error adding route:', error);
    throw error;
  }
};

// 3. PUT: Update Route
export const updateRoute = async (id, updatedRoute) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedRoute),
    });
    if (!response.ok) throw new Error('Failed to update route');
    return await response.json();
  } catch (error) {
    console.error('Error updating route:', error);
    throw error;
  }
};

// 4. DELETE: Delete Route
export const deleteRoute = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete route');
    return await response.json();
  } catch (error) {
    console.error('Error deleting route:', error);
    throw error;
  }
};