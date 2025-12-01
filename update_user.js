const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/expense-tracker')
  .then(async () => {
    console.log('Connected to MongoDB');
    const result = await mongoose.connection.db.collection('users').updateOne(
      { email: 'test_sub@example.com' },
      { $set: { isVerified: true } }
    );
    console.log('Update result:', result);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
