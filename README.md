# Webxr-vr-videoplayer-js - virtual reality videoplayer (JS Vanilla)

## Deployment: [https://harry177.github.io/webxr-vr-videoplayer-js/](https://harry177.github.io/webxr-vr-videoplayer-js/)

## Functionality

- **VR 3D videoplayer interaction:** The videoplayer is a plane 3D object with videotexture and buttons on the front side. Users can interact with player, using vr-controllers. If ray of controller intersects "Play" button and user pushes a select button on controller - video starts and button text changes to "Pause". Next select event on this button will stop the video and button text will change to "Play". If ray intersects "Next" or "Prev" button and user pushes a select button on controller - video switches to next or previous. In case video is in paused state and has not yet started playing - a poster is shown. Moreover, ray intersections with buttons cause hover effects.

## Technology stack

The project was developed using the WebXR technology, javascript, THREE.js and three-mesh-ui library for plane GUI in VR space.

## Usage 

To try app - clone this repo, install all dependencies and start it "npm run start" - it concurrently launches client and server.

## Restrictions

Before use please make sure your device supports WebXR (VR). If you don't have any - download a browser extension called WebXR API Emulator (Chrome, Mozilla). It permits you use virtual headset and controllers in emulated virtual reality and is available in browser developer mode.

## Author

Artem Prygunov
