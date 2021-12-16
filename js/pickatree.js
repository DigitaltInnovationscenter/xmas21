import * as THREE from "./vendor/three127/build/three.module.js";
import { GLTFLoader } from "./vendor/three127/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "./vendor/three127/examples/jsm/controls/OrbitControls.js";

var scene1, camera1, renderer1, controls1;
var scene2, camera2, renderer2, controls2;
var scene3, camera3, renderer3, controls3;
var scene4, camera4, renderer4, controls4;
var scene5, camera5, renderer5, controls5;

var modelsPath = "assets/models"

function onProgress(xhr) { 
	console.log( (xhr.loaded / xhr.total * 100) + '% loaded' ); 
}
function onError(xhr) { console.log( 'ERROR: ' + xhr); }

const Deg2Rad = Math.PI / 180;
const Rad2Deg = 180 / Math.PI;

document.getElementById("ida1").onclick = selectTree1;
document.getElementById("ida2").onclick = selectTree2;
document.getElementById("ida3").onclick = selectTree3;
document.getElementById("ida4").onclick = selectTree4;

function selectTree1(treeId) {
	choosenGran(1);
	ClearScene5();
	loadTree1(scene5);
}

function selectTree2(treeId) {
	choosenGran(2);
	ClearScene5();
	loadTree2(scene5);
}

function selectTree3(treeId) {
	choosenGran(3);
	ClearScene5();
	loadTree3(scene5);
}

function selectTree4(treeId) {
	choosenGran(4);
	ClearScene5();
	loadTree4(scene5);
}

function ClearScene5(){
	removeFromScene(scene5, "present_red");
	removeFromScene(scene5, "tree1");
	removeFromScene(scene5, "tree2");
	removeFromScene(scene5, "tree3");
	removeFromScene(scene5, "tree4");
}

function removeFromScene(scene, name) {
    scene.remove(scene.getObjectByName(name));
}

window.onload = function() {
	initializeScenes();
	initializeLights();
	loadModels();
	animate();
};

function initializeScenes()
{ 
	var container1 = document.getElementById("ida1");
	var container2 = document.getElementById("ida2");
	var container3 = document.getElementById("ida3");
	var container4 = document.getElementById("ida4");
	var container5 = document.getElementById("ida5");
	
	/*
	document.body.appendChild( container1 );
	document.body.appendChild( container2 );
	document.body.appendChild( container3 );
	document.body.appendChild( container4 );
	*/

	const w1 = container1.offsetWidth-8;
	const h1 = container1.offsetHeight-8;
	const w2 = container2.offsetWidth-8;
	const h2 = container2.offsetHeight-8;
	const w3 = container3.offsetWidth-8;
	const h3 = container3.offsetHeight-8;
	const w4 = container4.offsetWidth-8;
	const h4 = container4.offsetHeight-8;
	const w5 = container5.offsetWidth-8;
	const h5 = container5.offsetHeight-8;

	renderer1 = new THREE.WebGLRenderer( { antialias: true,alpha: true } );
	renderer2 = new THREE.WebGLRenderer( { antialias: true,alpha: true } );
	renderer3 = new THREE.WebGLRenderer( { antialias: true,alpha: true } );
	renderer4 = new THREE.WebGLRenderer( { antialias: true,alpha: true } );
	renderer5 = new THREE.WebGLRenderer( { antialias: true,alpha: true } );

	renderer1.setClearColor('#000000', 0);
	renderer2.setClearColor('#000000', 0);
	renderer3.setClearColor('#000000', 0);
	renderer4.setClearColor('#000000', 0);
	renderer5.setClearColor('#ccee22', 0);

	renderer1.setSize( w1, h1, false );
	renderer2.setSize( w2, h2, false );
	renderer3.setSize( w3, h3, false );
	renderer4.setSize( w4, h4, false );
	renderer5.setSize( w5, h5, false );

	container1.appendChild( renderer1.domElement );
	container2.appendChild( renderer2.domElement );
	container3.appendChild( renderer3.domElement );
	container4.appendChild( renderer4.domElement );
	container5.appendChild( renderer5.domElement );

	scene1 = new THREE.Scene();
	scene2 = new THREE.Scene();
	scene3 = new THREE.Scene();
	scene4 = new THREE.Scene();
	scene5 = new THREE.Scene();

	camera1 = new THREE.PerspectiveCamera( 45, w1 / h1, 1, 100 );
	camera2 = new THREE.PerspectiveCamera( 45, w2 / h2, 1, 100 );
	camera3 = new THREE.PerspectiveCamera( 45, w3 / h3, 1, 100 );
	camera4 = new THREE.PerspectiveCamera( 45, w4 / h4, 1, 100 );
	camera5 = new THREE.PerspectiveCamera( 45, w5 / h5, 1, 100 );

	//controls1 = new OrbitControls( camera1, renderer1.domElement );
	//controls2 = new OrbitControls( camera2, renderer2.domElement );
	//controls3 = new OrbitControls( camera3, renderer3.domElement );
	//controls4 = new OrbitControls( camera4, renderer4.domElement );

	controls5 = new OrbitControls( camera5, renderer5.domElement );
	controls5.target.set(0, 2.2, 0);

	camera1.position.set( 0, 2.5, 7 );
	camera2.position.set( 0, 2.5, 7 );
	camera3.position.set( 0, 2.5, 7 );
	camera4.position.set( 0, 2.5, 7 );
	camera5.position.set( 0, 3.6, 7 );

	//controls1.update();
	//controls2.update();
	//controls3.update();
	//controls4.update();

	controls5.update();

}

function loadModels(){
	loadTree1(scene1);
	loadTree2(scene2);
	loadTree3(scene3);
	loadTree4(scene4);
	loadPlaceholder(scene5);
}

function loadTree1(scene){
	let modelPos = new THREE.Vector3( 0, 0, 0 ); 
	let modelScale = 0.015;
	LoadGLTF(scene,"tree1", modelPos, modelScale);
}

function loadTree2(scene){
	let modelPos = new THREE.Vector3( 0, 0, 0 );
	let modelScale = 0.30;
	LoadGLTF(scene,"tree2", modelPos, modelScale);
}

function loadTree3(scene){
	let modelPos = new THREE.Vector3( 0, 0, 0 );
	let modelScale = 2.7;
	LoadGLTF(scene,"tree3", modelPos, modelScale);
}

function loadTree4(scene){
	let modelPos = new THREE.Vector3( 0, 0, 0 );
	let modelScale = 0.03;
	LoadGLTF(scene,"tree4", modelPos, modelScale);
}

function loadPlaceholder(scene){
	let modelPos = new THREE.Vector3( 0, 1, 0 );
	let modelScale = 0.008;
	LoadGLTF(scene,"present_red", modelPos, modelScale);
}

function initializeLights()
{
	AddLights(scene1);
	AddLights(scene2);
	AddLights(scene3);
	AddLights(scene4);
	AddLights(scene5);
}


function AddLights(scene) {

	const color = 0xAAFFAA;
	const intensity = 6;
	const light = new THREE.DirectionalLight( color, intensity );
	light.position.set( 250, 100, 20 );
	scene.add( light );
	scene.add( light.target );

	const ambientLight = new THREE.AmbientLight(  0xFFFFFF );
	ambientLight.intensity = 0.7;
	scene.add( ambientLight );

	const spotLight = new THREE.SpotLight( 0xAAFFAA );
	spotLight.intensity = 3;
	spotLight.position.set( 0, 15, 0 );
	scene.add( spotLight );

}

function LoadGLTF(scene, name, pos, scale){
	const gltfLoader = new GLTFLoader();
	gltfLoader.load( modelsPath + "/" + name + '.glb',
		function ( gltf ) {
			gltf.animations; 
			const mesh1 = gltf.scene.children[0];
			mesh1.scale.set(scale, scale, scale);

			mesh1.position.x = pos.x;
			mesh1.position.y = pos.y;
			mesh1.position.z = pos.z;

			mesh1.name = name;
			scene.add(mesh1);
			
		}, onProgress, onError
	);
}

function render()
{
	renderer1.render( scene1, camera1 );
	renderer2.render( scene2, camera2 );
	renderer3.render( scene3, camera3 );
	renderer4.render( scene4, camera4 );
	renderer5.render( scene5, camera5 );
}

function animate()
{
	requestAnimationFrame(animate);
	if( scene1.getObjectByName('RootNode_(model_correction_matrix)') ) {
		scene1.getObjectByName('RootNode_(model_correction_matrix)').rotation.z += 0.005;
	}
	if( scene2.getObjectByName('RootNode_(model_correction_matrix)') ) {
		scene2.getObjectByName('RootNode_(model_correction_matrix)').rotation.z += 0.005;
	}
	if( scene3.getObjectByName('RootNode_(model_correction_matrix)') ) {
		scene3.getObjectByName('RootNode_(model_correction_matrix)').rotation.z += 0.005;
	}
	if( scene4.getObjectByName('RootNode_(model_correction_matrix)') ) {
		scene4.getObjectByName('RootNode_(model_correction_matrix)').rotation.z += 0.005;
	}

	//controls1.update();
	//controls2.update();
	//controls3.update();
	//controls4.update();
	controls5.update();
	render();
}

