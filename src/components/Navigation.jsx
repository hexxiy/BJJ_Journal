import { useState } from 'react'
import './Navigation.css'

function Navigation({ activeSection, setActiveSection }) {
  const sections = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'meals', label: 'Meals' },
    { id: 'exercises', label: 'Exercises' }
  ]

  return (
    <nav className="navigation">
      <h1 className="logo">🍏 Fitness Pal</h1>
      <ul>
        {sections.map(section => (
          <li key={section.id}>
            <button
              className={activeSection === section.id ? 'active' : ''}
              onClick={() => setActiveSection(section.id)}
            >
              {section.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Navigation
