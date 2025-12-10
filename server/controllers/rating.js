const Rating = require('../models/Rating');
const Recipe = require('../models/Recipe');

exports.rateRecipe = async (req, res) => {
    const { recipeId, userId, rating, review } = req.body;

    if (!recipeId || !userId || rating === undefined) {
        return res.status(400).json({ message: 'Recipe ID, User ID, and rating are required.' });
    }

    try {
        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found.' });
        }

        const existingRating = await Rating.findOne({ recipeId, userId });
        if (existingRating) {
            existingRating.rating = rating;
            existingRating.review = review;
            await existingRating.save();
            return res.status(200).json({ message: 'Rating updated successfully.' });
        }

        const newRating = new Rating({
            recipeId,
            userId,
            rating,
            review
        });

        await newRating.save();
        return res.status(201).json({ message: 'Rating added successfully.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error.' });
    }
};

exports.getRecipeRatings = async (req, res) => {
    const { recipeId } = req.params;

    if (!recipeId) {
        return res.status(400).json({ message: 'Recipe ID is required.' });
    }

    try {
        const ratings = await Rating.find({ recipeId }).populate('userId', 'username');
        return res.status(200).json(ratings);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error.' });
    }
};