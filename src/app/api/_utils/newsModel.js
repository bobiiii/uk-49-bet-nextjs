import mongoose from "mongoose";

const NewsSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true, // Ensure slug is unique
    },
    excerpt: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['Published', 'Draft'],
        default: 'Published',
    },
    featured: {
        type: Boolean,
        required: true,
    },
},
    {
        timestamps: true,
    }
);

export const NewsModel =
    mongoose.models.News || mongoose.model("News", NewsSchema);
