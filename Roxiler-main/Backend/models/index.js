const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const app = express();
const transactionRoutes = require('./routes/transactionRoutes');

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/transactionsDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Database connected'))
  .catch((error) => console.error('Database connection failed:', error));

app.use('/api', transactionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
