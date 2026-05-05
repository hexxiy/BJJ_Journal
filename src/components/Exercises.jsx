import { useState } from 'react'
import './Exercises.css'

const EXERCISE_DB = [
  { name: 'Running', caloriesPerMin: 11.4, type: 'cardio' },
  { name: 'Walking', caloriesPerMin: 5.3, type: 'cardio' },
  { name: 'Cycling', caloriesPerMin: 9.4, type: 'cardio' },
  { name: 'Swimming', caloriesPerMin: 10.5, type: 'cardio' },
  { name: 'Weight Lifting', caloriesPerMin: 4.8, type: 'strength' },
  { name: 'Yoga', caloriesPerMin: 3.2, type: 'flexibility' },
  { name: 'HIIT', caloriesPerMin: 12.5, type: 'cardio' },
  { name: 'Push-ups', caloriesPerMin: 7.1, type: 'strength' },
  { name: 'Pull-ups', caloriesPerMin: 6.8, type: 'strength' },
  { name: 'Squats', caloriesPerMin: 7.5, type: 'strength' },
  { name: 'Plank', caloriesPerMin: 4.1, type: 'strength' },
  { name: 'Jump Rope', caloriesPerMin: 11.8, type: 'cardio' },
]

function Exercises({ data, onSave }) {
  const [selectedExercise, setSelectedExercise] = useState('')
  const [duration, setDuration] = useState('')
  const [customName, setCustomName] = useState('')
  const [customCalPerMin, setCustomCalPerMin] = useState('')
  const [showCustom, setShowCustom] = useState(false)
  const [filter, setFilter] = useState('all')

  const today = new Date().toISOString().split('T')[0]
  const todayExercises = data.filter(e => e.date === today)

  const filteredExercises = filter === 'all' ? EXERCISE_DB : EXERCISE_DB.filter(e => e.type === filter)

  const calculateCalories = (name, mins) => {
    if (name === 'custom' && customCalPerMin) {
      return Math.round(customCalPerMin * mins)
    }
    const exercise = EXERCISE_DB.find(e => e.name === name)
    return exercise ? Math.round(exercise.caloriesPerMin * mins) : 0
  }

  const saveExercise = () => {
    if (!selectedExercise || !duration) return

    const caloriesBurned = calculateCalories(selectedExercise, Number(duration))
    const exerciseName = selectedExercise === 'custom' ? customName : selectedExercise

    const newExercise = {
      id: Date.now(),
      date: today,
      name: exerciseName,
      duration: Number(duration),
      caloriesBurned,
      type: selectedExercise === 'custom' ? 'custom' : EXERCISE_DB.find(e => e.name === selectedExercise)?.type
    }

    onSave([...data, newExercise])
    setSelectedExercise('')
    setDuration('')
    setCustomName('')
    setCustomCalPerMin('')
  }

  const deleteExercise = (id) => {
    onSave(data.filter(e => e.id !== id))
  }

  const totalBurned = todayExercises.reduce((sum, e) => sum + (e.caloriesBurned || 0), 0)

  return (
    <div className="exercises">
      <h2>Exercise Tracking</h2>

      <div className="exercise-summary">
        <div className="summary-card">
          <h3>Today's Calories Burned</h3>
          <div className="big-number">{totalBurned}</div>
          <p>calories</p>
        </div>
      </div>

      <div className="add-exercise">
        <h3>Log Exercise</h3>

        <div className="filter-buttons">
          {['all', 'cardio', 'strength', 'flexibility'].map(f => (
            <button
              key={f}
              className={filter === f ? 'active' : ''}
              onClick={() => { setFilter(f); setSelectedExercise('') }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="exercise-list">
          {filteredExercises.map(ex => (
            <div
              key={ex.name}
              className={`exercise-option ${selectedExercise === ex.name ? 'selected' : ''}`}
              onClick={() => setSelectedExercise(ex.name)}
            >
              <span className="ex-name">{ex.name}</span>
              <span className="ex-cals">{ex.caloriesPerMin} cal/min</span>
            </div>
          ))}
          <div
            className={`exercise-option ${selectedExercise === 'custom' ? 'selected' : ''}`}
            onClick={() => setSelectedExercise('custom')}
          >
            <span className="ex-name">+ Custom Exercise</span>
          </div>
        </div>

        {selectedExercise === 'custom' && (
          <div className="custom-exercise">
            <input type="text" placeholder="Exercise name" value={customName} onChange={e => setCustomName(e.target.value)} />
            <input type="number" placeholder="Cal/min" value={customCalPerMin} onChange={e => setCustomCalPerMin(e.target.value)} />
          </div>
        )}

        {selectedExercise && (
          <div className="duration-input">
            <label>Duration (minutes):</label>
            <input type="number" value={duration} onChange={e => setDuration(e.target.value)} placeholder="30" />
            {duration && selectedExercise !== 'custom' && (
              <div className="cal-preview">
                ≈ {calculateCalories(selectedExercise, Number(duration))} calories burned
              </div>
            )}
          </div>
        )}

        <button className="save-exercise" onClick={saveExercise} disabled={!selectedExercise || !duration}>
          Log Exercise
        </button>
      </div>

      <div className="today-exercises">
        <h3>Today's Exercises ({todayExercises.length})</h3>
        {todayExercises.length === 0 ? <p className="empty">No exercises logged today</p> : todayExercises.map(ex => (
          <div key={ex.id} className="exercise-item">
            <div className="exercise-info">
              <h4>{ex.name}</h4>
              <p>{ex.duration} minutes • {ex.caloriesBurned} calories burned</p>
            </div>
            <button className="delete-btn" onClick={() => deleteExercise(ex.id)}>×</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Exercises
