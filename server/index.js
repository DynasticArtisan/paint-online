const express = require('express')
const app = express()
const WSserver = require('express-ws')(app)
const aWss = WSserver.getWss()
const PORT = process.env.PORT || 5000    
const cors = require('cors')
const fs = require('fs')
const path = require('path')


app.use(cors())

app.use(express.json({limit: '20mb'}))

app.ws('/', (ws, req)=> {
    console.log('ПОДКЛЮЧЕНИЕ УСТАНОВЛЕНО')

    ws.on('message', (msg) => {
        msg = JSON.parse(msg)
        switch(msg.method){
            case 'connection':
                connectionHandler(ws, msg)
                break
            case 'disconnection':
                connectionHandler(ws, msg)
                break
            case 'draw':
                broadcast(ws, msg)
                break
            case 'undo':
                broadcast(ws, msg)
                break
            case 'redo':
                broadcast(ws, msg)
                break
            default:
                break
        }
    } )
    ws.on('close', )
})

app.post('/image', (req, res)=>{
    try {
        const data = req.body.img.replace('data:image/png;base64,', '')
        fs.writeFileSync(path.resolve(__dirname, 'files', `${req.query.id}.jpg`), data, 'base64')
        return res.status(200).json({message: 'img saved'})
    } catch (e) {
        console.log(e)
        return res.status(500).json(e.message)
    }
})

app.get('/image', (req, res)=>{
    try {
        const file = fs.readFileSync(path.resolve(__dirname, 'files', `${req.query.id}.jpg`))
        const data = `data:image/png;base64,` + file.toString('base64')
        res.json(data)
    } catch (e) {
        console.log(e)
        return res.status(500).json(e.message)
    }
})

const connectionHandler = (ws, msg) => {

    ws.id = msg.id
    broadcast(ws, msg)
}
const broadcast = (ws, msg) => {
    aWss.clients.forEach( client => {
        if(client.id === msg.id){
            client.send(JSON.stringify(msg))
        }
    })
}



app.listen(PORT, ()=> {
    console.log(`Server has been started on port ${PORT}`)
})