import React from 'react'
import '../styles/notifications.scss'

export default function Notifications({data}) {


    return (
        <div className="notifications">
            {data.map(item => {
                return <div key={item.id} className="notification-item">{item.text}</div>
            })}
        </div>
    )
}
