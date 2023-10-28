import './style.css'

import * as THREE from 'three';
import * as CANNON from 'cannon-es';

import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import { Vec3 } from 'cannon-es';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'

const gltfLoader = new GLTFLoader();

const scene = new THREE.Scene();


const N = 2
let positions = new Float32Array(2 * 3);
let quaternions = new Float32Array(2 * 4);
positions.fill(1);
quaternions.fill(1);
console.log(positions[0])

const worker = new Worker('worker-script.js',{type:"module"});

let sendTime
const meshes = []
// -20.81

const timeStep = 1/60;
const maxSubSteps = 3;
const interval = 1000 / 60;

const sWidth = window.innerWidth
const sHeight = window.innerHeight

const camera = new THREE.PerspectiveCamera( 75 , window.innerWidth/window.innerHeight , 0.1 ,1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),antialias: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xedf1f9,0)
renderer.shadowMap.enabled = true;
camera.updateProjectionMatrix();

camera.position.set(3.2,25,75 )

scene.background = new THREE.Color(0xeeeeee)

renderer.render(scene,camera);

//ball
const Ball = new THREE.Mesh(
  new THREE.SphereGeometry(5,150,200),
  new THREE.MeshStandardMaterial({color:0xffffff,roughness:0,metalness:0.5})
  )


//cube
// var Cube;
// gltfLoader.load('./assets/scene.gltf',function(gltf){
//   const model = gltf.scene;
//   model.scale.set(5,5,5);
//   scene.add(model);
//   Cube = model;
//   Cube.castShadow = true
//   Cube.rotateZ(90)
// })
// if (Cube) {
//   spotLight.target = Cube;
// }
// meshes.push(Cube)
meshes.push(Ball)



//plane
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(600,600),
  new THREE.MeshStandardMaterial({color:0xffffff,roughness:0,metalness:0.5})
)
plane.rotateX(-Math.PI/2)


//wall
const wallGeometry = new THREE.PlaneGeometry(600,600)
const wallMaterial = new THREE.MeshStandardMaterial({color:0xffffff,roughness:1,metalness:0.5})
const wall = new THREE.Mesh(wallGeometry,wallMaterial)


plane.receiveShadow = true;
wall.receiveShadow = true;
scene.add(plane,wall,Ball)


//lights
const pointLight = new THREE.PointLight(0xffffff,5000)
const ambLight = new THREE.AmbientLight(0xffffff)
const spotLight = new THREE.SpotLight(0xffffff,5000,100,1,0.3)
const directionalLight = new THREE.DirectionalLight(0xffffff,0.005)
spotLight.castShadow = true

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
scene.add(spotLight,targetObject,directionalLight)

const controls = new OrbitControls(camera,renderer.domElement)


function requestDataFromWorker() {
  if (Ball) { // Ensure Cube is defined
    sendTime = performance.now();
    worker.postMessage(
      {
        timeStep,
        positions,
        quaternions,
      },
      // Specify that we want actually transfer the memory, not copy it over. This is faster.
      [positions.buffer, quaternions.buffer]
    );
  }
};

worker.addEventListener('message', (event) => {
  // Get fresh data from the worker
  positions = event.data.positions
  quaternions = event.data.quaternions
  console.log("working")
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
  console.log("message back from worker")
})


requestDataFromWorker()


function animate() {
  console.log('animate')
  worker.postMessage("Hello from the main thread!");
  requestAnimationFrame(animate);

  controls.update
  renderer.render(scene,camera);

  if (Ball) {
    spotLight.target = Ball;
  }

  // spotLight.position.setX(cubeBody.position.x+10)
  if( window.innerWidth<=1570 && window.innerWidth >=785)spotLight.angle = window.innerWidth*0.00028;
  //camera position log
  const cameraPosition = camera.position;
  const cameraX = cameraPosition.x;
  const cameraY = cameraPosition.y;
  const cameraZ = cameraPosition.z;
  // console.log(`Camera Position: x=${cameraX}, y=${cameraY}, z=${cameraZ}`);

  
}

animate()
//(-40,14,30)


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


// function delayedLoop(iterations, delay) {
//   let count = 0;

//   function loop() {
//     if (count < iterations) {
//         setTimeout(loop, delay);
//         cubeBody.applyForce(
//           new CANNON.Vec3(500000,0,0),
//           new CANNON.Vec3(0,0,0)
//         )

//         count++;
//       }
//   }

//   loop();
// }

// delayedLoop(5,970)

// Ball Launch button






//fps counter

const times = [];
let fps;

function refreshLoop() {
  window.requestAnimationFrame(() => {
    const now = performance.now();
    while (times.length > 0 && times[0] <= now - 1000) {
      times.shift();
    }
    times.push(now);
    fps = times.length;
    document.getElementById("fps-counter").textContent = fps
    refreshLoop();
  });
}
refreshLoop();