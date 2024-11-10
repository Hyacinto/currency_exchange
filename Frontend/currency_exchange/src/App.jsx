import './App.css'
import { useState, useEffect } from 'react'

function App() {
  const [countryList, setCountryList] = useState([])
  const [selectedCountry, setSelectedCountry] = useState("")
  const [selectedCountryData, setSelectedCountryData] = useState(null)


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/data`)
        if (!response.ok) throw new Error("Country list not found")
        const result = await response.json()
        setCountryList(result)
      } catch (error) {
        console.error("Error fetching data:", error)
        setData(null)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedCountry) return

      try {
        const response = await fetch(`http://localhost:5000/${selectedCountry}`)
        if (!response.ok) throw new Error("Row not found")
        const result = await response.json()
        setSelectedCountryData(result)
      } catch (error) {
        console.error("Error fetching data:", error)
        setData(null)
      }
    }
    fetchData()
  }, [selectedCountry])

  const handleSelectChange = (event) => {
    setSelectedCountry(event.target.value)
  }

  countryList.shift()

  return (
    <>
      <h1>Currency Change</h1>
      <div className="form-group">
        <label htmlFor="country-select">Select a country:</label>
        <select id="country-select" value={selectedCountry} onChange={handleSelectChange}>
          <option value="" disabled>Choose a country</option>
          {countryList.map((country, index) => (
            <option key={index} value={country[0]}>
              {country[0]}
            </option>
          ))}
        </select>
      </div>
      {
        selectedCountryData === null ? (
          <h3>I need a country...</h3>
        ) : (
          <>
            <h3>Currency name: {selectedCountryData[1]}</h3>
            <h3>Ticker: {selectedCountryData[2]}</h3>
            <h3>1 {selectedCountryData[2]} = {selectedCountryData[3]} USD</h3>
            <h3>1 {selectedCountryData[2]} = {selectedCountryData[4]} EUR</h3>
            <h3>1 {selectedCountryData[2]} = {selectedCountryData[5]} GBP</h3>
            <h3>1 {selectedCountryData[2]} = {selectedCountryData[6]} CHF</h3>
            <h3>1 USD = {selectedCountryData[7]} {selectedCountryData[2]}</h3>
            <h3>1 EUR = {selectedCountryData[8]} {selectedCountryData[2]}</h3>
            <h3>1 GBP = {selectedCountryData[9]} {selectedCountryData[2]}</h3>
            <h3>1 CHF = {selectedCountryData[10]} {selectedCountryData[2]}</h3>
          </>
        )
      }

    </>
  )
}

export default App
