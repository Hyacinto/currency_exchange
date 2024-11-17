import express from "express"
import { google } from "googleapis"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config()
import { GoogleAuth } from "google-auth-library"


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

app.get("/historical", async (req, res) => {
    try {
        const spreadsheetId = "1515_6T0FgnIY-cz5vVVxnnUpSmas7jsn8ECJ7RqdjvA"
        const range = "Tab2!A:B"
        let response

        for (let attempt = 0; attempt < 3; attempt++) {
            response = await sheets.spreadsheets.values.get({
                spreadsheetId,
                range,
            })

            const rows = response.data.values

            if (rows && rows[0] && rows[0][0] !== '') {
                return res.json(rows);
            }

            await new Promise(resolve => setTimeout(resolve, 5000));
        }
        res.status(404).json({ message: "Data not available yet!" });
    } catch (error) {
        console.error("Error retrieving data:", error)
        res.status(500).send("Error retrieving data")
    }
})

app.get("/:searchValue", async (req, res) => {
    try {
        const spreadsheetId = "1515_6T0FgnIY-cz5vVVxnnUpSmas7jsn8ECJ7RqdjvA"
        const range = "Tab1!A:K"

        const searchValue = req.params.searchValue
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range,
        })

        const rows = response.data.values
        const filteredRow = rows.find(row => row.includes(searchValue))

        if (filteredRow) {
            res.json(filteredRow);
        } else {
            res.status(404).json({ message: "Row not found" })
        }
    } catch (error) {
        console.error("Error retrieving data:", error)
        res.status(500).send("Error retrieving data")
    }
})

app.post("/add", async (req, res) => {
    try {
        const spreadsheetId = "1515_6T0FgnIY-cz5vVVxnnUpSmas7jsn8ECJ7RqdjvA"
        const range = "Tab2!A1"
        const formula = {
            values: [
                [req.body.values]
            ]
        }

        await sheets.spreadsheets.values.update({
            spreadsheetId,
            range,
            valueInputOption: "USER_ENTERED",
            resource: formula,
        })

        res.send("Formula added successfully.")
    } catch (error) {
        console.error("Error writing formula:", error.message, error.stack)
        res.status(500).send("Failed to write formula.")
    }
})

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
})