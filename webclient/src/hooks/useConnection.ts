import * as React from 'react'
import log from '../helpers/log'

export default (url: string): WebSocket => {
  const [connection] = React.useState(new WebSocket(url));
  connection.addEventListener('open', () => log('onopen'));
  connection.addEventListener('close', () => log('onclose'));
  connection.addEventListener('error', () => log('onerror'));

  React.useEffect(() => {
    log('opening connection', connection);
    return () => {
      log('closing connection');
      connection.close();
    }
  }, []);

  return connection;
}
