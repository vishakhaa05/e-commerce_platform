import { Product } from '../models/Product.js';
export const getProducts = async (req, res, next) => {
    try {
        const { category, search, sort } = req.query;
        const query = {};
        if (category && category !== 'all') {
            query.category = String(category).toLowerCase();
        }
        if (search) {
            query.name = { $regex: String(search), $options: 'i' };
        }
        let productsQuery = Product.find(query);
        if (sort) {
            if (sort === 'price_asc') {
                productsQuery = productsQuery.sort({ price: 1 });
            }
            else if (sort === 'price_desc') {
                productsQuery = productsQuery.sort({ price: -1 });
            }
            else if (sort === 'rating') {
                productsQuery = productsQuery.sort({ rating: -1 });
            }
            else {
                productsQuery = productsQuery.sort({ createdAt: -1 });
            }
        }
        else {
            productsQuery = productsQuery.sort({ createdAt: -1 });
        }
        const products = await productsQuery;
        res.status(200).json({
            success: true,
            count: products.length,
            products,
        });
    }
    catch (error) {
        next(error);
    }
};
export const getProductById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) {
            res.status(404).json({ success: false, message: 'Product not found.' });
            return;
        }
        res.status(200).json({
            success: true,
            product,
        });
    }
    catch (error) {
        next(error);
    }
};
export const createProduct = async (req, res, next) => {
    try {
        const { name, description, price, category, image, stock } = req.body;
        const product = await Product.create({
            name,
            description,
            price,
            category: category.toLowerCase(),
            image,
            stock,
            rating: 5,
            reviewsCount: 0,
        });
        res.status(201).json({
            success: true,
            message: 'Product created successfully.',
            product,
        });
    }
    catch (error) {
        next(error);
    }
};
export const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, description, price, category, image, stock } = req.body;
        const product = await Product.findById(id);
        if (!product) {
            res.status(404).json({ success: false, message: 'Product not found.' });
            return;
        }
        if (name !== undefined)
            product.name = name;
        if (description !== undefined)
            product.description = description;
        if (price !== undefined)
            product.price = price;
        if (category !== undefined)
            product.category = category.toLowerCase();
        if (image !== undefined)
            product.image = image;
        if (stock !== undefined)
            product.stock = stock;
        await product.save();
        res.status(200).json({
            success: true,
            message: 'Product updated successfully.',
            product,
        });
    }
    catch (error) {
        next(error);
    }
};
export const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            res.status(404).json({ success: false, message: 'Product not found.' });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Product deleted successfully.',
        });
    }
    catch (error) {
        next(error);
    }
};
