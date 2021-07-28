import React, { useRef, useState } from 'react'
import canvasState from '../store/canvasState'
import '../styles/modal.scss'
export default function Modal() {
    const [modal, setModal] = useState(true)
    const nameRef = useRef()
    const connectHandler = () => {
        canvasState.setUsername(nameRef.current.value)
        setModal(false)
    }
    
    return (
        modal && <div className="modal">
            <div className="modal-card">
                <div className="modal-header">Введите свое имя:</div>
                <input ref={nameRef} type="text" className="modal-input" placeholder="ваше имя..."
            
                />
                <button className="modal-button" onClick={()=>connectHandler()}>Готово</button>
            </div>
        </div>
    )
}
