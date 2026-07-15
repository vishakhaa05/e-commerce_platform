import { Product } from '@/types';

export const products: Product[] = [
  // Grocery Items
  {
    id: 1,
    name: 'Sugar',
    category: 'grocery',
    price: 40,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcTybVNJcKkMFYGBfX2f3xv9VkfUkRq4fkOw&s',
    rating: 4.5
  },
  {
    id: 2,
    name: 'Salt',
    category: 'grocery',
    price: 40,
    image: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcR-8vc4XI3RSrubEQTRCIyH1AD4j09sc3Lga__6rQFM6-iv1B8gsl-5LsNP0B6VxsM2_PLiKRk3hBhyTzmKpvGOLbkL6lmevonKi9SbvtQmRlQOALdUy3J2&usqp=CAE',
    rating: 4.5
  },
  {
    id: 3,
    name: 'Tea',
    category: 'grocery',
    price: 45,
    image: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTNRryatFuVKXpzv7FRO1ZIZC7XBGbjw09IB6OHWY-q7NsYnA_-zWJLQKCBThutMOz-v6gc4PeO8VtezGC4QofWPgX781BMiJVd2J7CVu7Eo9aE19mvYjbZ1w&usqp=CAE',
    rating: 4.5
  },
  {
    id: 4,
    name: 'Spices',
    category: 'grocery',
    price: 50,
    image: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSxPeU8iXXfenjFQL1lGJASycB4yY9krAw8d6gHCmR34QeSojD2e5jSlPYGl1mcn9J9Qgqk8iV8EooaefL0kRPO9Z_eIdHP5HOQA-VMT5zy&usqp=CAE',
    rating: 4.5
  },
  {
    id: 5,
    name: 'Rice',
    category: 'grocery',
    price: 60,
    image: 'https://www.jiomart.com/images/product/original/491187309/good-life-whole-moong-500-g-product-images-o491187309-p491187309-0-202305292329.jpg',
    rating: 4.5
  },
  {
    id: 6,
    name: 'Wheat Flour',
    category: 'grocery',
    price: 55,
    image: 'https://www.jiomart.com/images/product/original/491432711/aashirvaad-whole-wheat-atta-5-kg-product-images-o491432711-p491432711-0-202308311426.jpg',
    rating: 4.5
  },
  {
    id: 7,
    name: 'Pulses',
    category: 'grocery',
    price: 70,
    image: 'https://www.jiomart.com/images/product/original/491187309/good-life-whole-moong-500-g-product-images-o491187309-p491187309-0-202305292329.jpg',
    rating: 4.5
  },
  {
    id: 8,
    name: 'Cooking Oil',
    category: 'grocery',
    price: 180,
    image: 'https://m.media-amazon.com/images/I/61VG3EGvisL.jpg',
    rating: 4.5
  },

  // Stationary Items
  {
    id: 9,
    name: 'Eraser',
    category: 'stationary',
    price: 5,
    image: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTX5cKj4rrJ-FW6zOA1MF3aZvmLLxpUdMx8Iyr3I7sE7cC84MzYbzxZqbY6QqEm7RYiR84K8t_GmAL6Cc2NrL9cBvEvtJaUPm3N7RqmQMIy&usqp=CAE',
    rating: 4.5
  },
  {
    id: 10,
    name: 'Sharpener',
    category: 'stationary',
    price: 10,
    image: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSo0dLv3SWCVDHqyWzDEi3dDUH0UEr8IQqvaCXOCK3gPSJNq0Zr2OMQmxGqnhVHWLx3bVLyDuQm2hCd4eFwH5IW7vgGAhd1B6KD9bQZ_4aUqOdlwbPPH4TnCg&usqp=CAE',
    rating: 4.5
  },
  {
    id: 11,
    name: 'Scale',
    category: 'stationary',
    price: 20,
    image: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSEpxZXnCHAH0F1-mA1SePGjP8fLTd-kGrQkExVPG5a9k6rnLhVQqp5j6ry3hqpwLH7V6YdW35ZPWKVvJZCqNmZjXBzQhJuVRLyJHfGbDhi&usqp=CAE',
    rating: 4.5
  },
  {
    id: 12,
    name: 'Notebook A4',
    category: 'stationary',
    price: 50,
    image: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTiIxFoHEvTydbB-KladglqmYpfAl4bAZSP_JQtpstbrSaNDWpPlWT9Pg0ia_IMRyggDVF4jS5nuH9tk2njzNhcbMHYwJ-3ku2K_itbVy4b1H6o6omQmDz42w&usqp=CAE',
    rating: 4.5
  },
  {
    id: 13,
    name: 'Pencil',
    category: 'stationary',
    price: 20,
    image: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcT_AkkH-EoATYuu-HO2p8j-LUx6QYbIbUCmmLEMqMSxrCuyab9hRfuurIyC826uuc90WUC-uM7P-cqc-4YQp_s9SoecjVm5Ssy6R5cAVjBvwcuPyO5-bbADwQ&usqp=CAE',
    rating: 4.5
  },
  {
    id: 14,
    name: 'Drawing Notebook',
    category: 'stationary',
    price: 30,
    image: 'https://clickere.in/cdn/shop/files/4554_1024x1024@2x.jpg?v=1688544965',
    rating: 4.5
  },
  {
    id: 15,
    name: 'Pen',
    category: 'stationary',
    price: 10,
    image: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTLaRIBcrbNXFkE1c9qxYlmSxH1H3XkesVe9YsR7WCan1f79TsWyGQwgn2uhLo6qEzhIXLwHuYq6uIZ_h57HIZiGhayFc2I5BauG-GSJDmjLg-5NkgzGWhqeg&usqp=CAE',
    rating: 4.5
  },
  {
    id: 16,
    name: 'Sketch Pen',
    category: 'stationary',
    price: 15,
    image: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRXghXTyfzocF25XBffkJDwOXsWOCLjLCErMQKzoU0ZFJBOnqbu-Gtv8LbCUKc8ShVhSH7pRrs-QibsvEWh2VGD5cfPoCw--6ZJivhsslbYWHk9ip4Nrwspvg&usqp=CAE',
    rating: 4.5
  },
  {
    id: 17,
    name: 'Highlighter',
    category: 'stationary',
    price: 15,
    image: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRqLpX9rle3ypbezOy2yfqX9RjrxRL6GVwH9PYMmoz3--pNRJuWBCTOTIgfv8d3fo0YnvQRjH15Vlh-VuQF8aKEjnnrjyuw2UqNDcrkn6j3c0GXO56ZpzBQLA&usqp=CAE',
    rating: 4.5
  },
  {
    id: 18,
    name: 'Geometry Box',
    category: 'stationary',
    price: 50,
    image: 'https://www.jiomart.com/images/product/original/492571950/doms-geommy-mathematical-drawing-instrument-box-product-images-o492571950-p590980282-0-202206150707.jpg',
    rating: 4.5
  },

  // Snacks Items
  {
    id: 19,
    name: 'Kurkure',
    category: 'snacks',
    price: 20,
    image: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRJC2xYd7TqLJTKINgJVAjJaYJhR3sXcjMG_7ZCZ8HLRLrXIpK_rr4pZpBU1Y0nEH6wStCbV4Ixcp_qGEfN_TS_YKVcw_v1HoE8t1mkkNBDVBvkV9rGM5Kl4w&usqp=CAE',
    rating: 4.5
  },
  {
    id: 20,
    name: 'Lays',
    category: 'snacks',
    price: 20,
    image: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSzXWJZH4S6iYWKLa3FfE6T_PvfTpGHJZxJfNexLTD8NUyQCCCH3Eh8kKEcqN2LIQ3cVfhHFVA5t6RMjQ3lNc8WbBx0gHN3MRbKLZeMJ_M8&usqp=CAE',
    rating: 4.5
  },
  {
    id: 21,
    name: 'Biscuits',
    category: 'snacks',
    price: 25,
    image: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSFPELa5GZVZr_8_qdW4P2YC8wGPQN0T2KCCLwLWZmRPU3SQ8ALhQu1Sm9bXkLSY9N8ONUYNsj3CIjgqH7P5kSJ8o0x4M6mKvKiPe6rHJM&usqp=CAE',
    rating: 4.5
  },
  {
    id: 22,
    name: 'Chocolate',
    category: 'snacks',
    price: 30,
    image: 'https://m.media-amazon.com/images/I/71vVW9N3ybL.jpg',
    rating: 4.5
  },
  {
    id: 23,
    name: 'Namkeen',
    category: 'snacks',
    price: 15,
    image: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRSxFQkqIKk4hRqB6L9z6uqn4L7l0pJ0HZJhLEGOXHBAZ7wNGZQKFdhZi9Ky5Y1lc8GFPEXgE2W3j1kJx3nE5Rt6xUfY2VZhQfFhCXEBZM&usqp=CAE',
    rating: 4.5
  },
  {
    id: 24,
    name: 'Cookies',
    category: 'snacks',
    price: 40,
    image: 'https://m.media-amazon.com/images/I/81ZF7I+NKWL.jpg',
    rating: 4.5
  },
  {
    id: 25,
    name: 'Chips',
    category: 'snacks',
    price: 20,
    image: 'https://m.media-amazon.com/images/I/81u47UWxjTL.jpg',
    rating: 4.5
  },
  {
    id: 26,
    name: 'Wafers',
    category: 'snacks',
    price: 35,
    image: 'https://m.media-amazon.com/images/I/71nUFhSvkqL.jpg',
    rating: 4.5
  }
];
