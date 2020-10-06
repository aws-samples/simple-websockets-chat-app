import * as React from 'react'
import { NavLink, Redirect } from 'react-router-dom'
import { colorFromUuid } from '../helpers/color'
import { getRoomIdsWithoutHome } from '../store'
import './Rooms.css'


export const Rooms = () => {
  const rooms = getRoomIdsWithoutHome()

  if (rooms.length === 1) {
    return <Redirect to={`/r/` + rooms[0]} />
  }

  return <div className="room">
    <ul className="rooms__list">{
      rooms.length
        ? rooms.map(room => (
          <li key={room} className="rooms__list-element">
            <NavLink to={`/r/${room}`} className="rooms__list-element__anchor" style={{ position: 'relative' }}>
              <div style={{ position: 'absolute' }}>
                <svg viewBox="0 0 50 50" height="60px" style={{ position: 'relative', display: 'inline-flex' }}>
                <circle r="25" cx="25" cy="25" fill={colorFromUuid(room)}></circle>
                <text fill="white" x={11} y={32} style={{ fontSize: 24, fontWeight: 'bold', mixBlendMode: 'difference'}}>{room.substr(0,2).toLocaleUpperCase()}</text>
              </svg>
              </div>

              <p className="rooms__list-element__text">{room}</p>
            </NavLink>
          </li>
        ))
        : <li>You have no rooms</li>}
    </ul>
  </div>
}
