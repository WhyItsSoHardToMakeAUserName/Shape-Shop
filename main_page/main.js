import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

const N=10;
const meshes = [];
const bodies = []

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / (window.innerHeight), 0.1, 1000 );

scene.background = new THREE.Color('lightblue')
camera.position.set(0,5,14)

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),antialias: true
});
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 2.3
renderer.shadowMap.enabled = true;
renderer.setSize( window.innerWidth, window.innerHeight );
const controls = new OrbitControls(camera,renderer.domElement)

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(100,100,100),
    new THREE.MeshLambertMaterial({color:new THREE.Color('lightblue')})
);
plane.receiveShadow = true
plane.rotateX(-Math.PI/2)
scene.add(plane)

const world = new CANNON.World();
    world.gravity.set(0, -9.82, 0);

    const planeBody = new CANNON.Body({
        shape: new CANNON.Plane(),
        type: CANNON.Body.STATIC
    });
    planeBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    world.addBody(planeBody);

    const testCube = new CANNON.Body({
        shape: new CANNON.Box(new CANNON.Vec3(1,1,1)),
        position: new CANNON.Vec3(0,20,0),
        mass:1
    })
    const testCubeMesh = new THREE.Mesh(
        new THREE.BoxGeometry(2,2,2),
        new THREE.MeshLambertMaterial({color:0xa2d2ff})
    );
    testCubeMesh.castShadow = true;
    // world.addBody(testCube);
    // scene.add(testCubeMesh);
    for(let i=0;i<N;i++){
        const testCube = new CANNON.Body({
            shape: new CANNON.Box(new CANNON.Vec3(1,1,1)),
            position: new CANNON.Vec3(0,20,0),
            mass:1
        })
        const testCubeMesh = new THREE.Mesh(
            new THREE.BoxGeometry(2,2,2),
            new THREE.MeshLambertMaterial({color:0xa2d2ff})
        );
        testCubeMesh.castShadow = true;
        testCube.position.set(Math.random()*3 - 0.5, i * 2.5 + 10, Math.random()*3 - 0.5);
        
        meshes.push(testCubeMesh);
        bodies.push(testCube);
        scene.add(testCubeMesh);
        world.addBody(testCube);
        testCube.applyForce(new CANNON.Vec3(0,-1000,0))
    }

const hemisphereLight = new THREE.HemisphereLight(0xffffff,undefined,1.6) //color-->color-->intensity
const directionalLight = new THREE.DirectionalLight(0xffffff,0.5) //color-->intensity

directionalLight.position.set(20,20,15)
directionalLight.castShadow = true 
directionalLight.shadow.radius = 9

const drhelper = new THREE.DirectionalLightHelper(directionalLight,5);

scene.add(directionalLight, hemisphereLight,drhelper)

function animate() {
    requestAnimationFrame(animate);
    controls.update
    world.step(1 / 60);

    renderMeshes();
    renderer.render(scene,camera);
  

    // const cameraPosition = camera.position;
    // const cameraX = cameraPosition.x;
    // const cameraY = cameraPosition.y;
    // const cameraZ = cameraPosition.z;
    // console.log(`Camera Position: x=${cameraX}, y=${cameraY}, z=${cameraZ}`);
}
animate()

function renderMeshes(){
    for(let i=0; i<N;i++){
        meshes[i].position.copy(bodies[i].position);
        meshes[i].quaternion.copy(bodies[i].quaternion);
    }
}
  