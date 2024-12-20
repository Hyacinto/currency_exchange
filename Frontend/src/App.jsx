import './App.css'
import { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

function App() {
  const [countryList, setCountryList] = useState([])
  const [selectedCountry, setSelectedCountry] = useState("")
  const [selectedCountryData, setSelectedCountryData] = useState(null)

  const [base, setBase] = useState("")
  const [against, setAgainst] = useState("")
  const [historical, setHistorical] = useState([])
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [isLoading, setIsLoading] = useState(false)
  const [isChartVisible, setIsChartVisible] = useState(false)


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/data`)
        if (!response.ok) throw new Error("Country list not found")
        const result = await response.json()
        setCountryList(result)
      } catch (error) {
        console.error("Error fetching data:", error)
        setCountryList(null)
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
        setSelectedCountryData(null)
      }
    }
    fetchData()
  }, [selectedCountry])

  const handleSelectChange = (event) => {
    setSelectedCountry(event.target.value)
  }

  countryList.shift()
  const tickers = [...new Set(
    countryList
      .map(innerArray => innerArray[2])
      .filter(ticker => ticker !== "N/A")
  )];


  const addFormula = async () => {
    const formulaData = {
      values: `=GOOGLEFINANCE("CURRENCY:${base}${against}";"price";DATE(${startDate.getFullYear()};${startDate.getMonth() + 1};${startDate.getDate()});DATE(${endDate.getFullYear()};${endDate.getMonth() + 1};${endDate.getDate()});"DAILY")`
    }

    try {
      const response = await fetch("http://localhost:5000/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formulaData)
      });

      if (!response.ok) {
        throw new Error("Failed to add formula");
      }
      const result = await response.text();
      console.log(result)
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const fetchHistoricalData = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`http://localhost:5000/historical`)
      if (!response.ok) throw new Error("Historical data not found")
      const result = await response.json()
      setHistorical(result)
      setIsChartVisible(true)
    } catch (error) {
      console.error("Error fetching data:", error)
      setHistorical(null)
      setIsChartVisible(false)
    } finally {
      setIsLoading(false)
    }
  }


  const handleSelectChangeBase = (event) => {
    setBase(event.target.value)
  }

  const handleSelectChangeAgainst = (event) => {
    setAgainst(event.target.value)
  }

  const chartData = async () => {
    await addFormula()
    await fetchHistoricalData()
  }

  const [temp, closeString] = historical.reduce(
    ([first, second], [a, b]) => {
      first.push(a)
      second.push(b)
      return [first, second]
    },
    [[], []]
  )

  temp.shift()
  closeString.shift()
  const date = temp.map(d => d.slice(0, 10))
  const close = closeString.map(c => parseFloat(c))

  const dataChart = {
    type: 'line',
    labels: date,
    datasets: [
      {
        data: close,
        pointRadius: 0,
        borderColor: 'blue',
        borderWidth: 0.8,
      },
    ],
  }

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'black',
          lineWidth: 0.5,
        },
        ticks: {
          color: 'black',
        },
        title: {
          display: true,
          text: 'Date',
          color: 'black',
        },
      },
      y: {
        grid: {
          color: 'black',
          lineWidth: 0.5,
        },
        ticks: {
          color: 'black',
        },
        title: {
          display: true,
          text: 'Exchange Rate',
          color: 'black',
        },
      },
    },
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
      <div>
        <h1>Historical data</h1>
        <div className="form-group">
          <label htmlFor="base-select">Select a base currency:</label>
          <select id="base-select" value={base} onChange={handleSelectChangeBase}>
            <option value="" disabled>Choose a ticker</option>
            {tickers.map((ticker, index) => (
              <option key={index} value={ticker}>
                {ticker}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="base-select">Select a currency against the base:</label>
          <select id="base-select" value={against} onChange={handleSelectChangeAgainst}>
            <option value="" disabled>Choose a ticker</option>
            {tickers.map((ticker, index) => (
              <option key={index} value={ticker}>
                {ticker}
              </option>
            ))}
          </select>
        </div>
        <div>
          <p>Choose a start date:</p>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            minDate={new Date('2003-12-01')}
            maxDate={new Date()}
            dateFormat="yyyy/MM/dd"
          />
          <p>Choose an end date:</p>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            minDate={new Date('2003-12-01')}
            maxDate={new Date()}
            dateFormat="yyyy/MM/dd"
          />
        </div>
        <div>
          <button onClick={chartData}>Show me the chart!</button>
        </div>
        <div style={{ display: 'block', boxSizing: 'border-box', height: '400px', width: '900px' }}>
          {isChartVisible ? (isLoading ? (
            <div className="loading">Loading...</div>
          ) : (
            <Line data={dataChart} options={options} />
          )) : (
            <h3>I need tickers and dates...</h3>
          )}
        </div >
      </div>
    </>
  )
}

export default App
