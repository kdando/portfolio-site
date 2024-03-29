//import stylesheet
import './style.css';

//import Three.js
import * as THREE from "three";

//import more from Three.js
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

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

//creating the shape by creating geometry, a material, then mesh by combining the two
const geometry = new THREE.TorusGeometry( 10, 2, 16, 100 );
//Basic material requires no lightsource
//Standard material reacts to light bouncing off it
const material = new THREE.MeshStandardMaterial( { color: 0xFF6347 });
const torus = new THREE.Mesh( geometry, material );

//add the TORUS to the scene
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

//instantiate orbitcontrols class
//this will listen to dom events on the mouse and update camera position accordingly
const controls = new OrbitControls( camera, renderer.domElement );

//instantiate loader and load moths
const gltfLoader = new GLTFLoader();

gltfLoader.load("./assets/moths_fluttering_around_a_light_source/scene.gltf", function (gltf) {
    scene.add(gltf.scene);

    const mixer = new THREE.AnimationMixer(gltf.scene);
    gltf.animations.forEach((clip) => {
        mixer.clipAction(clip).play();
    });

    // animate(); // Don't start animation loop here

}, undefined, function (error) {
    console.error(error);
});

//BACKGROUND//////////////////////////////////
//populate background with stars
function addStar() {
    const geometry = new THREE.SphereGeometry(0.25, 24, 24);
    const material = new THREE.MeshStandardMaterial( {color: 0xFFFFFF} );
    const star = new THREE.Mesh( geometry, material );

    //randomly position star in space
    const [x,y,z] = Array(3).fill().map(() => {
        return THREE.MathUtils.randFloatSpread(100);
    })

    star.position.set(x,y,z);
    scene.add(star);
}

//determines the num of stars (the array) by running function to create star at each element of the array
Array(200).fill().forEach(addStar)

//set background image to space
//.load also accepts callback function to be notified when image loads
const spaceTexture = new THREE.TextureLoader().load("./assets/skyboxorange.jpg");
scene.background = spaceTexture

////////////////////////////////////////

//AVATAR///////////////////////////////
// const avatarTexture = new THREE.TextureLoader().load("./assets/zeitemoji.jpg");

// const avatar = new THREE.Mesh(
//     new THREE.BoxGeometry(3,3,3),
//     new THREE.MeshBasicMaterial( { map: avatarTexture })
// );

// scene.add(avatar)

//////////////////////////////////////

//MOTHS



//PLANETOID//////////////////////////

const planetTexture = new THREE.TextureLoader().load("./assets/plutomap2k.jpg");
const planetNormalTexture = new THREE.TextureLoader().load("./assets/plutobump2k.jpg")

const planet = new THREE.Mesh(
    new THREE.SphereGeometry(3,32,32),
    new THREE.MeshStandardMaterial( { 
        map: planetTexture,
        normalMap: planetNormalTexture
     })
)

scene.add(planet)

//planet is set further down because we want to scroll down to zoom out to it
planet.position.z = 30;
planet.position.setX(-10);

//////////////////////////////////////

//FUNCTIONS//

function moveCamera() {
    //get dimensions of viewport and .top tells us how far from the top of the page we are
    const t = document.body.getBoundingClientRect().top;

    //rotate the objects when user scrolls
    planet.rotation.x += 0.05;
    planet.rotation.y += 0.075;
    planet.rotation.z += 0.05;

    // avatar.rotation.y += 0.01;
    // avatar.rotation.z += 0.01;

    //top will always be relative so we multiply by negative number to also move camera
    camera.position.z = t * -0.01;
    camera.position.x = t * -0.0002;
    camera.position.y = t * -0.0002;

}

//assign this function to run every time user scrolls
document.body.onscroll = moveCamera

//function to recursively call the render method (rather than have to call it over and over manually)
function animate() {

    //recursively call itself
    requestAnimationFrame( animate );
    //animate the moths
    // const deltaTime = clock.getDelta();
    // mixer.update(deltaTime);
    //rotate torus every frame
    torus.rotation.x += 0.01;
    torus.rotation.y += 0.005;
    torus.rotation.z += 0.01;
    //update controls, this allows dragging with click or zooming with wheel
    controls.update()
    //render
    renderer.render( scene, camera );
}

animate(); // Don't start animation loop here
