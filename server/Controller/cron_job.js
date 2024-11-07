const cron = require('node-cron');
const { labelReviewsForDate } = require('./review_controller');
let Reviews = [];

const loadInitialReviews = async () => {
    const today = new Date();
    try {
        for (let i = 6; i > 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const labeledReviews = await labelReviewsForDate(date);
            const sortedReviews = labeledReviews.sort((a, b) => new Date(b.iso_date) - new Date(a.iso_date));
            Reviews.push(...sortedReviews);
        }
    } catch (err) {
        console.error("Error loading initial reviews:", err);
    }
};

const updateDailyReviews = async () => {
    const today = new Date();
    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(today.getDate() - 3);
    try {
        const labeledReviews = await labelReviewsForDate(threeDaysAgo);
        const sortedReviews = labeledReviews.sort((a, b) => new Date(b.iso_date) - new Date(a.iso_date));
        Reviews.push(...sortedReviews);
    } catch (err) {
        console.error("Error updating daily reviews:", err);
    }
};

cron.schedule('0 0 * * *', updateDailyReviews);

loadInitialReviews();

module.exports = { updateDailyReviews, Reviews };
