import * as THREE from "three";
import ThreeMeshUI from "three-mesh-ui";
import { VRButton } from "three/examples/jsm/webxr/VRButton.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { BoxLineGeometry } from "three/examples/jsm/geometries/BoxLineGeometry.js";
import { XRControllerModelFactory } from "three/examples/jsm/webxr/XRControllerModelFactory";
import { TextureLoader } from "three/src/loaders/TextureLoader.js";

import FontJSON from "/assets/Roboto-msdf.json";
import FontImage from "/assets/Roboto-msdf.png";
import image from "/assets/texture.jpg";
import videoSource from "/assets/barbie.mp4";

const texture = new THREE.TextureLoader().load(image);

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

let scene,
  camera,
  renderer,
  controls,
  vrButton,
  video,
  controllers = [],
  vrSession,
  raycaster,
  intersects,
  videoMesh,
  playButton, pauseText, playText, playState = true, idleStateAttributes;
const fontName = "Roboto";

window.addEventListener("load", preload);
window.addEventListener("resize", onWindowResize);

function preload() {
  const textureLoader = new TextureLoader();

  textureLoader.load(FontImage, (texture) => {
    ThreeMeshUI.FontLibrary.addFont(fontName, FontJSON, texture);

    init();
  });
}

function init() {
  scene = new THREE.Scene();
  //scene.background = new THREE.Color(0x505050);
  camera = new THREE.PerspectiveCamera(60, WIDTH / HEIGHT, 0.1, 100);

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(WIDTH, HEIGHT);
  renderer.xr.enabled = true;
  vrButton = VRButton.createButton(renderer);
  document.body.appendChild(vrButton);
  document.body.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  camera.position.set(0, 1.6, 3);
  controls.target = new THREE.Vector3(0, 1, -1.8);
  controls.update();

  vrSession = renderer.xr.getSession();

  controllers = buildControllers();

  function onSelectStart(event, controller) {
    //controller.children[0].scale.z = 10;
    const rotationMatrix = new THREE.Matrix4();
    rotationMatrix.extractRotation(controller.matrixWorld);
    raycaster = new THREE.Raycaster();
    raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
    raycaster.ray.direction.set(0, 0, -1).applyMatrix4(rotationMatrix);
    intersects = raycaster.intersectObjects([playButton]);
    console.log(intersects);
    if (intersects.length > 0) {
      console.log("polundra");
      if (video.paused) {
        video.play();
      playState = false;
      console.log(playButton.children)
      playText.setState('pause')
      } else {
        video.pause();
        playText.setState('play')
        playState = true;
      }
    }
  }

  controllers.forEach((controller) => {
    controller.addEventListener("selectstart", (event) =>
      onSelectStart(event, controller)
    );
  });

  createMenu();
  createPlayer();

  renderer.setAnimationLoop(loop);
}

function createMenu() {
  const container = new ThreeMeshUI.Block({
    width: 8.5,
    height: 8,
    padding: 0.05,
    borderRadius: 0.2,
    justifyContent: "end",
    textAlign: "center",
  });

  container.set({
    fontFamily: fontName,
    fontTexture: fontName,
  });

  container.position.set(0, 1, -5);
  //container.rotateY(100);
  scene.add(container);

  const innerContainer = new ThreeMeshUI.Block({
    width: 7,
    height: 2.3,
    padding: 0.05,
    borderRadius: 0.2,
    justifyContent: "space-around",
    textAlign: "center",
    contentDirection: "row",
  });

  playButton = new ThreeMeshUI.Block({
    width: 1.5,
    height: 1.5,
    backgroundOpacity: 1,
    backgroundColor: new THREE.Color(0x777777),
    justifyContent: "center",
    textAlign: "center",
    fontColor: new THREE.Color("white"),
  });

  idleStateAttributes = {
		
      fontColor: new THREE.Color( 'red' ),

    
	};

  const pauseTextAttributes = {
    content: 'Pause'
  }

  const playTextAttributes = {
    content: 'Play'
  }

  playText = new ThreeMeshUI.Text({
    content: 'Play',
    fontSize: 0.2,
  });

  playText.setupState({
    state: 'pause',
    attributes: pauseTextAttributes
  })
  playText.setupState({
    state: 'play',
    attributes: playTextAttributes
  })


  playButton.add(playText);

  const pauseButton = new ThreeMeshUI.Block({
    width: 1.5,
    height: 1.5,
    backgroundOpacity: 1,
    backgroundColor: new THREE.Color(0x777777),
    justifyContent: "center",
    textAlign: "center",
    fontColor: new THREE.Color("white"),
  });

  pauseText = new ThreeMeshUI.Text({
    content: "Pause",
    fontSize: 0.2,
  });

  pauseButton.add(pauseText);

  const nextButton = new ThreeMeshUI.Block({
    width: 1.5,
    height: 1.5,
    backgroundOpacity: 1,
    backgroundColor: new THREE.Color(0x777777),
    justifyContent: "center",
    textAlign: "center",
    fontColor: new THREE.Color("white"),
  });

  const nextText = new ThreeMeshUI.Text({
    content: "Next",
    fontSize: 0.2,
  });

  nextButton.add(nextText);

  const prevButton = new ThreeMeshUI.Block({
    width: 1.5,
    height: 1.5,
    backgroundOpacity: 1,
    backgroundColor: new THREE.Color(0x777777),
    justifyContent: "center",
    textAlign: "center",
    fontColor: new THREE.Color("white"),
  });

  const prevText = new ThreeMeshUI.Text({
    content: "Prev",
    fontSize: 0.2,
  });

  prevButton.add(prevText);

  innerContainer.add(nextButton, playButton, prevButton);

  container.add(innerContainer);
}

function createPlayer() {
  video = document.createElement("video");
  video.playsInline = true;
  video.preload = "auto";
  video.crossOrigin = "anonymous";
  video.controls = true;
  //video.poster = barbie;
  //video.autoplay = true;
  video.loop = true;
  video.style.display = "none";

  const source = document.createElement("source");
  source.type = "video/mp4";
  source.src = videoSource;

  document.body.appendChild(video);
  video.appendChild(source);

  const barbieVideo = new THREE.VideoTexture(video);
  barbieVideo.minFilter = THREE.LinearFilter;
  barbieVideo.magFilter = THREE.LinearFilter;
  barbieVideo.format = THREE.RGBAFormat;
  barbieVideo.needsUpdate = true;

  const width = 6.0;
  const height = 4.0;

  const videoGeo = new THREE.PlaneGeometry(width, height);
  const videoMat = new THREE.MeshBasicMaterial({ map: barbieVideo });
  videoMesh = new THREE.Mesh(videoGeo, videoMat);
  videoMesh.position.set(0, 2.3, -4.95);

  scene.add(videoMesh);
}

function buildControllers() {
  const controllerModelFactory = new XRControllerModelFactory();

  const geometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0, -1),
  ]);

  const line = new THREE.Line(geometry);
  line.scale.z = 10;

  for (let i = 0; i < 2; i++) {
    const controller = renderer.xr.getController(i);
    controller.add(line.clone());
    controller.userData.selectPressed = false;
    controller.userData.selectPressedPrev = false;
    scene.add(controller);
    controllers.push(controller);

    const grip = renderer.xr.getControllerGrip(i);
    grip.add(controllerModelFactory.createControllerModel(grip));
    scene.add(grip);
  }

  return controllers;
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function loop() {
  ThreeMeshUI.update();

  controls.update();
  renderer.render(scene, camera);
}
