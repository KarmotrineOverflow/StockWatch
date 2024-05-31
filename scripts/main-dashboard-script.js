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

            initializeWatchlist(response["user_config"]["watchlist"]);
            configureUiMode(response["user_config"]["ui_mode"]);

            apiKey = response["user_config"]["api_key"];
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

function configureUiMode(theme) {

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

    let urlStr = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=IBM&apikey=demo";

    fetch("http://localhost/stockWatch/resources/data/test-data.json", requestBody)
        .then(data => data.json())
        .then(response => {
            
            displayStockData(response[currentStock]);
        })
        .catch(error => console.log(error));

    let stockNames = document.getElementsByClassName("stock-name");
    for (let stock of stockNames) {

        stock.innerHTML = currentStock;
    }
}

function displayStockData(stockData) {

    let lastStockPrice = document.getElementsByClassName("last-stock-price");
    let percentageChange = document.getElementsByClassName("percentage-change");
    let tradeVolume = document.getElementsByClassName("trade-volume");

    lastStockPrice[0].innerHTML = stockData["last-stock-price"];
    percentageChange[0].innerHTML = stockData["percentage-change"];
    tradeVolume[0].innerHTML = stockData["trade-volume"];
}