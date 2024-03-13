// Import Three.js
import * as THREE from "three";

// Import GLTFLoader
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// Import OrbitControls
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// Create scene, camera and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#bg"),
});
renderer.setSize(window.innerWidth, window.innerHeight);

// Set initial camera position
camera.position.set(0, 0, -3);

// Add event listener to adjust canvas size when window is resized
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Instantiate OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);

// FUNCTION FOR CAMERA CONTROLS //////////////

function moveCamera() {
    //get dimensions of viewport and .top tells us how far from the top of the page we are
    const t = document.body.getBoundingClientRect().top;

    //top will always be relative so we multiply by negative number to also move camera
    camera.position.z = t * -0.01;
    // camera.position.x = t * -0.0002;
    // camera.position.y = t * -0.0002;
};

//assign this function to run every time user scrolls
document.body.onscroll = moveCamera

////////////////////////////

//populate background with stars
function addStar() {
    const geometry = new THREE.SphereGeometry(0.25, 24, 24);
    const material = new THREE.MeshStandardMaterial( {color: 0xFFFF00} );
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

// LIGHTS /////////////////
const ambientLight = new THREE.AmbientLight(0x404040, 1); // Adjust color and intensity as needed
scene.add(ambientLight);

//SKYBOX //////////////////
//set background image to space
//.load also accepts callback function to be notified when image loads
const spaceTexture = new THREE.TextureLoader().load("./assets/textures/skyboxorange.jpg");
scene.background = spaceTexture

//MOTHS //////////////////
// Load the moth GLTF model
const gltfLoader = new GLTFLoader();
gltfLoader.load("./assets/moth_and_source_model/scene.gltf", 
    function (gltf) {
        const mothModel = gltf.scene;

        // Set position of the moth model
        mothModel.position.set(0, -2, -1);
        // Scale size of the moth model
        mothModel.scale.set(2, 2, 2);

        //Make the moth model emissive
        mothModel.traverse((child) => {
            if (child.isMesh) {
                child.material.emissive.setHex(0xff0000); // color (hexadecimal)
                child.material.emissiveIntensity = 1; // intensity (0 to 1)
            }
        });

        // Add the loaded moth model to the scene
        scene.add(mothModel);

        // Set up animation mixer
        const mixer = new THREE.AnimationMixer(mothModel);
        gltf.animations.forEach((clip) => {
            mixer.clipAction(clip).play();
        });

        // Render loop
        function animate() {
            requestAnimationFrame(animate);
            controls.update();
            mixer.update(0.01); // Update animation
            controls.update(); //update controls
            renderer.render(scene, camera);
        }

        // Start animation loop
        animate(); 
});
