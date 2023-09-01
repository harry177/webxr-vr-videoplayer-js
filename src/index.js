import * as THREE from "three";
import ThreeMeshUI from "three-mesh-ui";
import { VRButton } from "three/examples/jsm/webxr/VRButton.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { BoxLineGeometry } from "three/examples/jsm/geometries/BoxLineGeometry.js";
import { TextureLoader } from "three/src/loaders/TextureLoader.js";

import FontJSON from "/assets/Roboto-msdf.json";
import FontImage from "/assets/Roboto-msdf.png";

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

let scene, camera, renderer, controls;
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
  scene.background = new THREE.Color(0x505050);
  camera = new THREE.PerspectiveCamera(60, WIDTH / HEIGHT, 0.1, 100);

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(WIDTH, HEIGHT);
  renderer.xr.enabled = true;
  document.body.appendChild(VRButton.createButton(renderer));
  document.body.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  camera.position.set(0, 1.6, 3);
  controls.target = new THREE.Vector3(0, 1, -1.8);
  controls.update();

  createMenu();

  renderer.setAnimationLoop(loop);
}

function createMenu() {
  const container = new ThreeMeshUI.Block({
    width: 5,
    height: 7,
    padding: 0.05,
    borderRadius: 0.2,
    justifyContent: "space-around",
    textAlign: "center",
  });

  container.set({
    fontFamily: fontName,
    fontTexture: fontName,
  });

  container.position.set(4, 1, -5);
  container.rotateY(100)
  scene.add(container);

  const innerContainerOne = new ThreeMeshUI.Block({
    width: 5,
    height: 2.3,
    padding: 0.05,
    borderRadius: 0.2,
    justifyContent: "center",
    textAlign: "center",
  });
  const innerContainerTwo = new ThreeMeshUI.Block({
    width: 5,
    height: 2.3,
    padding: 0.05,
    borderRadius: 0.2,
    justifyContent: "space-around",
    contentDirection: "row",
    textAlign: "center",
  });
  const innerContainerThree = new ThreeMeshUI.Block({
    width: 5,
    height: 2.3,
    padding: 0.05,
    borderRadius: 0.2,
    justifyContent: "center",
    textAlign: "center",
  });

  const playButton = new ThreeMeshUI.Block({
    width: 1.5,
    height: 1.5,
    backgroundOpacity: 1,
    backgroundColor: new THREE.Color(0x777777),
    justifyContent: "center",
    textAlign: "center",
    fontColor: new THREE.Color("white"),
  });

  const playText = new ThreeMeshUI.Text({
    content: "Play",
    fontSize: 0.2,
  });

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

  const pauseText = new ThreeMeshUI.Text({
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

  innerContainerOne.add(playButton);
  innerContainerTwo.add(nextButton, prevButton);
  innerContainerThree.add(pauseButton);

  container.add(innerContainerOne, innerContainerTwo, innerContainerThree);
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
