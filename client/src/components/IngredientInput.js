import React, { useState } from 'react';

const IngredientInput = () => {
    const [ingredients, setIngredients] = useState(['']);
    const [dietaryRestrictions, setDietaryRestrictions] = useState('');

    const handleIngredientChange = (index, value) => {
        const newIngredients = [...ingredients];
        newIngredients[index] = value;
        setIngredients(newIngredients);
    };

    const handleAddIngredient = () => {
        setIngredients([...ingredients, '']);
    };

    const handleRemoveIngredient = (index) => {
        const newIngredients = ingredients.filter((_, i) => i !== index);
        setIngredients(newIngredients);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/ingredients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ingredients, dietaryRestrictions }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Success:', data);
            // Reset the form after successful submission
            setIngredients(['']);
            setDietaryRestrictions('');
        } catch (error) {
            console.error('Error submitting ingredients:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Input Ingredients</h2>
            {ingredients.map((ingredient, index) => (
                <div key={index}>
                    <input
                        type="text"
                        value={ingredient}
                        onChange={(e) => handleIngredientChange(index, e.target.value)}
                        placeholder="Enter ingredient"
                        required
                    />
                    <button type="button" onClick={() => handleRemoveIngredient(index)}>Remove</button>
                </div>
            ))}
            <button type="button" onClick={handleAddIngredient}>Add Ingredient</button>
            <div>
                <label>
                    Dietary Restrictions:
                    <input
                        type="text"
                        value={dietaryRestrictions}
                        onChange={(e) => setDietaryRestrictions(e.target.value)}
                        placeholder="Enter dietary restrictions"
                    />
                </label>
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default IngredientInput;