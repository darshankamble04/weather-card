const http = require("http")
const fs = require("fs")
var requests = require('requests');

const html = fs.readFileSync("../index.html", "utf-8")


const server = http.createServer((req, res) => {

    if (req.url == "/") {
        requests("https://api.openweathermap.org/data/2.5/weather?q=pune&appid=b84157cbb18b0a296952e1331c074ca6")
            .on('data', (chunk) => {
                const apiData = JSON.parse(chunk)
                console.log(apiData["main"]["temp"] - 273.15)
                let repl = html.replace("{%temp%}", (apiData["main"]["temp"] - 273.15).toFixed(2))
                repl = repl.replace("{%tempmin%}", (apiData["main"]["temp_min"] - 273.15).toFixed(2))
                repl = repl.replace("{%tempmax%}", (apiData["main"]["temp_max"] - 273.15).toFixed(2))
                repl = repl.replace("{%place%}", apiData["name"])
                repl = repl.replace("{%country%}", apiData["sys"]["country"])
                repl = repl.replace("{%weather%}", apiData["weather"]["main"])
                res.write(repl)
            })
            .on('end', (err) => {
                res.end();
                if (err) return console.log('connection closed due to errors', err);
                console.log('end');
            });
    }

})

server.listen(8000, "127.0.0.1", () => {
    console.log('Your are live ...')
})