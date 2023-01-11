import './style.css'

import * as THREE from 'three';// always need 3 objects a scene a camera and a renderer

import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'; //Orbit controls allow you to pan around using mouse click

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight,0.1, 1000);//first arguement field of view, second aspect ratio(cal inner width/iner height, 3rd view frustrum)

const renderer = new THREE.WebGLRenderer({                 //renders out actual graphics to the scene
  canvas:document.querySelector('#bg'),                    //renderer needs to know which dom element to use(canvas with id of bg)
});

renderer.setPixelRatio(window.devicePixelRatio);      
renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.setZ(0);

renderer.render(scene, camera); //renderers render method

const geometry = new THREE.TorusGeometry(10,3,16,100)                    //creating an object- 1 geometry(vectors that define object)
const material = new THREE.MeshStandardMaterial( { color: 0xFF6347 } );//material
const torus = new THREE.Mesh(geometry,material); //3 Mesh

scene.add(torus);
const pointLight = new THREE.PointLight(0xffffff); //0x is a hexidecimal literal, means youre working with a hecidecimal value rather than some random number type
pointLight.position.set(20,20,20);                 //lights up portion of the screen

const ambientLight = new THREE.AmbientLight(0xffffff);  //light up entire scene
scene.add(pointLight, ambientLight);

const lightHelper = new THREE.PointLightHelper(pointLight); //This is  a tool used to see the position of the point light
const gridHelper = new THREE.GridHelper(200,50);  // this adds a grid to give your scene perspective but. So far its just a line but can be seen after using orbit controls
//scene.add(lightHelper, gridHelper);   

const controls = new OrbitControls(camera, renderer.domElement);

function addStar(){
  const geometry = new THREE.SphereGeometry(0.25,24,24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff});
  const star = new THREE.Mesh(geometry, material);

  const [x,y,z]= Array(3).fill().map(()=> THREE.MathUtils.randFloatSpread(100)); //this randomly generates the stars in the space

  star.position.set(x, y, z);
  scene.add(star)
}

Array(200).fill().forEach(addStar);

const spaceTexture = new THREE.TextureLoader().load('space.jpg'); //This sets the background image
scene.background = spaceTexture;

//Avatar
const domTexture = new THREE.TextureLoader().load('IMG_5998.JPG'); //basics of texture mapping
const dom =new THREE.Mesh(
  new THREE.BoxGeometry (3,3,3),
  new THREE.MeshBasicMaterial( { map: domTexture})
);
scene.add(dom);
const moonTexture= new THREE.TextureLoader().load('moon.jpg');
const normalTexture= new THREE.TextureLoader().load('normal.jpg');

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3,32,32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture                   //normal maps are used to create a sense of depth with very little effort
  })
);
moon.position.z =30;
moon.position.y=100;
moon.position.setX(-22);  // you can assign using = or use a setter function like setX in this case

scene.add(moon);

function moveCamera(){
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x+=0.05;
  moon.rotation.y+=0.075;
  moon.rotation.z+=0.05;

  dom.rotation.y+=0.01;
  dom.rotation.z+=0.01;

  camera.position.z = t*-0.01;
  camera.position.x =t*0.01;
  camera.position.y=t*-0.04;


}
document.body.onscroll = moveCamera

 

//renderer.render(scene,camera); replaced with animate function below
function animate(){               //kind of like a game loop
  requestAnimationFrame(animate); //this is a mechanism that tells the browser you want to perform an animation
  torus.rotation.x +=0.01;
  torus.rotation.y +=0.005;
  torus.rotation.z +=0.01;

  controls.update();         //updates Orbit controls in the animate function

  renderer.render(scene, camera );
}
animate();