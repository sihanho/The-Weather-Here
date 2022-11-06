//terminal command line -> open a node server: node index.js
//or use: nodemon index.js //it will refresh the server automatically after a code change in the server side.
//restart the seerver use ^C

console.log("here ist the server");

const express = require('express') //import express package
const Datastore = require('nedb')
//const fetch = require('node-fetch')
const fetch = (...args) =>
import('node-fetch').then(({ default: fetch }) => fetch(...args));

require('dotenv').config();
//console.log(process.env)


const app = express()
const port = process.env.PORT || 1000
app.listen(port, () => console.log(`starting server at port ${port}`)) //normally the port is set to 1000
app.use(express.static('public'))
app.use(express.json({limit: '1mb'}))

var database =new Datastore('database.db')
database.loadDatabase()

app.get('/api',(request, response) => {
    database.find({},(error, data) => {
        if(error){
            response.end()
            return
        }
        response.json(data)
    })
    
})

app.post('/api', (request, response) => {
    console.log("new data comes in")
    const data = request.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;
    database.insert(data);
    response.json(data);
  });

// the format to call the api: 
// https://api.openweathermap.org/data/2.5/weather?lat=48.5425152&lon=12.1536512&appid=(YOUR API KEY OF OPENWEATHERMAP.org)


app.get('/weather/:latlon', async (request, response) => {
    console.log(request.params)
    const latlon = request.params.latlon.split(',')
    console.log(latlon)
    const lat1 = latlon[0]
    const lon1 = latlon[1]
    console.log(lat1,lon1)

    const api_key = process.env.API_KEY
    const weather_url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat1}&lon=${lon1}&appid=${api_key}`
    const weather_response = await fetch(weather_url)
    const weather_data = await weather_response.json()

    const aq_url = `https://api.openaq.org/v2/latest?limit=100&page=1&offset=0&sort=desc&coordinates=${lat1}%2C${lon1}&radius=5000&order_by=lastUpdated&dumpRaw=false`
    const aq_response = await fetch(aq_url)
    const aq_data = await aq_response.json()

    const data = {
        weather: weather_data,
        air_quality: aq_data
    }

    response.json(data)
})
