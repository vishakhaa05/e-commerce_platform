import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';
import { User } from '../models/User.js';

dotenv.config({ override: true });

const main = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bigmarket';
    console.log(`Connecting to database: ${mongoURI}`);
    await mongoose.connect(mongoURI);
    console.log('Connected successfully!');

    const userCount = await User.countDocuments();
    const productCount = await Product.countDocuments();
    const categoryCount = await Category.countDocuments();

    console.log(`\n--- DB Stats ---`);
    console.log(`Users: ${userCount}`);
    console.log(`Products: ${productCount}`);
    console.log(`Categories: ${categoryCount}`);

    if (productCount > 0) {
      console.log('\nSample Products in DB:');
      const products = await Product.find().limit(5);
      products.forEach((p) => {
        console.log(`- Name: ${p.name}, ID: ${p._id}, Category: ${p.category}`);
      });
    } else {
      console.log('\nNo products in DB.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error running script:', error);
    process.exit(1);
  }
};

main();
