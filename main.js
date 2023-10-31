import './style.css'

import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import * as TWEEN from 'tween.js'
import * as STATS from 'stats.js';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import { Vec3 } from 'cannon-es';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'

// Create a basic Tween
const tween = new TWEEN.Tween({ x: 0 })
  .to({ x: 100 }, 1000) // Animate 'x' from 0 to 100 over 1000 milliseconds
  .easing(TWEEN.Easing.Quadratic.Out) // Use a specific easing function
  .onUpdate(function (object) {
    // This function is called on each animation frame with the current 'x' value
    console.log(object.x);
  })
  .start(); // Start the animation


const gltfLoader = new GLTFLoader();
const scene = new THREE.Scene();
var fps = new STATS();
fps.showPanel(0);
document.body.appendChild(fps.dom);


const PhysicsMeshNumber = 2
const meshes = []

let positions = new Float32Array(PhysicsMeshNumber * 3);
let quaternions = new Float32Array(PhysicsMeshNumber * 4);

const worker = new Worker('worker-script.js',{type:"module"});
let sendTime


const timeStep = 1/60;

const camera = new THREE.PerspectiveCamera( 75 , window.innerWidth/window.innerHeight , 0.1 ,1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),antialias: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xedf1f9,0)
renderer.toneMapping = THREE.ReinhardToneMapping
renderer.toneMappingExposure = 2.3
renderer.shadowMap.enabled = true;
camera.updateProjectionMatrix();

camera.position.set(33.05096611496278,16.429911561969387,-81.41564670496722 )

scene.background = new THREE.Color(0xeeeeee)

renderer.render(scene,camera);

//ball
const Ball = new THREE.Mesh(
  new THREE.SphereGeometry(5),
  new THREE.MeshStandardMaterial({color:0xffffff,roughness:0,metalness:0.5})
  )
meshes.push(Ball)

var Cube;
gltfLoader.load('./assets/CubeCompanion/scene.gltf',function(gltf){
  const model = gltf.scene;
  model.scale.set(5,5,5);
  scene.add(model);
  Cube = model;
  Cube.castShadow = true
  Cube.rotateZ(90)
  Cube.traverse(n =>{
    if(n.isMesh){
      n.castShadow = true;
      n.receiveShadow = true;
      if(n.material.map) n.material.map.anisotropy = 16;
    }
  })
  spotLight.target = Cube;
  meshes.push(Cube)
})

//backrooms (background)
var background;
gltfLoader.load('./assets/Backrooms/scene.gltf', function (gltf) {
  const model = gltf.scene;
  model.scale.set(12, 12, 12);
  scene.add(model);
  background = model;
  console.log(logObjectHierarchy(background))

  background.traverse((object) => {
    if (object.isMesh) {
      const standardMaterial = new THREE.MeshStandardMaterial();
      if (object.material.map) {
        standardMaterial.map = object.material.map;
      }
      // Disable lighting for each material
      object.emissive = new THREE.Color(0.01); // You can use white emissive color to disable lighting
      object.needsUpdate = true;
      object.material = standardMaterial
    }
  });
});

scene.add(Ball)


//lights
const pointLight = new THREE.PointLight(0xffffff,5000)
const ambLight = new THREE.AmbientLight(0x666666,10)
const spotLight = new THREE.SpotLight(0xffffff,5000,100,1,0.3)
const directionalLight = new THREE.DirectionalLight(0xffffff,1.5)
spotLight.castShadow = true
spotLight.shadow.bias = -0.0001;
spotLight.shadow.mapSize.width = 1024*4
spotLight.shadow.mapSize.height = 1024*4


let isLightFlickering = true;
let targetIntensity = 10;
let flickerDuration = 300;
let lastFlickerTime = 0;
let flickerSpeedUpRate = 0.95;


pointLight.position.set (30,30,30)
spotLight.position.set (-window.innerWidth*0.005,50,40)
directionalLight.position.set(20,20,90)

const lightHelper = new THREE.PointLightHelper(pointLight)
const gridHelper = new THREE.GridHelper(200,50)
const spotHelper = new THREE.SpotLightHelper(spotLight)
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight)

const targetObject = new THREE.Object3D();
targetObject.position.set(-window.innerWidth*0.01,12,30);


spotLight.angle = 1570*0.00028
scene.add(spotLight,targetObject,ambLight)

const controls = new OrbitControls(camera,renderer.domElement)

const windowWidth = window.innerWidth;
function requestDataFromWorker() {
    sendTime = performance.now();

    // Create new Float32Arrays to avoid ArrayBuffer transfer issues
    const newPositionArray = new Float32Array(2 * 3);
    const newQuaternionArray = new Float32Array(2 * 4);

    // Send the new arrays to the worker
    worker.postMessage(
      {
        timeStep,
        positions: newPositionArray,
        quaternions: newQuaternionArray,
        windowWidth,
      },
      [newPositionArray.buffer, newQuaternionArray.buffer]
    );
}
worker.addEventListener('message', (event) => {
  // Get fresh data from the worker
  positions = event.data.positions
  quaternions = event.data.quaternions

  // Update the three.js meshes
  for (let i = 0; i < meshes.length; i++) {
    meshes[i].position.set(positions[i * 3 + 0], positions[i * 3 + 1], positions[i * 3 + 2])
    meshes[i].quaternion.set(
      quaternions[i * 4 + 0],
      quaternions[i * 4 + 1],
      quaternions[i * 4 + 2],
      quaternions[i * 4 + 3]
    )
  }

  // Delay the next step by the amount of timeStep remaining,
  // otherwise run it immediatly
  const delay = timeStep * 1000 - (performance.now() - sendTime)
  setTimeout(requestDataFromWorker, Math.max(delay, 0))
})
requestDataFromWorker()



function animate() {
  requestAnimationFrame(animate);

  controls.update
  fps.update();
  renderer.render(scene,camera);
  TWEEN.update();

  if( window.innerWidth<=1570 && window.innerWidth >=785)spotLight.angle = window.innerWidth*0.00028;
  //camera position log
  const cameraPosition = camera.position;
  const cameraX = cameraPosition.x;
  const cameraY = cameraPosition.y;
  const cameraZ = cameraPosition.z;
  // console.log(`Camera Position: x=${cameraX}, y=${cameraY}, z=${cameraZ}`);


}
animate()

window.addEventListener('resize', () => {
  const newWidth = window.innerWidth;
  const newHeight = window.innerHeight;
  if(newHeight>=800 && newWidth>=1000){
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
    targetObject.position.set(-newWidth*0.01,12,30)
    spotLight.position.setX(-newWidth*0.005)

  }
});

function logObjectHierarchy(parentObject, depth = 0, hierarchy = '') {
  hierarchy += ' '.repeat(depth * 4) + parentObject.name + '\n';

  parentObject.children.forEach((child) => {
    hierarchy = logObjectHierarchy(child, depth + 1, hierarchy);
  });

  return hierarchy;
}

