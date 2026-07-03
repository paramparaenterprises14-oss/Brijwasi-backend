const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');

const menuRoutes = require('./routes/menuRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const authRoutes = require('./routes/authRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
});

// Make io accessible in controllers via app
app.set('io', io);

app.use(cors({
   origin: ['http://localhost:3000', 'https://brijwasi-frontend.vercel.app'],
  credentials: true, 
}));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB se connect ho gaya!'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use('/api/menu', menuRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/contact', require('./routes/contactRoutes'));

app.get('/', (req, res) => {
  res.json({ success: true, message: 'Foodies Dice backend is running!' });
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server chal raha hai port ${PORT} par`);
});