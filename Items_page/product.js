import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {TTFLoader} from 'three/examples/jsm/loaders/TTFLoader';
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader';
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry';

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

function animate() {
    requestAnimationFrame(animate);

        // const cameraPosition = camera.position;
    // const cameraX = cameraPosition.x;
    // const cameraY = cameraPosition.y;
    // const cameraZ = cameraPosition.z;
    // console.log(`Camera Position: x=${cameraX}, y=${cameraY}, z=${cameraZ}`);
}
animate()

fetch_json_data()
async function fetch_json_data(){
    try{
        const response = await fetch('product.json');
        const products = await response.json;
        console.log(products)
    }catch(error){
        console.error("error-caught:",error);
    }
}

function create_product_cards(product){
    const div = document.createElement('div')
    div.className = 'product_card';
    const canvas = document.createElement('canvas');

    div.appendChild(canvas);



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

    const Mesh = new THREE.Mesh(
        new THREE[product.name],
        new THREE.MeshLambertMaterial({color:parseInt("0x"+product.scene.mesh_color)})
    )
    scene.add(Mesh)
    document.getElementById('product_cards_container').appendChild(div);
}
