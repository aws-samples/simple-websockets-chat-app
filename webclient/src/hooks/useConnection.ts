import * as React from 'react'

const openConnection = (url: string): Promise<WebSocket> => {
  const socket = new WebSocket(url);
  return new Promise((resolve, reject) => {
    socket.onerror = reject;
    socket.onopen = () => resolve(socket);
  });
};

export default (serverUrl: string): WebSocket | undefined => {
  const [connection, setConnection] = React.useState<WebSocket>();

  React.useEffect(() => {
    let conn: WebSocket;
    const connect = async () => {
      conn = await openConnection(serverUrl);
      conn.onclose = () => {
        console.log('closing')
        setConnection(undefined);
      };
      setTimeout(() => conn.close(), 2000)
      setConnection(conn);
    }
    connect();

    return () => conn && conn.close();
  }, []);

  return connection;
}
