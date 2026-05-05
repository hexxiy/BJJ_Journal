import { useState } from 'react'
import './Meals.css'

const MEAL_WINDOWS = ['Breakfast', 'Morning Snack', 'Lunch', 'Afternoon Snack', 'Dinner', 'Evening Snack']

const COMMON_FOODS = [
  { name: 'Banana', calories: 105, protein: 1.3, carbs: 27, fat: 0.4, serving: '1 medium' },
  { name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6, serving: '100g' },
  { name: 'White Rice', calories: 205, protein: 4.3, carbs: 45, fat: 0.4, serving: '1 cup cooked' },
  { name: 'Broccoli', calories: 55, protein: 3.7, carbs: 11, fat: 0.6, serving: '1 cup' },
  { name: 'Eggs', calories: 155, protein: 13, carbs: 1.1, fat: 11, serving: '2 large' },
  { name: 'Oatmeal', calories: 150, protein: 5, carbs: 27, fat: 2.5, serving: '1 cup cooked' },
  { name: 'Salmon', calories: 208, protein: 20, carbs: 0, fat: 13, serving: '100g' },
  { name: 'Sweet Potato', calories: 112, protein: 2, carbs: 26, fat: 0.1, serving: '1 medium' },
  { name: 'Greek Yogurt', calories: 100, protein: 17, carbs: 6, fat: 0.7, serving: '1 cup' },
  { name: 'Almonds', calories: 160, protein: 6, carbs: 6, fat: 14, serving: '1 oz' },
]

function Meals({ data, onSave, goals }) {
  const [selectedWindow, setSelectedWindow] = useState('Lunch')
  const [mealItems, setMealItems] = useState([])
  const [customFood, setCustomFood] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '' })
  const [showCustom, setShowCustom] = useState(false)

  const today = new Date().toISOString().split('T')[0]
  const todayMeals = data.filter(m => m.date === today)

  const addCommonFood = (food) => {
    setMealItems([...mealItems, { ...food, id: Date.now() }])
  }

  const addCustomFood = () => {
    if (!customFood.name || !customFood.calories) return
    setMealItems([...mealItems, {
      ...customFood,
      calories: Number(customFood.calories),
      protein: Number(customFood.protein) || 0,
      carbs: Number(customFood.carbs) || 0,
      fat: Number(customFood.fat) || 0,
      id: Date.now()
    }])
    setCustomFood({ name: '', calories: '', protein: '', carbs: '', fat: '' })
    setShowCustom(false)
  }

  const removeItem = (id) => {
    setMealItems(mealItems.filter(item => item.id !== id))
  }

  const saveMeal = () => {
    if (mealItems.length === 0) return
    const totalCals = mealItems.reduce((sum, i) => sum + i.calories, 0)
    const newMeal = {
      id: Date.now(),
      date: today,
      window: selectedWindow,
      name: selectedWindow,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      items: mealItems,
      totalCalories: totalCals
    }
    onSave([...data, newMeal])
    setMealItems([])
  }

  const deleteMeal = (id) => {
    onSave(data.filter(m => m.id !== id))
  }

  return (
    <div className="meals">
      <h2>Meal Tracking</h2>

      <div className="meal-windows">
        {MEAL_WINDOWS.map(window => (
          <button
            key={window}
            className={selectedWindow === window ? 'active' : ''}
            onClick={() => setSelectedWindow(window)}
          >
            {window}
          </button>
        ))}
      </div>

      <div className="add-food">
        <h3>Add Food to {selectedWindow}</h3>

        <div className="common-foods">
          {COMMON_FOODS.map(food => (
            <div key={food.name} className="food-item" onClick={() => addCommonFood(food)}>
              <div className="food-info">
                <strong>{food.name}</strong>
                <span className="serving">{food.serving}</span>
              </div>
              <div className="food-macros">
                <span>{food.calories} cal</span>
                <span>{food.protein}g protein</span>
              </div>
            </div>
          ))}
        </div>

        <button className="toggle-custom" onClick={() => setShowCustom(!showCustom)}>
          + Add Custom Food
        </button>

        {showCustom && (
          <div className="custom-food-form">
            <input type="text" placeholder="Food name" value={customFood.name} onChange={e => setCustomFood({...customFood, name: e.target.value})} />
            <input type="number" placeholder="Calories" value={customFood.calories} onChange={e => setCustomFood({...customFood, calories: e.target.value})} />
            <input type="number" placeholder="Protein (g)" value={customFood.protein} onChange={e => setCustomFood({...customFood, protein: e.target.value})} />
            <input type="number" placeholder="Carbs (g)" value={customFood.carbs} onChange={e => setCustomFood({...customFood, carbs: e.target.value})} />
            <input type="number" placeholder="Fat (g)" value={customFood.fat} onChange={e => setCustomFood({...customFood, fat: e.target.value})} />
            <button onClick={addCustomFood}>Add</button>
          </div>
        )}
      </div>

      {mealItems.length > 0 && (
        <div className="current-meal">
          <h3>Current {selectedWindow} Items</h3>
          {mealItems.map(item => (
            <div key={item.id} className="meal-item">
              <span>{item.name} - {item.calories} cal</span>
              <button onClick={() => removeItem(item.id)}>×</button>
            </div>
          ))}
          <div className="meal-total">
            Total: {mealItems.reduce((sum, i) => sum + i.calories, 0)} calories
          </div>
          <button className="save-meal" onClick={saveMeal}>Save {selectedWindow}</button>
        </div>
      )}

      <div className="today-meals">
        <h3>Today's Meals</h3>
        {todayMeals.length === 0 ? <p className="empty">No meals logged today</p> : todayMeals.map(meal => (
          <div key={meal.id} className="saved-meal">
            <div className="meal-header">
              <h4>{meal.window} <span className="meal-time">{meal.time}</span></h4>
              <button className="delete-btn" onClick={() => deleteMeal(meal.id)}>×</button>
            </div>
            <p>{meal.items?.length || 0} items • {meal.totalCalories || meal.items?.reduce((s, i) => s + i.calories, 0)} cal</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Meals
