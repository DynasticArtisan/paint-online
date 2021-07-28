import React, { useEffect, useRef, useState } from 'react'
import '../styles/canvas.scss'
import {observer} from 'mobx-react-lite'
import canvasState from '../store/canvasState'
import toolState from '../store/toolState'
import Brush from '../tools/Brush'
import { useParams } from 'react-router'
import Notifications from './Notifications'
import Rect from '../tools/Rect'
import Line from '../tools/Line'
import Ring from '../tools/Ring'
import axios from 'axios'

const Canvas = observer(() => {
    const canvasRef = useRef()
    const params = useParams()
    const [notifications, setNotifications] = useState([])
    

    const newNotification = (text) => {
        const id = Date.now()
        setNotifications(currentNotifs => [...currentNotifs, { id, text }])
        setTimeout(()=>setNotifications(currentNotifs => currentNotifs.filter(item => item.id!==id)), 5000)
    }

    const drawHandler = (msg) => {
        const figure = msg.figure
        const style = msg.style
        const ctx = canvasRef.current.getContext('2d')
        switch(figure.type){
            case 'start':
                canvasState.pushToUndo(canvasRef.current.toDataURL())
                canvasState.clearRedo()
                break
            case 'finish':
                ctx.beginPath()
                break    
            case 'brush':
                Brush.draw(ctx, figure.x, figure.y, style)
                break
            case 'rect':
                Rect.staticDraw(ctx, figure.x, figure.y, figure.width, figure.height, style)
                ctx.beginPath()
                break
            case 'line':
                Line.staticDraw(ctx, figure.fromX, figure.toX, figure.fromY, figure.toY, style)
                ctx.beginPath()
                break
            case 'ring':
                Ring.staticDraw(ctx, figure.cx, figure.cy, figure.r, style)
                ctx.beginPath()
                break
                
        }
    }



    useEffect(()=>{
      if(canvasState.userName){
        const socket = new WebSocket(`ws://localhost:5000/`)
        canvasState.setSocket(socket)
        canvasState.setSessionId(params.id)
        toolState.setTool(new Brush(canvasRef.current, socket, params.id))
        toolState.setLineWidth(10)
        socket.onopen = () => {
          socket.send(JSON.stringify({
            id: params.id,
            username: canvasState.userName, 
            method: 'connection' 
          }))
        }
        socket.onclose = () => {
            socket.send(JSON.stringify({
              id: params.id,
              username: canvasState.userName, 
              method: 'disconnection' 
            }))
          }
        socket.onmessage = (e) => {
            const msg = JSON.parse(e.data)
            switch(msg.method){
                case 'connection':
                    newNotification( `Пользователь ${msg.username} подключился `) 
                    break
                case 'disconnection':
                    newNotification( `Пользователь ${msg.username} отключился `) 
                    break
                case 'draw':
                    drawHandler(msg)
                    break
                case 'undo':
                    canvasState.undo()
                    break
                case 'redo':
                    canvasState.redo()
                    break

            }
                 
        }
      }
      
    },[canvasState.userName])



    useEffect(()=>{
        canvasState.setCanvas(canvasRef.current)
        let ctx = canvasRef.current.getContext('2d')
        axios.get(`http://localhost:5000/image?id=${params.id}`)
        .then(response => {
            const img = new Image()
            img.src = response.data
            img.onload = () => {
                ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
                ctx.drawImage(img , 0, 0, canvasRef.current.width, canvasRef.current.height)
        }
    })
    },[])

    const mouseUpHandler = () => {
        axios.post(`http://localhost:5000/image?id=${params.id}`, {img: canvasRef.current.toDataURL()})
            
    } 
    
    return (
        <div className="canvas">
            <Notifications data={notifications}/>
            <canvas onMouseUp={() => mouseUpHandler()} onTouchEnd={() => mouseUpHandler()} ref={canvasRef} width={1024} height={768}></canvas>
        </div>
    )
})

export default Canvas