import { useState, useEffect } from 'react'
import Navigation from './components/Navigation'
import Dashboard from './components/Dashboard'
import Meals from './components/Meals'
import Exercises from './components/Exercises'
import './App.css'

function App() {
  const [activeSection, setActiveSection] = useState('dashboard')

  const [meals, setMeals] = useState(() => JSON.parse(localStorage.getItem('fp-meals') || '[]'))
  const [exercises, setExercises] = useState(() => JSON.parse(localStorage.getItem('fp-exercises') || '[]'))
  const [goals, setGoals] = useState(() => JSON.parse(localStorage.getItem('fp-goals') || '{"calories":2000,"protein":150,"carbs":250,"fat":65}'))

  useEffect(() => { localStorage.setItem('fp-meals', JSON.stringify(meals)) }, [meals])
  useEffect(() => { localStorage.setItem('fp-exercises', JSON.stringify(exercises)) }, [exercises])
  useEffect(() => { localStorage.setItem('fp-goals', JSON.stringify(goals)) }, [goals])

  const today = new Date().toISOString().split('T')[0]
  const todayMeals = meals.filter(m => m.date === today)
  const todayExercises = exercises.filter(e => e.date === today)

  const totalCals = todayMeals.reduce((sum, m) => sum + (m.items?.reduce((s, i) => s + (i.calories || 0), 0) || 0), 0)
  const totalProtein = todayMeals.reduce((sum, m) => sum + (m.items?.reduce((s, i) => s + (i.protein || 0), 0) || 0), 0)
  const totalCarbs = todayMeals.reduce((sum, m) => sum + (m.items?.reduce((s, i) => s + (i.carbs || 0), 0) || 0), 0)
  const totalFat = todayMeals.reduce((sum, m) => sum + (m.items?.reduce((s, i) => s + (i.fat || 0), 0) || 0), 0)
  const totalBurned = todayExercises.reduce((sum, e) => sum + (e.caloriesBurned || 0), 0)

  const sections = {
    dashboard: <Dashboard meals={todayMeals} exercises={todayExercises} totalCals={totalCals} totalBurned={totalBurned} totalProtein={totalProtein} totalCarbs={totalCarbs} totalFat={totalFat} goals={goals} />,
    meals: <Meals data={meals} onSave={setMeals} goals={goals} />,
    exercises: <Exercises data={exercises} onSave={setExercises} />
  }

  return (
    <div className="app">
      <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />
      <main>
        {sections[activeSection]}
      </main>
    </div>
  )
}

export default App
