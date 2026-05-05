import './Dashboard.css'

function Dashboard({ totalCals, totalBurned, totalProtein, totalCarbs, totalFat, goals, meals, exercises }) {
  const netCals = totalCals - totalBurned
  const remaining = goals.calories - netCals

  const calcPercent = (current, goal) => Math.min(100, (current / goal) * 100)

  return (
    <div className="dashboard">
      <h2>Today's Dashboard</h2>

      <div className="calorie-card">
        <div className="calorie-header">
          <h3>Calories</h3>
          <span className="calorie-number">{remaining > 0 ? remaining : 0} remaining</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill calories"
            style={{ width: `${calcPercent(netCals, goals.calories)}%` }}
          />
        </div>
        <div className="calorie-details">
          <span>{netCals} consumed</span>
          <span>{totalBurned} burned</span>
          <span>{goals.calories} goal</span>
        </div>
      </div>

      <div className="macro-grid">
        <div className="macro-card protein">
          <h4>Protein</h4>
          <div className="macro-value">{totalProtein}g</div>
          <div className="macro-goal">/ {goals.protein}g</div>
          <div className="progress-bar small">
            <div
              className="progress-fill protein"
              style={{ width: `${calcPercent(totalProtein, goals.protein)}%` }}
            />
          </div>
        </div>

        <div className="macro-card carbs">
          <h4>Carbs</h4>
          <div className="macro-value">{totalCarbs}g</div>
          <div className="macro-goal">/ {goals.carbs}g</div>
          <div className="progress-bar small">
            <div
              className="progress-fill carbs"
              style={{ width: `${calcPercent(totalCarbs, goals.carbs)}%` }}
            />
          </div>
        </div>

        <div className="macro-card fat">
          <h4>Fat</h4>
          <div className="macro-value">{totalFat}g</div>
          <div className="macro-goal">/ {goals.fat}g</div>
          <div className="progress-bar small">
            <div
              className="progress-fill fat"
              style={{ width: `${calcPercent(totalFat, goals.fat)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="today-section">
        <h3>Today's Meals ({meals.length})</h3>
        {meals.length === 0 ? <p className="empty">No meals logged today</p> : (
          <div className="meal-list">
            {meals.map(meal => (
              <div key={meal.id} className="meal-item">
                <h4>{meal.name} <span className="meal-time">{meal.time}</span></h4>
                <p>{meal.items?.length || 0} items • {meal.items?.reduce((s, i) => s + i.calories, 0) || 0} cal</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="today-section">
        <h3>Today's Exercises ({exercises.length})</h3>
        {exercises.length === 0 ? <p className="empty">No exercises logged today</p> : (
          <div className="meal-list">
            {exercises.map(ex => (
              <div key={ex.id} className="meal-item">
                <h4>{ex.name}</h4>
                <p>{ex.duration} min • {ex.caloriesBurned} cal burned</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
