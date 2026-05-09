
afterAll(async () => {
  try {
    const { db } = require("./config/db");

    if (db?.$disconnect) {
      await db.$disconnect();
    }

    jest.clearAllTimers();

  } catch (error) {
    console.error("Cleanup error:", error);
  }
});