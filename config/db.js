const mongoose = require("mongoose");
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbLink = `mongodb+srv://${dbUser}:${dbPassword}@nuvem.kqruf5p.mongodb.net/?retryWrites=true&w=majority&appName=nuvem
`;

const connectDb = async () => {
  try {
    const dbConn = await mongoose.connect(dbLink);
    console.log("Database Connect Sucessful");
    return dbConn;
  } catch (e) {
    console.log(e);
  }
};

module.exports = connectDb;
