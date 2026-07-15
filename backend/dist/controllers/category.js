import { Category } from '../models/Category.js';
const slugify = (text) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-'); // Replace multiple - with single -
};
export const getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        res.status(200).json({
            success: true,
            categories,
        });
    }
    catch (error) {
        next(error);
    }
};
export const createCategory = async (req, res, next) => {
    try {
        const { name, description } = req.body;
        const slug = slugify(name);
        const existing = await Category.findOne({ slug });
        if (existing) {
            res.status(400).json({ success: false, message: 'Category with similar name already exists.' });
            return;
        }
        const category = await Category.create({
            name,
            slug,
            description,
        });
        res.status(201).json({
            success: true,
            message: 'Category created successfully.',
            category,
        });
    }
    catch (error) {
        next(error);
    }
};
export const updateCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        const category = await Category.findById(id);
        if (!category) {
            res.status(404).json({ success: false, message: 'Category not found.' });
            return;
        }
        if (name !== undefined) {
            category.name = name;
            category.slug = slugify(name);
        }
        if (description !== undefined) {
            category.description = description;
        }
        await category.save();
        res.status(200).json({
            success: true,
            message: 'Category updated successfully.',
            category,
        });
    }
    catch (error) {
        next(error);
    }
};
export const deleteCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const category = await Category.findByIdAndDelete(id);
        if (!category) {
            res.status(404).json({ success: false, message: 'Category not found.' });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Category deleted successfully.',
        });
    }
    catch (error) {
        next(error);
    }
};
