import React, { useState } from 'react';
import axios from 'axios';

const RecipeShare = () => {
    const [recipe, setRecipe] = useState('');
    const [sharedLink, setSharedLink] = useState('');
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        setRecipe(e.target.value);
    };

    const handleShareRecipe = async () => {
        if (!recipe) {
            setError('Recipe cannot be empty');
            return;
        }
        setError('');
        try {
            const response = await axios.post('/api/recipes/share', { recipe });
            setSharedLink(`${window.location.origin}/recipes/${response.data.id}`);
        } catch (err) {
            setError('Error sharing recipe. Please try again.');
        }
    };

    return (
        <div>
            <h2>Share Your Favorite Recipe</h2>
            <textarea
                value={recipe}
                onChange={handleInputChange}
                placeholder="Enter your recipe here"
                rows="5"
                cols="30"
            />
            <button onClick={handleShareRecipe}>Share Recipe</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {sharedLink && (
                <div>
                    <p>Your recipe has been shared! Here is your link:</p>
                    <a href={sharedLink} target="_blank" rel="noopener noreferrer">{sharedLink}</a>
                </div>
            )}
        </div>
    );
};

export default RecipeShare;