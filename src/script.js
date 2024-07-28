import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Timer } from "three/addons/misc/Timer.js";
import GUI from "lil-gui";
import { Sky } from "three/examples/jsm/Addons.js";

//audio
const listener = new THREE.AudioListener();

//TEXTURES
const textureLoader = new THREE.TextureLoader();

//Floor
const floorAlphaTexture = textureLoader.load("./floor/alpha.webp");
const floorColorTexture = textureLoader.load(
  "./floor/textures/floor_diff.webp"
);
const floorNormalTexture = textureLoader.load(
  "./floor/textures/floor_norm.webp"
);
const floorARMTexture = textureLoader.load("./floor/textures/floor_arm.webp");
const floorDisplacementTexture = textureLoader.load(
  "./floor/textures/floor_disp.webp"
);

floorColorTexture.colorSpace = THREE.SRGBColorSpace;

floorColorTexture.repeat.set(8, 8);
floorDisplacementTexture.repeat.set(8, 8);
floorNormalTexture.repeat.set(8, 8);
floorARMTexture.repeat.set(8, 8);

floorColorTexture.wrapS = THREE.RepeatWrapping;
floorDisplacementTexture.wrapS = THREE.RepeatWrapping;
floorNormalTexture.wrapS = THREE.RepeatWrapping;
floorARMTexture.wrapS = THREE.RepeatWrapping;

floorColorTexture.wrapT = THREE.RepeatWrapping;
floorDisplacementTexture.wrapT = THREE.RepeatWrapping;
floorNormalTexture.wrapT = THREE.RepeatWrapping;
floorARMTexture.wrapT = THREE.RepeatWrapping;

//Walls
const wallColorTexture = textureLoader.load("./wall/wall_bricks_diff.webp");
const wallNormalTexture = textureLoader.load("./wall/wall_bricks_nor.webp");
const wallARMTexture = textureLoader.load("./wall/wall_bricks_arm.webp");

wallColorTexture.colorSpace = THREE.SRGBColorSpace;

//Roof
const roofColorTexture = textureLoader.load("./roof/textures/roof_diff.webp");
const roofNormalTexture = textureLoader.load("./roof/textures/roof_nor.webp");
const roofARMTexture = textureLoader.load("./roof/textures/roof_arm.webp");

roofColorTexture.colorSpace = THREE.SRGBColorSpace;

roofColorTexture.repeat.set(3, 1);
roofNormalTexture.repeat.set(3, 1);
roofARMTexture.repeat.set(3, 1);

roofColorTexture.wrapS = THREE.RepeatWrapping;
roofNormalTexture.wrapS = THREE.RepeatWrapping;
roofARMTexture.wrapS = THREE.RepeatWrapping;

//Bush
const bushColorTexture = textureLoader.load("./bush/textures/forest_diff.webp");
const bushNormalTexture = textureLoader.load("./bush/textures/forest_nor.webp");
const bushARMTexture = textureLoader.load("./bush/textures/forest_arm.webp");

bushColorTexture.colorSpace = THREE.SRGBColorSpace;

//Grave
const graveColorTexture = textureLoader.load(
  "./grave/textures_2/grave_diff.webp"
);
const graveNormalTexture = textureLoader.load(
  "./grave/textures_2/grave_nor.webp"
);
const graveARMTexture = textureLoader.load("./grave/textures/grave_arm.webp");

graveColorTexture.colorSpace = THREE.SRGBColorSpace;

graveColorTexture.repeat.set(0.3, 0.4);
graveNormalTexture.repeat.set(0.3, 0.4);
graveARMTexture.repeat.set(0.3, 0.4);

//Door

const doorColorTexture = textureLoader.load("./door/color.webp");
const doorNormalTexture = textureLoader.load("./door/normal.webp");
const doorMetalnessTexture = textureLoader.load("./door/metalness.webp");
const doorRoughnessTexture = textureLoader.load("./door/roughness.webp");
const doorAlphaTexture = textureLoader.load("./door/alpha.webp");
const doorHeightTexture = textureLoader.load("./door/height.webp");
const doorAmbientOcclusionTexture = textureLoader.load(
  "./door/ambientOcclusion.webp"
);

doorColorTexture.colorSpace = THREE.SRGBColorSpace;

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

//Axes Helper
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

//floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20, 100, 100),
  new THREE.MeshStandardMaterial({
    alphaMap: floorAlphaTexture,
    transparent: true,
    map: floorColorTexture,
    aoMap: floorARMTexture,
    roughnessMap: floorARMTexture,
    metalnessMap: floorARMTexture,
    normalMap: floorNormalTexture,
    displacementMap: floorDisplacementTexture,
    displacementScale: 0.3,
    displacementScale: -0.2,
  })
);

gui
  .add(floor.material, "displacementScale")
  .min(0)
  .max(1)
  .step(0.001)
  .name("floorDisplacementScale");

gui
  .add(floor.material, "displacementBias")
  .min(-1)
  .max(1)
  .step(0.001)
  .name("floorDisplacementBias");
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

//house container
const house = new THREE.Group();
scene.add(house);

//walls
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: wallColorTexture,
    roughnessMap: wallARMTexture,
    metalnessMap: wallARMTexture,
    aoMap: wallARMTexture,
    normalMap: wallNormalTexture,
  })
);
walls.position.y += 2.5 / 2;
house.add(walls);

//roof
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 1.5, 4),
  new THREE.MeshStandardMaterial({
    map: roofColorTexture,
    aoMap: roofARMTexture,
    roughnessMap: roofARMTexture,
    metalnessMap: roofARMTexture,
    normalMap: roofNormalTexture,
  })
);
roof.position.y = 2.5 + 0.75;
roof.rotation.y = Math.PI / 4;
house.add(roof);

//door
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    roughnessMap: doorRoughnessTexture,
    metalnessMap: doorMetalnessTexture,
    alphaMap: doorAlphaTexture,
    transparent: true,
    displacementMap: doorHeightTexture,
    displacementScale: 0.15,
    displacementBias: -0.04,
    normalMap: doorNormalTexture,
    aoMap: doorAmbientOcclusionTexture,
  })
);
door.position.y = 1;
door.position.z = 2 + 0.01;
house.add(door);

//Bushes

const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({
  color: "#ccffcc",
  map: bushColorTexture,
  normalMap: bushNormalTexture,
  aoMap: bushARMTexture,
  roughnessMap: bushARMTexture,
  metalnessMap: bushARMTexture,
});

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.2);
bush1.rotation.x = -0.75;

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);
bush2.rotation.x = -0.75;

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-0.8, 0.1, 2.2);
bush3.rotation.x = -0.75;

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1, 0.05, 2.6);
bush4.rotation.x = -0.75;

house.add(bush1, bush2, bush3, bush4);

///Graves

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({
  map: graveColorTexture,
  normalMap: graveNormalTexture,
  aoMap: graveARMTexture,
  roughnessMap: graveARMTexture,
  metalnessMap: graveARMTexture,
});

const graves = new THREE.Group();
scene.add(graves);

for (let i = 0; i < 30; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = 3 + Math.random() * 4;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;
  const grave = new THREE.Mesh(graveGeometry, graveMaterial);
  grave.position.x = x;
  grave.position.y = Math.random() * 0.4;
  grave.position.z = z;
  grave.rotation.x = (Math.random() - 0.5) * 0.4;
  grave.rotation.y = (Math.random() - 0.5) * 0.4;
  grave.rotation.z = (Math.random() - 0.5) * 0.4;

  graves.add(grave);
}
/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight("#86cdff", 0.275);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight("#86cdff", 1);
directionalLight.position.set(3, 2, -8);
scene.add(directionalLight);

//door Light
const doorLight = new THREE.PointLight("#ff7d46", 5);
doorLight.position.set(0, 2.2, 2.5);
house.add(doorLight);

const inHouseLight = new THREE.PointLight("#ffffff", 3);
inHouseLight.position.set(0, 0, 1.25);
house.add(inHouseLight);

/***
 *
 * Ghosts
 */
const ghostGeometry = new THREE.SphereGeometry(0.5, 8, 8);
const ghostMaterial = new THREE.MeshStandardMaterial({
  color: "#ffffff",
  opacity: 0.5,
  transparent: true,
  emissive: "#8800ff",
});
const ghost2Material = new THREE.MeshStandardMaterial({
  color: "#ffffff",
  opacity: 0.6,
  transparent: true,
  emissive: "#ff0088",
});
const ghost3Material = new THREE.MeshStandardMaterial({
  color: "#ffffff",
  opacity: 0.7,
  transparent: true,
  emissive: "#ff0000",
});

const ghostInMaterial = new THREE.MeshStandardMaterial({
  color: "#ffffff",
  opacity: 1,
  emissive: "#8800ff",
});
const ghost2InMaterial = new THREE.MeshStandardMaterial({
  color: "#ffffff",
  opacity: 1,
  emissive: "#ff0088",
});
const ghost3InMaterial = new THREE.MeshStandardMaterial({
  color: "#ffffff",
  opacity: 1,
  emissive: "#ff0000",
});

const ghost1 = new THREE.Group();
const ghost2 = new THREE.Group();
const ghost3 = new THREE.Group();

const ghost1Light = new THREE.PointLight("#8800ff", 6);
const ghost2Light = new THREE.PointLight("#ff0088", 6);
const ghost3Light = new THREE.PointLight("#ff0000", 6);

const ghost1Body = new THREE.Mesh(ghostGeometry, ghostMaterial);
const ghost2Body = new THREE.Mesh(ghostGeometry, ghost2Material);
const ghost3Body = new THREE.Mesh(ghostGeometry, ghost3Material);

const ghost1BodyIn = new THREE.Mesh(ghostGeometry, ghostInMaterial);
const ghost2BodyIn = new THREE.Mesh(ghostGeometry, ghost2InMaterial);
const ghost3BodyIn = new THREE.Mesh(ghostGeometry, ghost3InMaterial);

ghost1BodyIn.scale.set(0.6, 0.6, 0.6);
ghost2BodyIn.scale.set(0.4, 0.4, 0.4);
ghost3BodyIn.scale.set(0.2, 0.2, 0.2);

ghost2Body.scale.set(0.6, 0.6, 0.6);
ghost3Body.scale.set(0.4, 0.4, 0.6);
2;
ghost1.add(ghost1Body, ghost1BodyIn, ghost1Light);
ghost2.add(ghost2Body, ghost2BodyIn, ghost2Light);
ghost3.add(ghost3Body, ghost3BodyIn, ghost3Light);

scene.add(ghost1, ghost2, ghost3);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//Shadows

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

directionalLight.castShadow = true;
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;

walls.castShadow = true;
walls.receiveShadow = true;
roof.castShadow = true;
floor.receiveShadow = true;

for (const grave of graves.children) {
  grave.castShadow = true;
  grave.receiveShadow = true;
}

//Mapping
directionalLight.shadow.mapSize.width = 256;
directionalLight.shadow.mapSize.height = 256;
directionalLight.shadow.camera.top = 8;
directionalLight.shadow.camera.right = 8;
directionalLight.shadow.camera.bottom = -8;
directionalLight.shadow.camera.left = -8;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 20;

ghost1Light.shadow.mapSize.width = 256;
ghost1Light.shadow.mapSize.height = 256;
ghost1Light.shadow.camera.far = 10;

ghost2Light.shadow.mapSize.width = 256;
ghost2Light.shadow.mapSize.height = 256;
ghost2Light.shadow.camera.far = 10;

ghost3Light.shadow.mapSize.width = 256;
ghost3Light.shadow.mapSize.height = 256;
ghost3Light.shadow.camera.far = 10;

//Sky
const sky = new Sky();
sky.scale.set(100, 100, 100);
scene.add(sky);

sky.material.uniforms["turbidity"].value = 10;
sky.material.uniforms["rayleigh"].value = 3;
sky.material.uniforms["mieCoefficient"].value = 0.1;
sky.material.uniforms["mieDirectionalG"].value = 0.95;
sky.material.uniforms["sunPosition"].value.set(0.3, -0.038, -0.95);

//fog
scene.fog = new THREE.FogExp2("#86cdff", 0.1);

//Sound
ghost1.add(listener);
ghost2.add(listener);
const sound1 = new THREE.Audio(listener);
const sound2 = new THREE.Audio(listener);
const audioLoader = new THREE.AudioLoader();
audioLoader.load("./sound/classic-ghost.mp3", (buffer) => {
  sound1.setBuffer(buffer);
  sound1.setLoop(true);
  sound1.setVolume(0.4);
  sound1.play();
});

audioLoader.load("./sound/ghost-6979.mp3", (buffer) => {
  sound2.setBuffer(buffer);
  sound2.setLoop(true);
  sound2.setVolume(1);
  sound2.play();
});

/**
 * Animate
 */
const timer = new Timer();

const tick = () => {
  // Timer
  timer.update();
  const elapsedTime = timer.getElapsed();

  //Ghosts
  const ghost1Angle = elapsedTime * 0.5;
  ghost1.position.x = Math.cos(ghost1Angle) * 4;
  ghost1.position.z = Math.sin(ghost1Angle) * 4;
  ghost1.position.y =
    Math.sin(ghost1Angle) *
    Math.sin(ghost1Angle * 2.34) *
    Math.sin(ghost1Angle * 3.45);

  const ghost2Angle = -elapsedTime * 0.38;
  ghost2.position.x = Math.cos(ghost2Angle) * 4;
  ghost2.position.z = Math.sin(ghost2Angle) * 4;
  ghost2.position.y =
    Math.sin(ghost2Angle) *
    Math.sin(ghost2Angle * 2.34) *
    Math.sin(ghost2Angle * 3.45);

  const ghost3Angle = -elapsedTime * 0.7;
  ghost3.position.x = Math.cos(ghost3Angle) * 6;
  ghost3.position.z = Math.sin(ghost3Angle) * 6;
  ghost3.position.y =
    Math.sin(ghost3Angle) *
    Math.sin(ghost3Angle * 2.34) *
    Math.sin(ghost3Angle * 3.45);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
