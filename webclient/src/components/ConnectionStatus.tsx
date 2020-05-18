import * as React from 'react'
import '../styles/ConnectionStatus.css'

import { ConnectionContext } from '../context/connectionContext';

const ConnectionStatus: React.FC = () => {
  const { isDisconnected } = React.useContext(ConnectionContext);

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    location.reload();
  }

  if (!isDisconnected) {
    return null;
  }

  return (
    <a className={"connectionStatus status-disconnected"} onClick={onClick}>
      Disconnected
    </a>
  );
}

export default ConnectionStatus
