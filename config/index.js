require("dotenv").config();
module.exports = {
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  GOOGLE_KEY_FILE_NAME: process.env.GOOGLE_KEY_FILE_NAME,
  PROJECT_ID: process.env.PROJECT_ID,
  BUCKET: process.env.BUCKET,
};
