import * as React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { getData } from '../store'

export const Rooms = () => {
  const rooms: string[] = Object.keys(getData().rooms)

  return <div>
    <h1>Your rooms</h1>
    <ul>{
      rooms.length
        ? rooms.map(room => (
          <li key={room}>
            <NavLink to={`/r/${room}`}>{room}</NavLink>
          </li>
        ))
        : <li>You have no rooms</li>}
    </ul>
  </div>
}