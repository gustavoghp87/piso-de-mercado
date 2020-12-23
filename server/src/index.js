const express = require('express')
const app = express()
const http = require('http')
const server = http.Server(app)
const cors = require('cors')
app.use(cors())
app.use(express.json())

require('./controllers/database').connect().then(conn => {
    if (conn) console.log(`Connected successfully to 'chatencio' database in Atlas MongoDB`)
})

app.use(express.static(__dirname + '/chat-app/dist/chat-app'))
app.use("/images", express.static(__dirname + '/images'))
app.use('/', require('./routes/index.routes'))

const port = process.env.PORT || 3000
server.listen(port, () => {
    console.log(`Server started on port: ${port}`)
})

module.exports = { server }
