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
export const Width = 200;
const Height =250;
var grid_container = document.getElementById('product_cards_container');


fetchAndCreateProductCards();

function animate() {
    requestAnimationFrame(animate);

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
function create_product_cards(product){
    const div = document.createElement('div')
    div.className = 'product_card';
    const canvas = document.createElement('canvas');
    const product_name = document.createElement('p');
    const price = document.createElement('p');
    product_name.textContent = product.name;
    product_name.className = 'product_name';
    price.textContent = product.price+'$';
    price.className = 'price';
    div.appendChild(canvas);
    div.appendChild(product_name);
    div.appendChild(price);
    
    div.addEventListener('click',function(){
        window.location.href = './product.html?data=' + encodeURIComponent(product.name);
    });
    

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(product.scene.background_color)
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,antialias: true,
        width:Width,
        height:Height
    });
    renderer.setSize(Width,Height)
    const camera = new THREE.PerspectiveCamera( 75, Width / Height, 0.1, 1000 );
    camera.position.set(product.scene.camera_position.x,product.scene.camera_position.y,product.scene.camera_position.z)

    const controls = new OrbitControls(camera,renderer.domElement)

    const directionalLight = new THREE.DirectionalLight(0xffffff,8) //color-->intensity
    directionalLight.position.set(20,20,15)
    const HemisphereLight = new THREE.HemisphereLight(0xffffff,undefined,1);
    scene.add(HemisphereLight,directionalLight);
    scenes.push(scene);
    cameras.push(camera);
    renderers.push(renderer);
    controlses.push(controls);
    const Mesh = new THREE.Mesh(
        new THREE[product.scene.mesh],
        new THREE.MeshLambertMaterial({color:parseInt("0x"+product.colors[0])})
    )
    scene.add(Mesh)


    document.getElementById('product_cards_container').appendChild(div);

    
}
function resize_handler(){
    let computedStyles = window.getComputedStyle(grid_container);
    let container_width = grid_container.getBoundingClientRect().width-2*parseFloat(computedStyles.paddingLeft);
    let number_of_grid_items = Math.floor(container_width/(Width+100));
    grid_container.style.columnGap = (container_width-(number_of_grid_items*(Width+100)))/(number_of_grid_items-1)+'px'
}
window.addEventListener('resize',resize_handler);
resize_handler()