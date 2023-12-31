import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

const N=50;
let k = 0;
const canvasHeight = 0.48
const meshes = [];
const bodies = []
const colors = [0xe63946, 0xf1faee, 0xa8dadc, 0x457b9d, 0x1d3557];
const bgColor = '#bde0fe';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / (window.innerHeight*canvasHeight), 0.1, 1000 );

scene.background = new THREE.Color(bgColor)
camera.position.set(1.3,15.2,31.5)

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),antialias: true
});
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 2.3
renderer.shadowMap.enabled = true;
renderer.setSize( window.innerWidth, window.innerHeight*canvasHeight );
const controls = new OrbitControls(camera,renderer.domElement)

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(100,100,100),
    new THREE.ShadowMaterial({color:new THREE.Color(0x000000)})
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

    for(let i=0;i<N;i++){
        if(k>=colors.length)k=0;
        const testCube = new CANNON.Body({
            shape: new CANNON.Box(new CANNON.Vec3(1,1,1)),
            position: new CANNON.Vec3(0,20,0),
            mass:10
        })
        const testCubeMesh = new THREE.Mesh(
            new THREE.BoxGeometry(2,2,2),
            new THREE.MeshLambertMaterial({color:colors[k]})
        );
        k++;
        testCubeMesh.castShadow = true;
        testCube.position.set(Math.random()*3 - 0.5, i * 2.5 + 10, Math.random()*3 - 0.5);
        
        meshes.push(testCubeMesh);
        bodies.push(testCube);
        scene.add(testCubeMesh);
        world.addBody(testCube);
        testCube.applyForce(new CANNON.Vec3(0,-1000,0))
    }

const hemisphereLight = new THREE.HemisphereLight(0xbde0fe,undefined,8) //color-->color-->intensity
const directionalLight = new THREE.DirectionalLight(0xffffff,0.5) //color-->intensity

directionalLight.position.set(20,20,15)
directionalLight.castShadow = true 
directionalLight.shadow.mapSize.width = 1024 * 9
directionalLight.shadow.mapSize.height = 1024 * 9
directionalLight.shadow.camera.bottom = 50;
directionalLight.shadow.camera.left = 50;
directionalLight.shadow.camera.right =-50
directionalLight.shadow.camera.top = -50;




const drhelper = new THREE.DirectionalLightHelper(directionalLight,5,0x000000);
const shadowcamera = new THREE.CameraHelper(directionalLight.shadow.camera);


scene.add(directionalLight, hemisphereLight)

function animate() {
    requestAnimationFrame(animate);
    controls.update
    world.step(1 / 60);

    renderMeshes();
    renderer.render(scene,camera);
  

    const cameraPosition = camera.position;
    const cameraX = cameraPosition.x;
    const cameraY = cameraPosition.y;
    const cameraZ = cameraPosition.z;
    console.log(`Camera Position: x=${cameraX}, y=${cameraY}, z=${cameraZ}`);
}
animate()

function renderMeshes(){
    for(let i=0; i<N;i++){
        meshes[i].position.copy(bodies[i].position);
        meshes[i].quaternion.copy(bodies[i].quaternion);
    }
}
  