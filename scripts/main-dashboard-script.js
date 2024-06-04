let currentWatchlistIndex = 0;
let watchlistKeys = [];
let watchlist = new Object;

let uiMode = "";
let apiKey = "";

async function initializeApplication() {

    var appHeader = new Headers();
    appHeader.append("Content-Type", "application/json");

    let requestBody = {

        method: "GET",
        headers: appHeader,
    };

    await fetch("http://localhost/stockWatch/resources/data/config.json", requestBody)
        .then(data => data.json())
        .then(response => {

            apiKey = response["user_config"]["api_key"];
            initializeWatchlist(response["user_config"]["watchlist"]);
            configureUiMode(response["user_config"]["ui_mode"]);
        })
        .catch(error => console.log(error));
}

function initializeWatchlist(watchlistObj) {

    watchlist = watchlistObj;

    for (let [key, value] of Object.entries(watchlist)) {

        watchlistKeys.push(key);
    }

    retrieveStockData();
}

function configureUiMode(theme) /* WIP */ {

    // sets the background theme of the app WIP
}

function nextStock() {

    if ((currentWatchlistIndex + 1) == watchlistKeys.length) {

        currentWatchlistIndex = 0;
    } else {

        currentWatchlistIndex++;
    }

    retrieveStockData();
}

function previousStock() {

    if ((currentWatchlistIndex) == 0) {

        currentWatchlistIndex = watchlistKeys.length - 1;
    } else {

        currentWatchlistIndex--;
    }

    retrieveStockData();
}

function retrieveStockData() {

    var currentStock = watchlistKeys[currentWatchlistIndex];
    var requestHeader = new Headers();

    requestHeader.append("Content-Type", "application/json");

    var requestBody = {

        method: "GET",
        headers: requestHeader
    };

    let urlStr = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${currentStock}&apikey=${apiKey}`;

    fetch(urlStr, requestBody)
        .then(data => data.json())
        .then(response => {
            
            displayStockData(response["Global Quote"]);
        })
        .catch(error => console.log(error));

    // Display the stock ticker in the widget while its data is being retrieved
    let stockNames = document.getElementsByClassName("stock-name");
    for (let stock of stockNames) {

        stock.innerHTML = currentStock;
    }
}

function displayStockData(stockData) {

    /* Quote Schema

    "Global Quote": {
        "01. symbol": "VOO",
        "02. open": "481.2400",
        "03. high": "484.9100",
        "04. low": "476.4750",
        "05. price": "484.6200",
        "06. volume": "5333971",
        "07. latest trading day": "2024-05-31",
        "08. previous close": "480.4400",
        "09. change": "4.1800",
        "10. change percent": "0.8700%"
    } */

    let lastStockPrice = document.getElementsByClassName("last-stock-price");
    let percentageChange = document.getElementsByClassName("percentage-change");
    let tradeVolume = document.getElementsByClassName("trade-volume");

    lastStockPrice[0].innerHTML = stockData["05. price"];
    percentageChange[0].innerHTML = stockData["10. change percent"];
    tradeVolume[0].innerHTML = stockData["06. volume"];
}