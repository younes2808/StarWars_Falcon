import * as THREE from 'three';// Importerer hele Three.js biblioteket
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'; // Importerer GLTF loader for å laste 3D-modeller
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'; // Importerer OrbitControls for å kunne rotere kameraet med musen

// Lager renderer som bruker antialiasing for å gjøre kantene glattere
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;
// Setter størrelsen på renderer til hele vinduet
renderer.setSize(window.innerWidth, window.innerHeight);
// Gjør bakgrunnsfargen svart
renderer.setClearColor(0x000000);
// Sørger for at renderer responsive på flere skjermer
renderer.setPixelRatio(window.devicePixelRatio);
// Enabler shadowmap for å lage realistiske skygger
renderer.shadowMap.enabled = true;
// Bruker en mykere skyggetype for å unngå harde kanter på skyggene
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
// Legger renderer til HTML-dokumentet så den vises i browseren
document.body.appendChild(renderer.domElement);
// Lager en ny scene der alt skal være
const scene = new THREE.Scene();
// Oppretter kameraet med en vinkel på 45 grader, også setter hvor langt unna kameraet ser
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
// Plasserer kameraet litt over og bak scenen for at man ser bedre
camera.position.set(4, 5, 11);
//Oppretter bevegelse ved hjelp av mus
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 5;
controls.maxDistance = 20;
controls.minPolarAngle = 0.5;
controls.maxPolarAngle = 1.5;
controls.autoRotate = false;
controls.target = new THREE.Vector3(0, 1, 0);
controls.update(); // Oppdaterer controls med de ny egenskapene
//Lager geometri hvor modellen kan ligge
const groundGeometry = new THREE.PlaneGeometry(20, 20, 32, 32);
//Roterer planet 90 grader
groundGeometry.rotateX(-Math.PI / 2);
//Setter en farge og passer på at Three.js renderer begge sider
//Fordi den renderer bare en ved default
const groundMaterial = new THREE.MeshStandardMaterial({
  color: 0x555555,
  side: THREE.DoubleSide
});

const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
// Angir at bakken ikke skal kaste skygger
groundMesh.castShadow = false;
// Angir at bakken kan få skygger fra modellen
groundMesh.receiveShadow = true;
scene.add(groundMesh);
//Legger til et spotlight
const spotLight = new THREE.SpotLight(0xffffff, 3000, 100, 0.22, 1);
//Setter spotlighet ovenfor modellen som ligger i grunnpunktet
spotLight.position.set(0, 25, 0);
//Setter at spotlighet kan kaste skygger
spotLight.castShadow = true;
spotLight.shadow.bias = -0.0001;
scene.add(spotLight);
//Loader modellen
const loader = new GLTFLoader().setPath('models/Car/');
loader.load('scene.gltf', (gltf) => {
  console.log('loading model');
  const mesh = gltf.scene;

  mesh.traverse((child) => {
    if (child.isMesh) {// Går gjennom alle objektene i modellen og sjekker om de er mesh
      child.castShadow = true;// Setter at hvert objekt skal kaste skygger
      child.receiveShadow = true;// Angir at hvert objekt kan få skygger
    }
  });
  //Plasserer modellen litt over bakken
  mesh.position.set(0, 1.05, -1);
  scene.add(mesh);
// Fjerner loading screenen når modellen har lastet
  document.getElementById('progress-container').style.display = 'none';
}, (xhr) => {
  console.log(`loading ${xhr.loaded / xhr.total * 100}%`);
}, (error) => {
  console.error(error);
});
// Lager en Event Listener for når vinduet endrer størrelse for å justere kamera og renderer
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
// Animert loop som oppdaterer kontrollene og renderer scenen på nytt hvert frame
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();