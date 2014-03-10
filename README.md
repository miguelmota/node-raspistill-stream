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

```bash
node server.js
```

## License

Released under the MIT License.
