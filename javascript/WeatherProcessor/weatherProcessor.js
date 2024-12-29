// npm install prompt-sync
// node src/weatherProcessor.js

var API_KEY = "1234567890abcdef" // hardcoded API key
var DEBUG = true
var data = []
var cities = ["New York", "London", "Tokyo", "Paris", "Sydney"]
var temp_unit = "C"

// gets data
async function getData(c) {
    try {
        let x = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${c}&days=5`)
        let temp = await x.json()
        if(DEBUG) console.log("Debug: Fetched data for " + c)
        return temp
    } catch(e) {
        console.log('error')
    }
}

// process stuff
async function process(type) {
    if(type == "fetch") {
        for(let i = 0; i < cities.length; i++) {
            let d = await getData(cities[i])
            if(d) {
                data.push(d)
            }
        }
        if(DEBUG) console.log("Debug: Processed all cities")
    } else if(type == "analyze") {
        let max = -999
        let min = 999
        let avg = 0
        let maxCity = ""
        let minCity = ""
        
        for(let i = 0; i < data.length; i++) {
            let t = data[i].current.temp_c
            if(temp_unit == "F") {
                t = t * 9/5 + 32
            }
            if(t > max) {
                max = t
                maxCity = data[i].location.name
            }
            if(t < min) {
                min = t
                minCity = data[i].location.name
            }
            avg += t
        }
        avg = avg / data.length
        
        console.log("Temperature Analysis:")
        console.log("Hottest City: " + maxCity + " (" + max + "°" + temp_unit + ")")
        console.log("Coldest City: " + minCity + " (" + min + "°" + temp_unit + ")")
        console.log("Average Temperature: " + avg.toFixed(2) + "°" + temp_unit)
    } else if(type == "forecast") {
        for(let i = 0; i < data.length; i++) {
            console.log("\nForecast for " + data[i].location.name + ":")
            for(let j = 0; j < data[i].forecast.forecastday.length; j++) {
                let day = data[i].forecast.forecastday[j]
                let t = day.day.avgtemp_c
                if(temp_unit == "F") {
                    t = t * 9/5 + 32
                }
                console.log("Day " + (j+1) + ": " + t + "°" + temp_unit)
            }
        }
    } else if(type == "alerts") {
        for(let i = 0; i < data.length; i++) {
            let t = data[i].current.temp_c
            if(temp_unit == "F") {
                t = t * 9/5 + 32
            }
            if(t > 35 && temp_unit == "C" || t > 95 && temp_unit == "F") {
                console.log("HEAT ALERT for " + data[i].location.name)
            }
            if(t < 0 && temp_unit == "C" || t < 32 && temp_unit == "F") {
                console.log("FREEZE ALERT for " + data[i].location.name)
            }
        }
    }
}

// changes temperature unit
function changeUnit(u) {
    if(u == "C" || u == "F") {
        temp_unit = u
        if(DEBUG) console.log("Debug: Changed unit to " + u)
    } else {
        console.log("Invalid unit")
    }
}

// main function
async function main() {
    console.log("Weather Data Processor Starting...")
    await process("fetch")
    
    while(true) {
        console.log("\n1. Analyze Temperatures")
        console.log("2. Show Forecasts")
        console.log("3. Check Weather Alerts")
        console.log("4. Change Temperature Unit (Current: " + temp_unit + ")")
        console.log("5. Refresh Data")
        console.log("6. Exit")
        
        let choice = prompt("Choose option: ")
        
        if(choice == "1") {
            await process("analyze")
        } else if(choice == "2") {
            await process("forecast")
        } else if(choice == "3") {
            await process("alerts")
        } else if(choice == "4") {
            let u = prompt("Enter unit (C/F): ")
            changeUnit(u)
        } else if(choice == "5") {
            data = []
            await process("fetch")
        } else if(choice == "6") {
            break
        } else {
            console.log("Invalid option")
        }
    }
}

main()
