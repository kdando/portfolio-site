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

// Add event listener to adjust canvas size when window is resized
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Set up camera position
camera.position.set(0, 3, -3);

// Instantiate OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);

// Add low ambient light to the scene
const ambientLight = new THREE.AmbientLight(0x404040, 5); // Adjust color and intensity as needed
scene.add(ambientLight);

// Load the moth GLTF model
const gltfLoader = new GLTFLoader();
gltfLoader.load("./assets/moths_fluttering_around_a_light_source/scene.gltf", function (gltf) {
    const mothModel = gltf.scene;

    // Set position of the moth model
    mothModel.position.set(0, 0, -1);
    mothModel.rotateX(Math.PI / 2); // 90 degrees in radians

    // Traverse through the hierarchy to access the material of the moth model
    mothModel.traverse((child) => {
        if (child.isMesh) {
            // Make the material emissive
            child.material.emissive.setHex(0xff0000); // Set emissive color (e.g., red)
            child.material.emissiveIntensity = 1; // Set emissive intensity (0 to 1)
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
        renderer.render(scene, camera);
    }

    animate(); // Start animation loop
});
