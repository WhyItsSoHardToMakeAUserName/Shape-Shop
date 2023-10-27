import './style.css'

import * as THREE from 'three';
import * as CANNON from 'cannon-es';

import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import { Vec3 } from 'cannon-es';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'

const gltfLoader = new GLTFLoader();
const myWorker = new Worker('worker-script.js');

const scene = new THREE.Scene();
const world = new CANNON.World({
  gravity: new CANNON.Vec3(0,-20.81,0)
})

// -20.81

const timeStep = 1/60;
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
const BallBody = new CANNON.Body({
  shape: new CANNON.Sphere(5),
  mass:1000,
  position: new CANNON.Vec3(100,5,30)
})
world.addBody(BallBody)

//cube
var Cube;
gltfLoader.load('./assets/scene.gltf',function(gltf){
  const model = gltf.scene;
  model.scale.set(5,5,5);
  scene.add(model);
  Cube = model;
  Cube.castShadow = true
  Cube.rotateZ(90)
})
if (Cube) {
  spotLight.target = Cube;
}

const cubeBody = new CANNON.Body({
  shape: new CANNON.Box(new CANNON.Vec3(5,5,5)),
  mass:1000,
  position: new CANNON.Vec3(-sWidth*0.001-48,5,30)
  
})
world.addBody(cubeBody)



//plane
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(600,600),
  new THREE.MeshStandardMaterial({color:0xffffff,roughness:0,metalness:0.5})
)

const planeBody = new CANNON.Body({
  shape: new CANNON.Plane(),
  type: CANNON.Body.STATIC
})
planeBody.quaternion.setFromEuler(-Math.PI / 2,0,0)
world.addBody(planeBody)

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

function animate(){
  requestAnimationFrame( animate );
  controls.update
  renderer.render(scene,camera);

  world.step(timeStep)

  plane.position.copy(planeBody.position);
  plane.quaternion.copy(planeBody.quaternion);

  if (Cube) {
    spotLight.target = Cube;
  }
  
  Cube.position.copy(cubeBody.position)
  Cube.quaternion.copy(cubeBody.quaternion)

  Ball.position.copy(BallBody.position);
  Ball.quaternion.copy(BallBody.quaternion);

  spotLight.position.setX(cubeBody.position.x+10)
  if( window.innerWidth<=1570 && window.innerWidth >=785)spotLight.angle = window.innerWidth*0.00028;
  //camera position log
  const cameraPosition = camera.position;
  const cameraX = cameraPosition.x;
  const cameraY = cameraPosition.y;
  const cameraZ = cameraPosition.z;
  console.log(`Camera Position: x=${cameraX}, y=${cameraY}, z=${cameraZ}`);

  refreshLoop();
  document.getElementById("fps-counter").textContent = fps
}

window.requestAnimationFrame( animate );
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

  
  

  console.log(newWidth)
});


function delayedLoop(iterations, delay) {
  let count = 0;

  function loop() {
    if (count < iterations) {
        setTimeout(loop, delay);
        cubeBody.applyForce(
          new CANNON.Vec3(500000,0,0),
          new CANNON.Vec3(0,0,0)
        )

        count++;
      }
  }

  loop();
}

// delayedLoop(5,970)

// Ball Launch button
document.getElementById("BallButton").addEventListener("click",  function() {
  BallBody.applyForce(
    new CANNON.Vec3(-20000000,0,0),
    new CANNON.Vec3(0,0,0)
  )
});





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
    refreshLoop();
  });
}
console.log(fps)
refreshLoop();