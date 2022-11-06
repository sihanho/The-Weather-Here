
// function sendUserInput(){
//     var userInputs = document.getElementById('userInput').value
//     document.getElementById('userInput').value=''
//     return userInputs
// }

getUserLoc()

async function getUserLoc(){
    if ('geolocation' in navigator) {
        console.log("geolocation is available")
        navigator.geolocation.getCurrentPosition(async (position) => {
        
            let lat1 = await position.coords.latitude;
            let lon1 = await position.coords.longitude;
            
            document.getElementById('latitude').innerHTML = lat1;
            document.getElementById('longitude').innerHTML = lon1;

            const api_url = `/weather/${Number((lat1).toFixed(4))},${Number((lon1).toFixed(4))}`
            //const api_url = `/weather`
            const response = await fetch(api_url)
            const json = await response.json()
            //console.log(json)

            const weather = json.weather
            console.log(weather)
            let summary = weather.weather[0].description
            let currentTemperatureInDegress = Number(weather.main.temp - 273).toFixed(1)
            document.getElementById('summary').innerHTML = summary
            document.getElementById('temperature').innerHTML = currentTemperatureInDegress

            try{
                var air = json.air_quality.results[0].measurements[0] //pm10 ug/m3
                console.log(air)
                document.getElementById('aq_parameter').textContent = air.parameter
                document.getElementById('aq_value').textContent = air.value
                document.getElementById('aq_unit').textContent = air.unit
                document.getElementById('aq_lastUpdated').textContent = air.lastUpdated
            } catch(error){
                console.error(error)
                document.getElementById('aq').innerHTML = "No air-quality data available"
            }

            const data = {lat1, lon1, weather, air}
            const options = {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }
            const db_response = await fetch('/api', options)
            const db_json = await db_response.json()
            console.log(db_json)
        })
    } else {
        console.log("geolocation IS NOT available")
    }
}

// const button = document.getElementById("submit");
// button.addEventListener("click", async (event) => {
//     //const userInputs = sendUserInput()
//     const lat = document.getElementById("latitude").textContent
//     const lon = document.getElementById('longitude').textContent
//     const data = {lat, lon}
//     //console.log(data)

    
// });

