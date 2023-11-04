import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
scene.background = new THREE.Color('lightblue')

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),antialias: true
});
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(100,100,100),
    new THREE.MeshLambertMaterial({color:0xffffff})
);
plane.receiveShadow = true
plane.rotateX(-Math.PI/2)
const wall = new THREE.Mesh(
    new THREE.PlaneGeometry(10,10,10),
    new THREE.MeshLambertMaterial({color:0xffffff})
)

const helper = new THREE.AxesHelper(5);

camera.position.set(0,5,14)
renderer.setSize( window.innerWidth, window.innerHeight );
scene.add(plane,helper,wall)
const world = new CANNON.World();
    world.gravity.set(0, -9.82, 0); // Set gravity (m/s²)

    // Create a ground plane

    const planeBody = new CANNON.Body({
        shape: new CANNON.Plane(),
        type: CANNON.Body.STATIC
    });
    planeBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    world.addBody(planeBody);

    // Create a sphere
    const sphereShape = new CANNON.Sphere(1); // Radius of 1
    const sphereBody = new CANNON.Body({ mass: 5 }); // Mass of 5
    sphereBody.addShape(sphereShape);
    sphereBody.position.set(0, 5, 0); // Initial position
    world.addBody(sphereBody);

    // Create a Three.js sphere mesh
    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    const sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
    const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphereMesh.castShadow = true
    scene.add(sphereMesh);

const pointLight = new THREE.PointLight(0xffffff,5000)
const ambLight = new THREE.AmbientLight(0x666666,10)
const spotLight = new THREE.SpotLight(0xffffff,200,10,1,0.1)
const directionalLight = new THREE.DirectionalLight(0xffffff,1.5)
const hemisphereLight = new THREE.HemisphereLight(0xffffff)
hemisphereLight.intensity = 1.35
spotLight.castShadow = true
spotLight.shadow.bias = -0.0001;
spotLight.shadow.mapSize.width = 1024*4
spotLight.shadow.mapSize.height = 1024*4
spotLight.position.set(5,5,5)
scene.add(spotLight,hemisphereLight)

const controls = new OrbitControls(camera,renderer.domElement)
function animate() {
    requestAnimationFrame(animate);
    controls.update
    world.step(1 / 60);

            // Update the Three.js sphere position
            sphereMesh.position.copy(sphereBody.position);
    renderer.render(scene,camera);
  


    const cameraPosition = camera.position;
  const cameraX = cameraPosition.x;
  const cameraY = cameraPosition.y;
  const cameraZ = cameraPosition.z;
  console.log(`Camera Position: x=${cameraX}, y=${cameraY}, z=${cameraZ}`);
  }
  animate()
  