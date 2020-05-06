import * as React from 'react'
import '../styles/ConnectionStatus.css'

interface Props {
  connection: WebSocket;
}

const ConnectionStatus: React.FC<Props> = ({ connection }) => {
  const { readyState } = connection;
  const [connectionState, setConnectionState] = React.useState(readyState);

  React.useEffect(() => {
    connection.onopen = () => setConnectionState(connection.readyState);
    connection.onclose = () => setConnectionState(connection.readyState);
  }, [connection]);

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    location.reload();
  }

  if (connectionState < 2) {
    return null;
  }

  return (
    <a className={"connectionStatus status-" + connectionState} onClick={onClick}>
      Disconnected
    </a>
  );
}

export default ConnectionStatus
