var mymap = L.map('checkinMap').setView([0,0], 1);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(mymap);

getData()

async function getData(){
    const response = await fetch('/api')
    const data = await response.json()
    for(item of data){

        const marker = L.marker([item.lat1, item.lon1]).addTo(mymap);
        const txt = `<p>
                        latitude: <span id="latitude">${item.lat1}</span>°<br/>
                        longtitude: <span id="longitude">${item.lon1}</span>°
                    </p>

                    <p>
                        The weather here is <span id="summary">${item.weather.weather[0].description}</span>.</br>
                        The temperatur is <span id="temperature">${Number(item.weather.main.temp-273).toFixed(1)}</span>°.
                    </p>

                    <p id="aq">
                        The concentration of <span id="aq_parameter">${item.air.parameter}</span>
                        is <span id="aq_value">${item.air.value}</span> <span id="aq_unit">${item.air.unit}</span>. </br>
                        Last update <span id="aq_lastUpdated">${item.air.lastUpdated}</span>
                    </p>`
        marker.bindPopup(txt)

        const roof = document.createElement("p")
        //const mood = document.createElement("div")
        const geo = document.createElement("div")
        const date = document.createElement("div")
        //const space = document.createElement("br")

        //mood.textContent = `Mood: ${item.userInputs}`
        geo.textContent = `Location: ${item.lat1}°, ${item.lon1}°`         
        const dateString = new Date(item.timestamp).toLocaleString()  
        console.log(new Date(item.timestamp).toString())
        date.textContent = `Date: ${dateString}`

        
        roof.append(geo, date )
        document.body.append(roof)
    }
    console.log(data)
}





            