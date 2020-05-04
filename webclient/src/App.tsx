import * as React from 'react'
import './App.css'

interface Props {
  serverUrl: string;
  author: string;
  room: string | null;
}

const App:React.FC<Props> = ({serverUrl, author, room}) => (
  <div>
    <h1>Hello World from TypeScript! 📦 🚀</h1>
    <div>{serverUrl} {author} {room}</div>
  </div>
)

export default App;
