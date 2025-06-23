import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    category_id: {
        type: String,
        unique: true,
        trim: true,
        sparse: true,
        validate: {
            validator: function(v) {
                return /^[a-zA-Z0-9_-]+$/.test(v);
            },
            message: props => `${props.value} is not a valid category ID! Only letters, numbers, hyphens and underscores are allowed.`
        }
    },
    category_name: {
        type: String,
        required: [true, 'Category name is required'],
        trim: true,
        unique: true
    },
    category_description: {
        type: String,
        trim: true,
        default: ""
    },
    prefix_code: {
        type: String,
        trim: true,
        uppercase: true,
        default: ""
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

// Update timestamp before saving
categorySchema.pre('save', function(next) {
    this.updated_at = Date.now();
    next();
});

const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);

export default Category;