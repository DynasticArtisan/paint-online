import React, { useRef, useState } from 'react'
import toolState from '../store/toolState'
import '../styles/toolbar.scss'

export default function Settingsbar() {
    const [strokeColor, setStrokeColor] = useState('#000')
    const [lineWidth, setLineWidth] = useState(10)

    const lineWidthHandler = (width) => {
        toolState.setLineWidth(width)
        setLineWidth(width)
    }

    return (
        <div className="settingsbar" style={{boxShadow: `0 0 20px 10px ${strokeColor}`}} >
            <div className="setting">
                <label htmlFor="line-width" style={{color: '#fff'}}>Толщина линии: {lineWidth}</label>
                
                <input id="line-width" type="range" min="0" max="50" step="1" value={lineWidth} style={{margin: '0 10px', width:'200px'}} onChange={e => lineWidthHandler(e.target.value)}/> 
            </div>
            <div className="setting">
                <label htmlFor="stroke-color" style={{color: '#fff'}}>Цвет линии</label>
                <input id="stroke-color" type="color" className="toolbar__btn" onChange={e=>{setStrokeColor(e.target.value);toolState.setStrokeColor(e.target.value)}}/>
            </div>
            <div className="setting">
                <label htmlFor="fill-color" style={{color: '#fff'}}>Цвет заливки</label>
                <input id="fill-color" type="color" className="toolbar__btn" onChange={e=>toolState.setFillColor(e.target.value)}/>
            </div>
        </div>
    )
}
