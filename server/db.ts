import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is not defined');
}

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error);
}); 