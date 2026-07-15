import { z } from 'zod';

export const signupSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  }),
});

export const addressSchema = z.object({
  body: z.object({
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z.string().min(1, 'Zip Code is required'),
    country: z.string().default('India'),
    isDefault: z.boolean().default(false),
  }),
});

export const productSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name is required'),
    description: z.string().min(5, 'Description is required'),
    price: z.number().min(0, 'Price must be non-negative'),
    category: z.string().min(2, 'Category is required'),
    image: z.string().url('Invalid image URL'),
    stock: z.number().int().min(0, 'Stock must be non-negative'),
  }),
});

export const categorySchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name is required'),
    description: z.string().optional(),
  }),
});

export const couponSchema = z.object({
  body: z.object({
    code: z.string().min(2, 'Coupon code is required').toUpperCase(),
    discountType: z.enum(['percentage', 'fixed']),
    discountValue: z.number().min(0, 'Discount value must be non-negative'),
    minPurchase: z.number().min(0, 'Minimum purchase must be non-negative').default(0),
    expiryDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid date format',
    }),
    isActive: z.boolean().default(true),
  }),
});

export const reviewSchema = z.object({
  body: z.object({
    rating: z.number().min(1).max(5, 'Rating must be between 1 and 5'),
    comment: z.string().min(3, 'Comment must be at least 3 characters'),
  }),
});

export const checkoutSchema = z.object({
  body: z.object({
    shippingAddress: z.object({
      street: z.string().min(1, 'Street is required'),
      city: z.string().min(1, 'City is required'),
      state: z.string().min(1, 'State is required'),
      zipCode: z.string().min(1, 'Zip Code is required'),
      country: z.string().default('India'),
    }),
    paymentMethod: z.enum(['razorpay', 'cod']),
    couponCode: z.string().optional(),
  }),
});
