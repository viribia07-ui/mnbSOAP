import { useState } from 'react'
import './App.css'
import MNBCurrencyRates from './MNBCurrencyRates'

/**
 * TODO - refactor App to class component
 * @returns 
 */

function App() {
  const [count, setCount] = useState(0)
  const cim = <h1>Cím</h1>

  return (
    <>
      <h1>MNB Árfolyamok (TODO date)</h1>
      <div className="card">
        <MNBCurrencyRates/>
      </div>
    </>
  )
}

export default App
