const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const { updateDailyReviews, Reviews } = require('./Controller/cron_job');

dotenv.config();

const app = express();
app.use(cors({ origin: '*' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = 8000;

updateDailyReviews().catch(err => console.error("Initial data load failed:", err));

app.get('/dailyreviews', (req, res) => {
    const { date, category } = req.query;
    if (!date) {
        return res.status(400).send("Date is required");
    }

    const queryDate = new Date(date);

    const filteredReviews = (Array.isArray(Reviews) ? Reviews : []).filter(review => {
        const reviewDate = new Date(review.iso_date);

        const isDateMatch = (
            reviewDate.getFullYear() === queryDate.getFullYear() &&
            reviewDate.getMonth() === queryDate.getMonth() &&
            reviewDate.getDate() === queryDate.getDate()
        );

        const isCategoryMatch = category ? review.label === category : true;

        return isDateMatch && isCategoryMatch;
    });

    res.send(filteredReviews);
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
