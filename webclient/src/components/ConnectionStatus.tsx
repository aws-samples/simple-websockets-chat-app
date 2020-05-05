import * as React from 'react'

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

  return (
    <a className={"connectionStatus status-" + connectionState}
      onClick={onClick}>
      {connectionState < 2 ? "Connected" : "Disconnected"}
    </a>
  );
}

export default ConnectionStatus
