import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';
import { Coupon } from '../models/Coupon.js';

dotenv.config({ override: true });

const categoriesData = [
  { name: 'Groceries', slug: 'grocery', description: 'Fresh kitchen staples and groceries' },
  { name: 'Stationary', slug: 'stationary', description: 'Office and school writing equipment' },
  { name: 'Snacks', slug: 'snacks', description: 'Crisps, chocolates, and biscuits' },
];

const productsData = [
  {
    name: 'Sugar',
    category: 'grocery',
    price: 40,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcTybVNJcKkMFYGBfX2f3xv9VkfUkRq4fkOw&s',
    description: 'Refined high-quality pure sugar, perfect for tea, coffee, and baking.',
    stock: 50,
  },
  {
    name: 'Salt',
    category: 'grocery',
    price: 40,
    image: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcR-8vc4XI3RSrubEQTRCIyH1AD4j09sc3Lga__6rQFM6-iv1B8gsl-5LsNP0B6VxsM2_PLiKRk3hBhyTzmKpvGOLbkL6lmevonKi9SbvtQmRlQOALdUy3J2&usqp=CAE',
    description: 'Iodized table salt for active health and delicious cooking.',
    stock: 100,
  },
  {
    name: 'Tea',
    category: 'grocery',
    price: 45,
    image: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTNRryatFuVKXpzv7FRO1ZIZC7XBGbjw09IB6OHWY-q7NsYnA_-zWJLQKCBThutMOz-v6gc4PeO8VtezGC4QofWPgX781BMiJVd2J7CVu7Eo9aE19mvYjbZ1w&usqp=CAE',
    description: 'Premium black tea leaves sourced from Assamese gardens.',
    stock: 75,
  },
  {
    name: 'Spices',
    category: 'grocery',
    price: 50,
    image: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSxPeU8iXXfenjFQL1lGJASycB4yY9krAw8d6gHCmR34QeSojD2e5jSlPYGl1mcn9J9Qgqk8iV8EooaefL0kRPO9Z_eIdHP5HOQA-VMT5zy&usqp=CAE',
    description: 'A blend of pure aromatic spices to make your curries delicious.',
    stock: 60,
  },
  {
    name: 'Rice',
    category: 'grocery',
    price: 60,
    image: 'https://www.jiomart.com/images/product/original/491187309/good-life-whole-moong-500-g-product-images-o491187309-p491187309-0-202305292329.jpg',
    description: 'Premium basmati long grain rice, aged to perfection.',
    stock: 40,
  },
  {
    name: 'Wheat Flour',
    category: 'grocery',
    price: 55,
    image: 'https://www.jiomart.com/images/product/original/491432711/aashirvaad-whole-wheat-atta-5-kg-product-images-o491432711-p491432711-0-202308311426.jpg',
    description: '100% pure chakki fresh whole wheat flour for soft rotis.',
    stock: 30,
  },
  {
    name: 'Pulses',
    category: 'grocery',
    price: 70,
    image: 'https://www.jiomart.com/images/product/original/491187309/good-life-whole-moong-500-g-product-images-o491187309-p491187309-0-202305292329.jpg',
    description: 'Organic split yellow moong dal, rich in proteins and fiber.',
    stock: 80,
  },
  {
    name: 'Cooking Oil',
    category: 'grocery',
    price: 180,
    image: 'https://m.media-amazon.com/images/I/61VG3EGvisL.jpg',
    description: 'Refined sunflower cooking oil, low absorption and heart healthy.',
    stock: 25,
  },
  {
    name: 'Eraser',
    category: 'stationary',
    price: 5,
    image: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTX5cKj4rrJ-FW6zOA1MF3aZvmLLxpUdMx8Iyr3I7sE7cC84MzYbzxZqbY6QqEm7RYiR84K8t_GmAL6Cc2NrL9cBvEvtJaUPm3N7RqmQMIy&usqp=CAE',
    description: 'Non-dust soft vinyl pencil eraser, cleans cleanly without tearing.',
    stock: 200,
  },
  {
    name: 'Sharpener',
    category: 'stationary',
    price: 10,
    image: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSo0dLv3SWCVDHqyWzDEi3dDUH0UEr8IQqvaCXOCK3gPSJNq0Zr2OMQmxGqnhVHWLx3bVLyDuQm2hCd4eFwH5IW7vgGAhd1B6KD9bQZ_4aUqOdlwbPPH4TnCg&usqp=CAE',
    description: 'Steel blade manual sharpener for standard sized woodcase pencils.',
    stock: 150,
  },
  {
    name: 'Scale',
    category: 'stationary',
    price: 20,
    image: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSEpxZXnCHAH0F1-mA1SePGjP8fLTd-kGrQkExVPG5a9k6rnLhVQqp5j6ry3hqpwLH7V6YdW35ZPWKVvJZCqNmZjXBzQhJuVRLyJHfGbDhi&usqp=CAE',
    description: '15cm transparent plastic ruler, shatterproof and clear markings.',
    stock: 120,
  },
  {
    name: 'Notebook A4',
    category: 'stationary',
    price: 50,
    image: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTiIxFoHEvTydbB-KladglqmYpfAl4bAZSP_JQtpstbrSaNDWpPlWT9Pg0ia_IMRyggDVF4jS5nuH9tk2njzNhcbMHYwJ-3ku2K_itbVy4b1H6o6omQmDz42w&usqp=CAE',
    description: 'A4 size ruled notebook, single line, 120 pages of high-quality paper.',
    stock: 90,
  },
  {
    name: 'Pencil',
    category: 'stationary',
    price: 20,
    image: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcT_AkkH-EoATYuu-HO2p8j-LUx6QYbIbUCmmLEMqMSxrCuyab9hRfuurIyC826uuc90WUC-uM7P-cqc-4YQp_s9SoecjVm5Ssy6R5cAVjBvwcuPyO5-bbADwQ&usqp=CAE',
    description: 'Pack of 10 extra dark graphite pencils, smooth writing flow.',
    stock: 110,
  },
  {
    name: 'Drawing Notebook',
    category: 'stationary',
    price: 30,
    image: 'https://clickere.in/cdn/shop/files/4554_1024x1024@2x.jpg?v=1688544965',
    description: 'Blank white pages sketchbook, 40 leaves, suitable for crayons and pencils.',
    stock: 80,
  },
  {
    name: 'Pen',
    category: 'stationary',
    price: 10,
    image: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTLaRIBcrbNXFkE1c9qxYlmSxH1H3XkesVe9YsR7WCan1f79TsWyGQwgn2uhLo6qEzhIXLwHuYq6uIZ_h57HIZiGhayFc2I5BauG-GSJDmjLg-5NkgzGWhqeg&usqp=CAE',
    description: 'Blue ink smooth flow fine point ballpoint pen, comfort grip.',
    stock: 300,
  },
  {
    name: 'Sketch Pen',
    category: 'stationary',
    price: 15,
    image: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRXghXTyfzocF25XBffkJDwOXsWOCLjLCErMQKzoU0ZFJBOnqbu-Gtv8LbCUKc8ShVhSH7pRrs-QibsvEWh2VGD5cfPoCw--6ZJivhsslbYWHk9ip4Nrwspvg&usqp=CAE',
    description: 'Pack of 12 vibrant color sketch pens, washable ink.',
    stock: 140,
  },
  {
    name: 'Highlighter',
    category: 'stationary',
    price: 15,
    image: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRqLpX9rle3ypbezOy2yfqX9RjrxRL6GVwH9PYMmoz3--pNRJuWBCTOTIgfv8d3fo0YnvQRjH15Vlh-VuQF8aKEjnnrjyuw2UqNDcrkn6j3c0GXO56ZpzBQLA&usqp=CAE',
    description: 'Bright fluorescent yellow chisel tip text marker highlighter.',
    stock: 100,
  },
  {
    name: 'Geometry Box',
    category: 'stationary',
    price: 50,
    image: 'https://www.jiomart.com/images/product/original/492571950/doms-geommy-mathematical-drawing-instrument-box-product-images-o492571950-p590980282-0-202206150707.jpg',
    description: 'Complete mathematical drawing instruments set in secure tin box.',
    stock: 45,
  },
  {
    name: 'Kurkure',
    category: 'snacks',
    price: 20,
    image: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRJC2xYd7TqLJTKINgJVAjJaYJhR3sXcjMG_7ZCZ8HLRLrXIpK_rr4pZpBU1Y0nEH6wStCbV4Ixcp_qGEfN_TS_YKVcw_v1HoE8t1mkkNBDVBvkV9rGM5Kl4w&usqp=CAE',
    description: 'Spicy and crunchy puffed corn curls snack, Indian masala style.',
    stock: 120,
  },
  {
    name: 'Lays',
    category: 'snacks',
    price: 20,
    image: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSzXWJZH4S6iYWKLa3FfE6T_PvfTpGHJZxJfNexLTD8NUyQCCCH3Eh8kKEcqN2LIQ3cVfhHFVA5t6RMjQ3lNc8WbBx0gHN3MRbKLZeMJ_M8&usqp=CAE',
    description: 'Classic salted potato chips, crispy, light, and delicious.',
    stock: 130,
  },
  {
    name: 'Biscuits',
    category: 'snacks',
    price: 25,
    image: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSFPELa5GZVZr_8_qdW4P2YC8wGPQN0T2KCCLwLWZmRPU3SQ8ALhQu1Sm9bXkLSY9N8ONUYNsj3CIjgqH7P5kSJ8o0x4M6mKvKiPe6rHJM&usqp=CAE',
    description: 'Crispy sweet and salty tea biscuits, baked to golden perfection.',
    stock: 90,
  },
  {
    name: 'Chocolate',
    category: 'snacks',
    price: 30,
    image: 'https://m.media-amazon.com/images/I/71vVW9N3ybL.jpg',
    description: 'Rich and creamy milk chocolate bar, melt-in-your-mouth flavor.',
    stock: 150,
  },
  {
    name: 'Namkeen',
    category: 'snacks',
    price: 15,
    image: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRSxFQkqIKk4hRqB6L9z6uqn4L7l0pJ0HZJhLEGOXHBAZ7wNGZQKFdhZi9Ky5Y1lc8GFPEXgE2W3j1kJx3nE5Rt6xUfY2VZhQfFhCXEBZM&usqp=CAE',
    description: 'Savory crispy gram flour noodles and lentils snack mix.',
    stock: 160,
  },
  {
    name: 'Cookies',
    category: 'snacks',
    price: 40,
    image: 'https://m.media-amazon.com/images/I/81ZF7I+NKWL.jpg',
    description: 'Chocolate chip cookies, loaded with real rich chocolate chunks.',
    stock: 80,
  },
  {
    name: 'Chips',
    category: 'snacks',
    price: 20,
    image: 'https://m.media-amazon.com/images/I/81u47UWxjTL.jpg',
    description: 'Crunchy potato chips, spicy chili and cream flavor.',
    stock: 140,
  },
  {
    name: 'Wafers',
    category: 'snacks',
    price: 35,
    image: 'https://m.media-amazon.com/images/I/71nUFhSvkqL.jpg',
    description: 'Crispy layered wafer fingers with chocolate cream filling.',
    stock: 70,
  },
];

const seedProducts = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bigmarket';
    console.log(`Connecting to database for seeding: ${mongoURI}`);
    await mongoose.connect(mongoURI);
    console.log('Connected! Clearing Categories, Products, and Coupons collections...');

    await Category.deleteMany();
    await Product.deleteMany();
    await Coupon.deleteMany();

    console.log('Seeding categories...');
    await Category.insertMany(categoriesData);
    console.log('Categories seeded.');

    console.log('Seeding products...');
    await Product.insertMany(productsData);
    console.log('Products seeded.');

    console.log('Seeding coupons...');
    await Coupon.create([
      {
        code: 'FRESH50',
        discountType: 'fixed',
        discountValue: 50,
        minPurchase: 200,
        expiryDate: new Date('2030-01-01'),
        isActive: true,
      },
      {
        code: 'SUPER20',
        discountType: 'percentage',
        discountValue: 20,
        minPurchase: 500,
        expiryDate: new Date('2030-01-01'),
        isActive: true,
      },
    ]);
    console.log('Coupons seeded.');

    console.log('Seeding completed successfully (without affecting existing users)!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedProducts();
