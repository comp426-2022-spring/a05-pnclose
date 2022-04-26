// Focus div based on nav button click
document.getElementById("homenav").onclick = function(){
    document.getElementById("home").className = "";
    document.getElementById("single").className = "hidden";
    document.getElementById("multi").className = "hidden";
    document.getElementById("guess").className = "hidden";
};

document.getElementById("singlenav").onclick = function(){
    document.getElementById("home").className = "hidden";
    document.getElementById("single").className = "";
    document.getElementById("multi").className = "hidden";
    document.getElementById("guess").className = "hidden";
};

document.getElementById("multinav").onclick = function(){
    document.getElementById("home").className = "hidden";
    document.getElementById("single").className = "hidden";
    document.getElementById("multi").className = "";
    document.getElementById("guess").className = "hidden";
};


document.getElementById("guessnav").onclick = function(){
    document.getElementById("home").className = "hidden";
    document.getElementById("single").className = "hidden";
    document.getElementById("multi").className = "hidden";
    document.getElementById("guess").className = "";
};


// Flip one coin and show coin image to match result when button clicked
function flipCoin() {
    fetch("http://localhost:5000/app/flip/")
        .then(function(response) {
            return response.json();
        })
        .then(function(result) {
            console.log(result);
            document.getElementById("result").innerHTML = result.flip;
            document.getElementById("smallcoin").setAttribute("src", "./assets/img/" + result.flip + ".png");
            coin.disabled = true;
        })
}



// Flip multiple coins and show coin images in table as well as summary results
// Enter number and press button to activate coin flip series

// Listener so that multi calls flipMultipleCoins() 
const multi = document.getElementById("numflipsform");
multi.addEventListener("submit", flipCoins);

// Submit handler
async function flipCoins(event) {
    // Prevents automatic form submission
    event.preventDefault();

    // Set endpoint and URL
    const endpoint = "app/flip/coins/";
    const url = document.baseURI+endpoint;

    const formEvent = event.currentTarget;

    try {
        const formData = new FormData(formEvent);
        const flips = await sendFlips({ url, formData });

        console.log(flips);
        displayMultiResults(flips.raw);
        
        if (!flips.summary.heads) {
            document.getElementById("heads-result").innerHTML = "Heads: 0";
        } else {
            document.getElementById("heads-result").innerHTML = "Heads: "+flips.summary.heads;
        }

        if (!flips.summary.tails) {
            document.getElementById("tails-result").innerHTML = "Tails: 0";
        } else {
            document.getElementById("tails-result").innerHTML = "Tails: "+flips.summary.tails;
        }
    } catch (error) {
        console.log(error);
    }


}

// Data sender
async function sendFlips({ url, formData }) {
    const plainFormData = Object.fromEntries(formData.entries());
    const formDataJson = JSON.stringify(plainFormData);
    console.log(formDataJson); 

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: formDataJson
    };
    const response = await fetch(url, options);
    return response.json();
}

function displayMultiResults(multi_results) { 
    document.getElementById('multi-ht-result').innerHTML = "";
    for (let i = 0; i < multi_results.length; i++) {
        document.getElementById('multi-ht-result').innerHTML += `
        <img id = "smallcoin" src="./assets/img/${multi_results[i]}.png"></img>
        <p>${multi_results[i]}</p>
        `
    }
}



// Guess a flip by clicking either heads or tails button
function guessHeads() {
    fetch("http://localhost:5000/app/flip/call/heads")
        .then(function(response) {
            return response.json();
        })
        .then(function(result) {
            console.log(result);
            document.getElementById("call-result").innerHTML = result.call;
            document.getElementById("calls-coin").setAttribute("src", "./assets/img/" + result.call + ".png");
            document.getElementById("flips-result").innerHTML = result.flip;
            document.getElementById("flip-coin").setAttribute("src", "./assets/img/" + result.flip + ".png");
            document.getElementById("guess-result").innerHTML = result.result;
            coin.disabled = true;
        })
}

function guessTails() {
    fetch("http://localhost:5000/app/flip/call/tails")
        .then(function(response) {
            return response.json();
        })
        .then(function(result) {
            console.log(result);
            document.getElementById("call-result").innerHTML = result.call;
            document.getElementById("calls-coin").setAttribute("src", "./assets/img/" + result.call + ".png");
            document.getElementById("flips-result").innerHTML = result.flip;
            document.getElementById("flip-coin").setAttribute("src", "./assets/img/" + result.flip + ".png");
            document.getElementById("guess-result").innerHTML = result.result;
            coin.disabled = true;
        })
}