import * as THREE from "three";
import ThreeMeshUI from "three-mesh-ui";
import { VRButton } from "three/examples/jsm/webxr/VRButton.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { BoxLineGeometry } from "three/examples/jsm/geometries/BoxLineGeometry.js";
import { TextureLoader } from "three/src/loaders/TextureLoader.js";

import FontJSON from "/assets/Roboto-msdf.json";
import FontImage from "/assets/Roboto-msdf.png";
import image from "/assets/texture.jpg";
import videoSource from "/assets/barbie.mp4";

const texture = new THREE.TextureLoader().load(image);

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

let scene, camera, renderer, controls, vrButton, video, controllers, vrSession;
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
    controllers = renderer.xr.getController([0, 1])

    console.log(controllers);

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

  const playButton = new ThreeMeshUI.Block({
    width: 1.5,
    height: 1.5,
    backgroundOpacity: 1,
    backgroundColor: new THREE.Color(0x777777),
    justifyContent: "center",
    textAlign: "center",
    fontColor: new THREE.Color("white"),
  });

  playButton.addEventListener("select", () => {
    barbieVideo.needsUpdate = true;
    video.play();
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

  innerContainer.add(nextButton, playButton, prevButton);

  container.add(innerContainer);
}

function createPlayer() {
  /*const width = 6.0;
  const height = 4.0;
  const depth = 1.5;

  const geometry = new THREE.BoxGeometry(width, height, depth);
  const boxMat = new THREE.MeshBasicMaterial({ map: texture });
  const boxMesh = new THREE.Mesh(geometry, boxMat);
  boxMesh.position.set(-4, 1, -5);
  boxMesh.rotateY(10);

  scene.add(boxMesh);*/

  video = document.createElement("video");
  video.playsInline = true;
  video.preload = "auto";
  video.crossOrigin = "anonymous";
  video.controls = true;
  //video.poster = barbie;
  video.autoplay = true;
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
  const videoMesh = new THREE.Mesh(videoGeo, videoMat);
  videoMesh.position.set(0, 2.3, -4.95);

  scene.add(videoMesh);

  /*vrButton.addEventListener("click", function () {
    barbieVideo.needsUpdate = true;
    video.play();
    console.log("polundra");
  });*/
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

  if (vrSession) {
    const frameOfReferenceType = 'stage'; // Или 'head-model' для отображения контроллеров относительно модели головы
    const referenceSpace = vrSession.requestReferenceSpace(frameOfReferenceType);
    const frame = vrSession.requestAnimationFrame(function (timestamp, frame) {
      const pose = frame.getViewerPose(referenceSpace);

      if (pose) {
        const inputSources = Array.from(vrSession.inputSources);
        inputSources.forEach(function (inputSource) {
          const inputPose = frame.getPose(inputSource.targetRaySpace, referenceSpace);
          if (inputPose) {
            const controllerMesh = controllers.find((controller) => controller.inputSource === inputSource);
          
            if (controllerMesh) {
              // Если у вас есть модель контроллера, вы можете обновить ее позицию и ориентацию
              controllerMesh.position.copy(inputPose.transform.position);
              controllerMesh.quaternion.copy(inputPose.transform.orientation);
            } else {
              // Если у вас нет модели контроллера, вы можете создать и отобразить собственное представление
              const controllerGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
              const controllerMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
              const controllerMesh = new THREE.Mesh(controllerGeometry, controllerMaterial);
              controllerMesh.position.copy(inputPose.transform.position);
              controllerMesh.quaternion.copy(inputPose.transform.orientation);
              scene.add(controllerMesh);
          
              // Сохраните ссылку на контроллер, чтобы можно было обновлять его позицию и ориентацию на каждом кадре
              controllerMesh.inputSource = inputSource;
              controllers.push(controllerMesh);
            }
          }
        });
      }
    });
  }
}
