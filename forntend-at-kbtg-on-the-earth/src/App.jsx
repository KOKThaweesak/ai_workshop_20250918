import React from 'react'
import Datepicker from './components/Datepicker'

function App() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
        gap: '2rem',
      }}
    >
      <h1 style={{ textAlign: 'center', fontSize: '3.5rem', margin: 0 }}>Hello KBTG</h1>
      <Datepicker />
    </div>
  )
}

export default App
