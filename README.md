Currency Exchange Rate App
==========================

This application allows users to view current and historical currency exchange rates. The app fetches data from Google Sheets using the Google Sheets API, dynamically updates currency rates, and displays them in a chart using Chart.js.

Features
--------

*   **Select Country**: Choose a country to view currency details like exchange rates with USD, EUR, GBP, and CHF.
    
*   **Historical Data**: Select base and target currencies, choose a date range, and visualize historical exchange rate data in a line chart.
    
*   **Google Sheets Integration**: The app adds a Google Finance formula to a Google Sheet for real-time currency data retrieval.
    

Technologies
------------

*   **Frontend**: React, React DatePicker, Chart.js
    
*   **Backend**: Express.js
    
*   **Database**: Google Sheets API for storing and retrieving data
    
*   **API Integration**: Google Sheets API, Google Finance
    

Setup and Installation
----------------------

### Prerequisites

*   Node.js and npm
    
*   Google Cloud Project with Sheets API enabled
    
*   Google Sheets API credentials (client ID, API key)
    

### Frontend Setup

1. Open a terminal.

2. Clone the repository:
   ```shell
   git clone <repo_url>
   cd <project_folder>
3. Navigate to the Frontens folder:
    ```shell
    cd Frontend
4. Install the required dependencies:
    ```shell
    npm install
5. Start the development server:
    ```shell
    npm run dev
This will run the React app on http://localhost:5173.

### Backend Setup

1. Open a new terminal window

2. Navigate to the server folder:
    ```shell
    cd backend
3. Install backend dependencies:
    ```shell
    npm install
4. Add the Google Sheets API credential to .env.example file in the backend folder, then rename it to .env.

5. Start the server:
    ```shell
    node start
The server will run on http://localhost:5000.

### API Endpoints

GET /data: Fetches a list of countries and their currency details from Google Sheets.
POST /add: Adds a Google Finance formula to the Google Sheet for fetching currency exchange rates.
GET /historical: Fetches historical exchange rate data from Google Sheets.

### Usage

Select a Country: Choose a country from the dropdown to view its exchange rates.
View Currency Exchange Rates: The app will display exchange rates between the selected country's currency and USD, EUR, GBP, and CHF.
View Historical Data: Choose a base currency, a target currency, and a date range, then click "Show me the chart!" to visualize the historical exchange rate data.