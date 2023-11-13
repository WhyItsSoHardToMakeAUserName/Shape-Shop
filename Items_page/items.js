import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {TTFLoader} from 'three/examples/jsm/loaders/TTFLoader';
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader';
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry';
let counter = 0;
const canvasHeight = 0.48
const meshes = [];
let scenes = [];
let renderers = [];
let cameras = [];
let controlses = []

const colors = [0x0d1b2a, 0x1b263b, 0x415a77, 0x778da9, 0xe0e1dd];
const bgColor = '#e5e5e5';
const Width = 200;
const Height =250;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, Width / Height, 0.1, 1000 );

scene.background = new THREE.Color(bgColor)
camera.position.set(-3,2,2.5)

//Shape,TextMesh,scene,camera,renderer
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),antialias: true
});
// renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 2.3
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.BasicShadowMap;
renderer.setSize( Width, Height );
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
    // scene.add(textMesh)
})

        const testCubeMesh = new THREE.Mesh(
            new THREE.BoxGeometry(2,2,2),
            new THREE.MeshLambertMaterial({color:new THREE.Color('gray')})
        );
        testCubeMesh.castShadow = true;
        meshes.push(testCubeMesh);
        scene.add(testCubeMesh);

const hemisphereLight = new THREE.HemisphereLight(0xbde0fe,undefined,8) //color-->color-->intensity
const directionalLight = new THREE.DirectionalLight(0xffffff,1) //color-->intensity
const spotlight = new THREE.SpotLight(0xffffff,1);
directionalLight.position.set(20,20,15)

const drhelper = new THREE.DirectionalLightHelper(directionalLight,5,0x000000);
const shadowcamera = new THREE.CameraHelper(directionalLight.shadow.camera);


scene.add(directionalLight, hemisphereLight,spotlight)







async function fetchAndCreateProductCards() {
    try {
      // Fetch JSON data
      const response = await fetch('products.json');
      const products = await response.json();

      // Loop through products and create product cards
      products.forEach((product) => {
        create_product_cards(product);
      });
    } catch (error) {
      console.error('Error fetching or parsing JSON:', error);
    }
  }
fetchAndCreateProductCards();

function animate() {
    requestAnimationFrame(animate);
    controls.update
    renderer.render(scene,camera);
  
    for(let i=0;i<renderers.length;i++){
        renderers[i].render(scenes[i],cameras[i]);
        controlses[i].update
    }
    
    // const cameraPosition = camera.position;
    // const cameraX = cameraPosition.x;
    // const cameraY = cameraPosition.y;
    // const cameraZ = cameraPosition.z;
    // console.log(`Camera Position: x=${cameraX}, y=${cameraY}, z=${cameraZ}`);
}
animate()


function create_product_cards(product){
    const div = document.createElement('div')
    div.className = 'product_card';
    const canvas = document.createElement('canvas');
    const product_name = document.createElement('p');
    const price = document.createElement('p');
    product_name.textContent = product.name;
    product_name.className = 'product_name';
    price.textContent = product.price;
    price.className = 'price';
    div.appendChild(canvas);
    div.appendChild(product_name);
    div.appendChild(price);
    

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(product.scene.background_color)
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,antialias: true,
        width:Width,
        height:Height
    });
    renderer.setSize(Width,Height)
    const camera = new THREE.PerspectiveCamera( 75, Width / Height, 0.1, 1000 );
    camera.position.set(0,10,20)

    const controls = new OrbitControls(camera,renderer.domElement)

    const HemisphereLight = new THREE.HemisphereLight(0xffffff,undefined,10);
    scene.add(HemisphereLight);
    scenes.push(scene);
    cameras.push(camera);
    renderers.push(renderer);
    controlses.push(controls);
    const Sphere = new THREE.Mesh(
        new THREE[product.name],
        new THREE.MeshLambertMaterial({color:0xffffff})
    )
    scene.add(Sphere)


    document.getElementById('product_cards_container').appendChild(div);

    
}