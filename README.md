# tidalSocket

A hacky little thing that forwards OSC messages from Tidal over a WebSocket.

# Instructions

You run Tidal but not Dirt. Instead of running Dirt you run tidalSocket. It receives the messages that would have gone to dirt and instead sends them to any subscribers to a WebSocket connection.

Thanks to Alex McLean and others for their work on Tidal and Dirt, and to Colin Clark for his OSC library!

To install dependencies, after you clone the repository: npm install

To run: node tidalSocket.js
