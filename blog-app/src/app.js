const http = require('http')

const server = http.createServer( (req, res) => {
    if (req.url === '/about')
        res.end('The about page')
    else if (req.url === '/contact')
        res.end('The contact page')
    else if (req.url === '/')
        res.end('The Home Page')
    else {
        res.writeHead(404)
        res.end('Not found')
    }

    console.log(req.url)
    res.end('Hello Node.js')
})

server.listen(3000)