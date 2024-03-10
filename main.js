//import stylesheet
import "./style.css"

//import Three.js
import * as THREE from "three";

//Create scene, camera and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderList({
    canvas: document.querySelector("#bg"),
});

//set renderer to fit device view properly
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );

//set camera to be able to see the scene 
camera.position.setZ(30);

//start the render, passing scene and camera as args
renderer.render( scene, camera );

