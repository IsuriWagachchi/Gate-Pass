import Category from '../models/categoryModel.js';

// Create a single category
const createCategory = async (req, res) => {
    try {
        const category = new Category({
            category_id: req.body.category_id || undefined,
            category_name: req.body.category_name,
            category_description: req.body.category_description || '',
            prefix_code: req.body.prefix_code?.toUpperCase() || ''
        });

        await category.save();
        res.status(201).json({
            success: true,
            data: category
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: messages
            });
        } else if (error.code === 11000) {
            const field = error.message.includes('category_id') ? 'Category ID' : 'Category name';
            return res.status(400).json({
                success: false,
                message: `${field} must be unique`
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// Get all categories
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ category_name: 1 });
        res.status(200).json({
            success: true,
            count: categories.length,
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get a single category by ID or category_id
const getCategory = async (req, res) => {
    try {
        const category = await Category.findOne({
            $or: [
                { _id: req.params.id },
                { category_id: req.params.id }
            ]
        });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }
        res.status(200).json({
            success: true,
            data: category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update category
const updateCategory = async (req, res) => {
    try {
        const category = await Category.findOneAndUpdate(
            {
                $or: [
                    { _id: req.params.id },
                    { category_id: req.params.id }
                ]
            },
            {
                ...req.body,
                ...(req.body.prefix_code && {
                    prefix_code: req.body.prefix_code.toUpperCase()
                })
            },
            { new: true, runValidators: true }
        );

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }
        res.status(200).json({
            success: true,
            data: category
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: messages
            });
        } else if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Category name must be unique'
            });
        }
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete category
const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findOneAndDelete({
            $or: [
                { _id: req.params.id },
                { category_id: req.params.id }
            ]
        });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }
        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory
};