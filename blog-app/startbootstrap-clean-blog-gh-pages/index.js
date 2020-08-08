const express = require('express')

const app = express()

app.use(express.static('public'))
app.listen(4000, () => {
    console.log('Listening on port 4000')
})

app.get('/', (req, res) => {
    res.send('Hello blog nodemon is on the air!')
})