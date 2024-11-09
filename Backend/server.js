import express from "express"
import cors from "cors"
import { google } from "googleapis"
import { GoogleAuth } from "google-auth-library"
import dotenv from "dotenv"
dotenv.config()

const app = express()
const port = 5000
app.use(cors())
app.use(express.json())

const auth = new GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY),
    scopes: [process.env.GOOGLE_SHEETS_SCOPE],
})

const sheets = google.sheets({ version: "v4", auth })

app.get("/data", async (req, res) => {
    try {
        const spreadsheetId = "1515_6T0FgnIY-cz5vVVxnnUpSmas7jsn8ECJ7RqdjvA"
        const range = "Tab1!A:C"

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range,
        })

        const rows = response.data.values

        if (rows) {
            res.json(rows);
        } else {
            res.status(404).json({ message: "Data not found" })
        }
    } catch (error) {
        console.error("Error retrieving data:", error)
        res.status(500).send("Error retrieving data")
    }
})

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
})
