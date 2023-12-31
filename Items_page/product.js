import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {TTFLoader} from 'three/examples/jsm/loaders/TTFLoader';
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader';
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry';
let scene,camera,renderer,mesh,controls;

document.getElementById('switch_menu_button').addEventListener('click', function() {
    var elementsToHide = document.querySelectorAll('.options_menu,.name, .colors_available, #price, #description, .gg-shopping-bag,.AddToCart');

    // Set the width of each element to 0px
    elementsToHide.forEach(function (element) {
        element.classList.toggle('collapsed');
    });
    const button = document.getElementById('switch_button');
    button.classList.toggle('rotate180')
  });

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
    // textMesh.rotateX(-Math.PI/11)
    // scene.add(textMesh)
})

function animate() {
    requestAnimationFrame(animate);
    controls.update();

    console.log('Camera Position:', camera.position);
console.log('Controls Target:', controls.target);
    renderer.render(scene,camera)
    if(mesh){
        mesh.rotation.y+=0.001
    }
    //     const cameraPosition = camera.position;
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
                //scene setup
                mesh = new THREE.Mesh(
                    new THREE[product.scene.mesh],
                    new THREE.MeshLambertMaterial({color:parseInt("0x"+product.colors[0])})
                    )
                mesh.position.set(-1,0,-1)
                scene.add(mesh)
                scene.background = new THREE.Color(product.scene.background_color)
                document.body.style.backgroundColor = product.scene.background_color
                camera.position.set(0,1.5,3)
                controls = new OrbitControls(camera,renderer.domElement)
                controls.target.copy(mesh.position)
                const directionalLight = new THREE.DirectionalLight(0xffffff,8) //color-->intensity
                directionalLight.position.set(20,20,15)
                const HemisphereLight = new THREE.HemisphereLight(0xffffff,undefined,1);
                scene.add(HemisphereLight,directionalLight);
                let colors_div = document.getElementById('colors');

                product.colors.forEach(color =>{
                    const div = document.createElement('button');
                    div.style.backgroundColor = '#'+color;
                    div.className = 'colors'
                    div.addEventListener('click',function(){
                        mesh.material.color = new THREE.Color(parseInt("0x"+color))
                    })
                    colors_div.appendChild(div)

                }
                    
                )

                //html setup
                document.getElementById('name').textContent = product.name;
                document.getElementById('price').textContent = product.price+'$';
                document.getElementById('description').textContent = product.description
            }
            animate()
        });
    }catch(error){
        console.error("error-caught:",error);
    }
}