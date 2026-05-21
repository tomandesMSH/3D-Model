import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

// 1. Vytvoření scény a kamery
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5; // Výchozí vzdálenost kamery od kostky

// Globální proměnné
let object;
let controls;

// 2. Inicializace rendereru
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container3D").appendChild(renderer.domElement);

// 3. Aktivace OrbitControls (ovládání myší: klik + táhni)
controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Plynulé dotáčení při puštění myši
controls.dampingFactor = 0.05;

// 4. Načtení 3D modelu kostky
const loader = new GLTFLoader();
loader.load(
  './kostka.glb', // Cesta ke kostce vedle index.html
  function (gltf) {
    object = gltf.scene;

    // Pokud je kostka z Blenderu moc malá, tady ji zvětšujeme (X, Y, Z)
    // Pokud by byla moc obří, změň 30 na menší číslo (třeba 5 nebo 10)
    object.scale.set(30, 30, 30); 

    scene.add(object);
    console.log("Kostka byla úspěšně načtena!");
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

  // Aktualizace ovládání kamery (nutné pro plynulé dotáčení)
  if (controls) {
    controls.update();
  }

  renderer.render(scene, camera);
}

// 7. Responzivita (přizpůsobení při změně velikosti okna prohlížeče)
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Spuštění celé aplikace
animate();
