const app = require('./app');

const mongoose = require('mongoose');

const PORT = process.env.PORT || 3000;
const uriDb = process.env.DB_HOST;

const connection = mongoose.connect(uriDb);

const startServer = async () => {
  try {
    await connection;
    console.log(`Database connection successful`);
    app.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}`);
    });
  } catch (error) {
    console.log(`Server not running. Error message: ${error.message}`);
    process.exit(1);
  }
}

startServer();