const SerpApi = require("google-search-results-nodejs");
const dotenv=require('dotenv');
dotenv.config();
const search = new SerpApi.GoogleSearch(process.env.api_key);

const reviewsLimit = 100;

const getJson = (params) => {
    return new Promise((resolve) => {
        search.json(params, resolve);
    });
};

const getResults = async (product_id) => {
    let params = {
        engine: "google_play_product",
        gl: "us",
        hl: "en",
        store: "apps",
        product_id: product_id,
        all_reviews: "true",
    };
    
    const allReviews = [];
    while (true) {
        const json = await getJson(params);
        if (json.reviews) {
            allReviews.push(...json.reviews);
        } else break;
        
        if (json.serpapi_pagination?.next_page_token) {
            params.next_page_token = json.serpapi_pagination.next_page_token;
        } else break;
        
        if (allReviews.length >= reviewsLimit) break;
    }
    
    return allReviews.slice(0, reviewsLimit); 
};

getResults("your_product_id_here").then((result) => console.dir(result, { depth: null }));

module.exports = {getResults};
