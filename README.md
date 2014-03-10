# Node raspistill stream

All this does is start a `raspistill` process to continously write images to `/tmp/stream` so that node can read in those images and send them to the browser via a socket stream using [BinaryJS](https://github.com/binaryjs/binaryjs).

Experimental use.

## Dependencies

- Raspberry PI camera module
- raspistill

## Install

```
git clone https://github.com/miguelmota/node-raspistill-stream
```

## Usage

Make sure to update the host url in `index.html` to match your RPI's IP address.

Run

```bash
node server.js
```

then navigate to `http://<your RPI's ip>:9000/` to view the stream of images.

## License

Released under the MIT License.
