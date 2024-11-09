import './App.css'
import { useState, useEffect } from 'react'

function App() {
  const [countryList, setCountryList] = useState([])
  const [selectedCountry, setSelectedCountry] = useState("")

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

  const handleSelectChange = (event) => {
    setSelectedCountry(event.target.value)
  }

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
    </>
  )
}

export default App
