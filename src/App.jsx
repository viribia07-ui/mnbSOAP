import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import MNBCurrencyRates from './MNBCurrencyRates'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>MNB Árfolyamok</h1>
      <div className="card">
        <MNBCurrencyRates/>
      </div>
    </>
  )
}

export default App
