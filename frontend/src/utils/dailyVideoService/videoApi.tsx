// Define your module's exports with a named default export
const RoomService = {
  async createRoom() {
    const exp = Math.round(Date.now() / 1000) + 60 * 30;
    const options = {
      properties: {
        exp,
      },
    };

    const VITE_DAILY_API_KEY = import.meta.env.VITE_DAILY_API_KEY;

    const response = await fetch("https://api.daily.co/v1/rooms/", {
      method: "POST",
      body: JSON.stringify(options),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${VITE_DAILY_API_KEY}`,
      },
    });

    return await response.json();
  },
};

export default RoomService; // Export the named default export
