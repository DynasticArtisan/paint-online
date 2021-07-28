import { observer } from 'mobx-react-lite'
import React from 'react'
import canvasState from '../store/canvasState'
import toolState from '../store/toolState'
import '../styles/toolbar.scss'
import Brush from '../tools/Brush'
import Line from '../tools/Line'
import Rect from '../tools/Rect'
import Remover from '../tools/Remover'
import Ring from '../tools/Ring'

const Toolbar =  observer(() => {
    const socketHandler = (str) => {
        canvasState.socket.send(JSON.stringify({
            method: str,
            id: canvasState.sessionId,
        }))
    }

    const download = () => {
        const dataUrl = canvasState.canvas.toDataURL()
        console.log(dataUrl)
        const a = document.createElement('a')
        a.href = dataUrl
        a.download = canvasState.sessionId + '.jpg'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
    } 

    return (
        <div className="toolbar">
            <div className="container">
                <button className={`toolbar__btn brush ${toolState.tool instanceof Brush && 'active'}`} onClick={()=>toolState.setTool(new Brush(canvasState.canvas, canvasState.socket, canvasState.sessionId))}></button>
                <button className={`toolbar__btn rectangle ${toolState.tool instanceof Rect && 'active'}`} onClick={()=>toolState.setTool(new Rect(canvasState.canvas, canvasState.socket, canvasState.sessionId))}></button>
                <button className={`toolbar__btn ring ${toolState.tool instanceof Ring && 'active'}`} onClick={()=>toolState.setTool(new Ring(canvasState.canvas, canvasState.socket, canvasState.sessionId))}></button>
                <button className={`toolbar__btn remover ${toolState.tool instanceof Remover && 'active'}`} onClick={()=>toolState.setTool(new Remover(canvasState.canvas, canvasState.socket, canvasState.sessionId))}></button>
                <button className={`toolbar__btn line ${toolState.tool instanceof Line && 'active'}`} onClick={()=>toolState.setTool(new Line(canvasState.canvas, canvasState.socket, canvasState.sessionId))}></button>

                <button className="toolbar__btn back" onClick={()=>socketHandler('undo')} disabled={!(canvasState.undolist.length>0)}></button>
                <button className="toolbar__btn repeat" onClick={()=>socketHandler('redo')} disabled={!canvasState.redolist.length} ></button>
                <button className="toolbar__btn save" onClick={()=>download()} ></button>
            </div>

        </div>
    )
})

export default Toolbar