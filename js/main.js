import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

// 1. Vytvoření scény a kamery
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Oddálíme kameru trochu víc, aby se nám tam vešly všechny 3 kostky vedle sebe
camera.position.z = 15; 

// Globální proměnné
let controls;

// 2. Inicializace rendereru
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container3D").appendChild(renderer.domElement);

// 3. Aktivace OrbitControls (ovládání myší)
controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; 
controls.dampingFactor = 0.05;

// 4. Načtení 3D modelu a jeho klonování
const loader = new GLTFLoader();
loader.load(
  './kostka.glb', 
  function (gltf) {
    // Vezmeme základní model a nastavíme mu velikost
    const baseCube = gltf.scene;
    baseCube.scale.set(30, 30, 30); 

    // --- PROSTŘEDNÍ KOSTKA ---
    const cube1 = baseCube;
    cube1.position.set(0, 0, 0); // Střed (X = 0)
    scene.add(cube1);

    // --- LEVÁ KOSTKA ---
    const cube2 = baseCube.clone(); // Vytvoříme kopii
    cube2.position.set(-5, 0, 0);   // Posuneme doleva na ose X (X = -5)
    scene.add(cube2);

    // --- PRAVÁ KOSTKA ---
    const cube3 = baseCube.clone(); // Vytvoříme další kopii
    cube3.position.set(5, 0, 0);    // Posuneme doprava na ose X (X = 5)
    scene.add(cube3);

    console.log("Všechny 3 kostky byly úspěšně načteny!");
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    console.error("Chyba při načítání modelu:", error);
  }
);

// 5. Osvětlení scény
const topLight = new THREE.DirectionalLight(0xffffff, 1.5);
topLight.position.set(5, 5, 5);
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

// 6. Animační smyčka (vykreslování)
function animate() {
  requestAnimationFrame(animate);

  if (controls) {
    controls.update();
  }

  renderer.render(scene, camera);
}

// 7. Responzivita při změně velikosti okna
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Spuštění aplikace
animate();
