import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function checkDB() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));

    // Check tobeLoaded collection
    const count = await db.collection('tobeLoaded').countDocuments();
    console.log('Documents in tobeLoaded collection:', count);
    
    // Show one document if exists
    if (count > 0) {
      const doc = await db.collection('tobeLoaded').findOne();
      console.log('Sample document:', JSON.stringify(doc, null, 2));
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

checkDB();
