import * as React from 'react'

interface WebManifestInterface {
  start_url?: string;
}

const BASE_MANIFEST = {
  "short_name": "dilo",
  "name": "dilo",
  "description": "Chat with the people around you",
  "dir": "auto",
  "lang": "en-US",
  "orientation": "any",
  "icons": [
    {
      "src": "/public/icon/dilo192.png",
      "type": "image/png",
      "sizes": "192x192"
    },
    {
      "src": "/public/icon/dilo.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ],
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#FFFFFF",
  "background_color": "#000000"
}

export const WebManifest: React.FC<WebManifestInterface> = ({ start_url }) => {
  React.useEffect(() => {
    const stringManifest = JSON.stringify({ ...BASE_MANIFEST, start_url });
    const blob = new Blob([stringManifest], { type: 'application/json' });
    const manifestURL = URL.createObjectURL(blob);
    document.querySelector('#manifest.webmanifest')?.setAttribute('href', manifestURL);
  }, [start_url]);
  return <></>;
}
