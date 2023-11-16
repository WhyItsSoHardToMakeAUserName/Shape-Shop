import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {TTFLoader} from 'three/examples/jsm/loaders/TTFLoader';
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader';
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry';

const Height = 500;
let scene,camera,renderer,mesh,controls;

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


    renderer.render(scene,camera)
        // const cameraPosition = camera.position;
    // const cameraX = cameraPosition.x;
    // const cameraY = cameraPosition.y;
    // const cameraZ = cameraPosition.z;
    // console.log(`Camera Position: x=${cameraX}, y=${cameraY}, z=${cameraZ}`);
}
fetch_json_data()
async function fetch_json_data(){
    try{
        const response = await fetch('products.json');
        const products = await response.json();
        scene =  new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);
        renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('bg'),
            antialias: true,
        });
        renderer.setSize( window.innerWidth, window.innerHeight );
        var urlParams = new URLSearchParams(window.location.search);
        var product_name = urlParams.get('data');
        products.forEach(product => {
            if(product.name == product_name){
                mesh = new THREE.Mesh(
                    new THREE[product.scene.mesh],
                    new THREE.MeshLambertMaterial({color:parseInt("0x"+product.scene.mesh_color)})
                    )
                scene.add(mesh)
                console.log(mesh)
                scene.background = new THREE.Color(product.scene.background_color)
                camera.position.set(product.scene.camera_position.x,product.scene.camera_position.y,product.scene.camera_position.z)
                controls = new OrbitControls(camera,renderer.domElement)
                const directionalLight = new THREE.DirectionalLight(0xffffff,8) //color-->intensity
                directionalLight.position.set(20,20,15)
                const HemisphereLight = new THREE.HemisphereLight(0xffffff,undefined,1);
                scene.add(HemisphereLight,directionalLight);
            }
            animate()
        });
        console.log((product_name))

    }catch(error){
        console.error("error-caught:",error);
    }
}