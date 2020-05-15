import * as React from 'react'
import log from '../helpers/log'

export default (url: string): WebSocket => {
  const [connection] = React.useState(new WebSocket(url));

  React.useEffect(() => {
    log('opening connection');
    return () => {
      log('closing connection');
      connection.close();
    }
  }, []);

  return connection;
}
