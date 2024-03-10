//import stylesheet
import './style.css';

//import Three.js
import * as THREE from "three";

//Create scene, camera and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#bg"),
});

//set renderer to fit device view properly
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );

//set camera to be able to see the scene 
camera.position.setZ(30);

//start the render, passing scene and camera as args
renderer.render( scene, camera );

//creating the shape by creating geometry, a material, then mesh by combining the two
const geometry = new THREE.TorusGeometry( 10, 2, 16, 100 );
//Basic material requires no lightsource
//Standard material reacts to light bouncing off it
const material = new THREE.MeshStandardMaterial( { color: 0xFF6347 });
const torus = new THREE.Mesh( geometry, material );

//add the shape to the scene
scene.add(torus);

//LIGHTS
//0x prefixing means (in JS and other langs) this is hexadecimal rather than any old number type
const pointLight = new THREE.PointLight(0xFFFFFF);
pointLight.position.set(5,5,5)

const ambientLight = new THREE.AmbientLight(0xFFFFFF);
scene.add(pointLight, ambientLight)

//HELPERS to show us the position of the pointlight and draw a grid for guidance
const lightHelper = new THREE.PointLightHelper(pointLight)
const gridHelper = new THREE.GridHelper(200,50)
scene.add(lightHelper, gridHelper)


//function to recursively call the render method (rather than have to call it over and over manually)
function animate() {
    requestAnimationFrame( animate );
    torus.rotation.x += 0.01;
    torus.rotation.y += 0.005;
    torus.rotation.z += 0.01;
    renderer.render( scene, camera );
}

animate();
