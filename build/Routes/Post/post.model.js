"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    tags: {
        type: [String]
    },
    createdDate: {
        type: Date,
        default: Date.now()
    },
    like: {
        type: Number,
        default: 0
    },
    dislike: {
        type: Number,
        default: 0
    },
    count: {
        type: Number,
        default: 0
    }
});
const post = model('Post', postSchema);
exports.default = post;
