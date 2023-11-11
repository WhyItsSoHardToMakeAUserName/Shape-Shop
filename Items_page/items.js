import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {TTFLoader} from 'three/examples/jsm/loaders/TTFLoader';
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader';
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry';
const N=1
const canvasHeight = 0.48
const meshes = [];
const bodies = []
const colors = [0xe63946, 0xf1faee, 0xa8dadc, 0x457b9d, 0x1d3557];
const bgColor = '#e5e5e5';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / (window.innerHeight*canvasHeight), 0.1, 1000 );

scene.background = new THREE.Color(bgColor)
camera.position.set(1.55,0.66,4)

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),antialias: true
});
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 2.3
renderer.shadowMap.enabled = true;
renderer.setSize( window.innerWidth, window.innerHeight*canvasHeight );
const controls = new OrbitControls(camera,renderer.domElement)
const fontloader = new FontLoader();
const ttfloader = new TTFLoader();
ttfloader.load('/fonts/HEROEAU-ELEGANT.ttf',(json)=>{
    const HEROEAU = fontloader.parse(json);

    const textGeometry = new TextGeometry('CUBE',{
        height:0.2,
        size:1.8,
        font:HEROEAU,
    });
    const textMaterial = new THREE.MeshLambertMaterial();
    const textMesh = new THREE.Mesh(
        textGeometry,
        textMaterial
    );
    textMesh.position.set(-4.5,0,0)
    textMesh.rotateY(Math.PI/9)
    // textMesh.rotateX(-Math.PI/11)
    scene.add(textMesh)
})


const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(100,100,100),
    new THREE.ShadowMaterial({color:new THREE.Color(0x000000)})
);
plane.receiveShadow = true
plane.rotateX(-Math.PI/2)
plane.position.set(0,-2.3,0)
scene.add(plane)


        const testCubeMesh = new THREE.Mesh(
            new THREE.BoxGeometry(2,2,2),
            new THREE.MeshLambertMaterial({color:new THREE.Color('gray')})
        );
        testCubeMesh.castShadow = true;
        testCubeMesh.position.set(0,-1.3,0);
        
        meshes.push(testCubeMesh);
        scene.add(testCubeMesh);

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
    renderer.render(scene,camera);
  

    const cameraPosition = camera.position;
    const cameraX = cameraPosition.x;
    const cameraY = cameraPosition.y;
    const cameraZ = cameraPosition.z;
    console.log(`Camera Position: x=${cameraX}, y=${cameraY}, z=${cameraZ}`);
}
animate()
