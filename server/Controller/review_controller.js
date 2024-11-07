const { getResults } = require('./gplay_review_controller');
const dotenv = require('dotenv');

dotenv.config();

let cachedReviews = [];

const fetchReviewsOnce = async () => {
    if (!cachedReviews.length) {
        cachedReviews = await getResults(process.env.PRODUCT_ID);
    }
    return cachedReviews;
};

const labelReviewsForDate = async (targetDate) => {
    const { default: fetch } = await import('node-fetch');
    const labeledReviews = [];
    
    const reviews = await fetchReviewsOnce();
    
    const reviewsForDate = reviews.filter(review => {
        const reviewDate = new Date(review.iso_date);
        return (
            reviewDate.getFullYear() === targetDate.getFullYear() &&
            reviewDate.getMonth() === targetDate.getMonth() &&
            reviewDate.getDate() === targetDate.getDate()
        );
    });

    for (const review of reviewsForDate) {
        const labelResponse = await fetch(process.env.SERVICE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: review.snippet,
                candidate_labels: ["other", "complaints", "crashes", "bugs", "praises"]
            })
        });

        const labelData = await labelResponse.json();
        const topLabel = labelData.labels[0];
        // console.log(`Review: ${review.snippet} - Label: ${topLabel}`);
        labeledReviews.push({ ...review, label: topLabel });
    }

    return labeledReviews;
};

module.exports = { labelReviewsForDate };
