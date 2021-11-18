import "./style.css";
import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  PointLight,
  AmbientLight,
  AxesHelper,
  MeshStandardMaterial,
  Mesh,
  PCFSoftShadowMap,
  PlaneGeometry,
  BoxGeometry,
  MeshBasicMaterial,
  MeshDepthMaterial,
  MeshLambertMaterial,
  MeshNormalMaterial,
  SphereGeometry,
  MeshPhongMaterial,
  SpotLight,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { GlitchPass } from "three/examples/jsm/postprocessing/GlitchPass.js";

import Stats from "stats.js";

var stats = new Stats();
document.body.appendChild(stats.dom);

/* Init renderer and canvas */
const renderer = new WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

/* Main scene and camera */
const scene = new Scene();
const camera = new PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.y = 3;
camera.position.z = 5;
const controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotate = true;
controls.autoRotateSpeed = 0.5;
controls.enableDamping = true;
controls.target.set(0, 1, 0);

onResize();

/* Lights */
const ambientLight = new AmbientLight(0xffffff, 0.8);
const frontLight = new SpotLight(0xffffff, 1);
frontLight.castShadow = true;
frontLight.shadow.mapSize.width = 4096;
frontLight.shadow.mapSize.height = 4096;
frontLight.position.set(20, 20, 20);
scene.add(frontLight);
scene.add(ambientLight);

// Axes
const axesHelper = new AxesHelper();
scene.add(axesHelper);

// Plane
const plane = new Mesh(
  new PlaneGeometry(100, 100),
  new MeshStandardMaterial({ color: 0xffffff })
);
plane.rotation.x = -Math.PI / 2;
plane.receiveShadow = true;
scene.add(plane);

const box = new Mesh(
  new SphereGeometry(1),
  new MeshPhongMaterial({ color: "red", metalness: 0.7, roughness: 0 })
);
box.position.y = 0.5;
console.log(box);
scene.add(box);

/* Various event listeners */
window.addEventListener("resize", onResize);

/**
 Resize canvas
*/
function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
}

/**
 RAF
*/
function animate() {
  window.requestAnimationFrame(animate);
  render();
}

/**
 Render loop
 */
function render() {
  stats.begin();

  controls.update();
  renderer.render(scene, camera);

  stats.end();
}

animate();
