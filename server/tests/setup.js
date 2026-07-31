const mongoose = require('mongoose');

after(async () => {
  await mongoose.connection.close();
});