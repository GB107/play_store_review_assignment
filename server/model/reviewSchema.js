const mongoose = require('mongoose');   

const reviewSchema={
    company: String,
    review:[

        {
        id : String,
        title: String,
        avatar: String,
        rating: Number,
        snippet: String,
        likes: Number,
        date: Date,
        response: String
    }
    ]
};
module.exports={reviewSchema};