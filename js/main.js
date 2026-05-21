import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

// 1. Vytvoření scény a kamery
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

camera.position.z = 20; 

// Globální proměnné pro ovládání
let controls;

// 2. Inicializace rendereru
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container3D").appendChild(renderer.domElement);

// 3. Aktivace OrbitControls (ovládání myší na kliknutí a tažení)
controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; 
controls.dampingFactor = 0.05;

// 4. Načtení 3D modelu a jeho rozmístění
const loader = new GLTFLoader();
loader.load(
  './Untitled.glb', // Kostka umístěná vedle index.html
  function (gltf) {
    const baseCube = gltf.scene;
    
    // Nastavení měřítka
    baseCube.scale.set(1, 1, 1);

    baseCube.position.set(0, 0, 0);
    scene.add(baseCube);

    console.log("Model byl úspěšně načten!");
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    console.error("Chyba při načítání modelu:", error);
  }
);

// 5. Osvětlení scény
// DirectionalLight funguje jako slunce (paralelní paprsky), pozice určuje směr, odkud svítí
const topLight = new THREE.DirectionalLight(0xffffff, 1.5);
topLight.position.set(100, 100, 100); 
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

// 6. Animační smyčka (vykreslování)
function animate() {
  requestAnimationFrame(animate);

  // Aktualizace OrbitControls pro plynulý pohyb
  if (controls) {
    controls.update();
  }

  renderer.render(scene, camera);
}

// 7. Responzivita při změně velikosti okna prohlížeče
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Spuštění celé aplikace
animate();
