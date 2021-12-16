//import * as THREE from './vendor/three127/build/three.module.js';
//import { OrbitControls } from "../vendor/three132/examples/jsm/controls/OrbitControls.js";

//import { Flow } from "../js/vendor/three132/examples/jsm/modifiers/CurveModifier.js";
import { GLTFLoader } from "./vendor/three127/examples/jsm/loaders/GLTFLoader.js";

var scene, camera, renderer, clock, deltaTime, totalTime;
var arToolkitSource, arToolkitContext, artoolkitMarker;
var markerRoot1;
var mesh0, mesh1;
var language, treeId, greetingId, greetingText, greetingName;
var modelName, modelScale, modelPos;

var markerFound = false;

var audio = new Audio("assets/music/christmas-song.mp3");

var patternPath = "assets/patterns/kanji.patt";
var cameraParaPath = "assets/data/camera_para.dat"
var modelsPath = "assets/models"
var fontsPath = "assets/fonts"

var rick = false;

function onProgress(xhr) { console.log( (xhr.loaded / xhr.total * 100) + '% loaded' ); }
function onError(xhr) { console.log( 'ERROR: ' + xhr); }

const randomMinMaxInclusive = (min, max) => Math.floor(Math.random() * (max + 1 - min)) + min;
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const isInt = (val) => !isNaN(val);
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

const encrypt = (text) => {
	return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(text));
  };
  
  const decrypt = (data) => {
	return CryptoJS.enc.Base64.parse(data).toString(CryptoJS.enc.Utf8);
  };

const Deg2Rad = Math.PI / 180;
const Rad2Deg = 180 / Math.PI;

const ENGLISH = "en";
const SWEDISH = "sv";

// Change this to scale the tree AND the greetings on the marker
// (For example, to scale everything up if a smaller marker is used)
const globalScalingFactor = 2;

hideHelpText();

parseQueryString();
initializeScene();
initializeAR();
initializeLights();
loadModels();
animate();
showHelpTextAfterWait();

function parseQueryString(){

	greetingId = 1;
	greetingName = "Santa";
	language = ENGLISH;
	treeId = 4;

	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	if(urlParams.has("data")){
		var datastring = urlParams.get("data");
		if(datastring == "surprise"){
			rick = true;
		} else {
			var decryptedData = decrypt(datastring); //Like this: 2|Paddy|sv|1
			//console.log(decryptedData);
			var bits = decryptedData.split("|");
			if(bits.length  >= 4){
				if(isInt(bits[0])) {
					greetingId = parseInt(bits[0]);
				}
				if(bits[1].length > 0) {
					//greetingName = SensorGreetingNames ( decodeURI(bits[1]) );
					greetingName = decodeURI(bits[1]);
				}
				if(bits[2] == SWEDISH) {
					language = SWEDISH;
				}
				if(isInt(bits[3])) {
					treeId = parseInt(bits[3]);
				}
			}
		}
	}


function SensorGreetingNames(oldName) {

	const loweredOldName = oldName.toLowerCase();

	var sensored_words_arr_sv=new Array("jävla","skit","helvete");
	var sensored_words_arr_en=new Array("fuck","shit","hell");

	sensored_words_arr_en.concat(sensored_words_arr_sv);


	if ( sensored_words_arr_en.indexOf(loweredOldName) < 0 ) {

		return language === ENGLISH ? "Santa" : "Tomten";

	} else { 

		return oldName;
	}
	
}


	console.log("---------------");
	console.log(greetingId);
	console.log(greetingName);
	console.log(language);
	console.log(treeId);
	console.log("---------------");

	if(language == ENGLISH){
		var el = document.getElementById("create_sv");
		el.style.display = "none";
	} else {
		var el = document.getElementById("create_en");
		el.style.display = "none";
	}

	if(greetingId == 1){
		greetingText = language === ENGLISH ? "Merry Christmas!" : "God jul och gott nytt år!";
	} else if (greetingId == 2){
		greetingText = language === ENGLISH ? "A very innovative christmas!" : "Ha en riktig innovativ jul!";
	} else if (greetingId == 3){
		greetingText = language === ENGLISH ? "Season's greetings!" : "Hoppas du får en vit jul!";
	} else if (greetingId == 4){
		greetingText = language === ENGLISH ? "Ho ho ho!" : "En julk(AR)amell till dig!";
	} else if (greetingId == 5){
		greetingText = language === ENGLISH ? "Happy holidays!" : "En god jul (på distans)!";
	} else if (greetingId == 6){
		greetingText = language === ENGLISH ? "Xmas greetings!" : "God helg!";
	} else {
		// FALLBACK
		greetingText = language === ENGLISH ? "Merry Christmas!" : "God jul!";
	}

	if(treeId == 1){
		modelName = "tree1";
		modelPos = new THREE.Vector3( 0, 0.1, 0 );
		modelScale = 0.01 * globalScalingFactor;

	} else if (treeId == 2){
		modelName = "tree2";
		modelPos = new THREE.Vector3( 0, 0.1, 0 );
		modelScale = 0.35 * globalScalingFactor;

	} else if (treeId == 3){
		modelName = "tree3";
		modelPos = new THREE.Vector3( 0, 0.1, 0 );
		modelScale = 3 * globalScalingFactor;

	} else if (treeId == 4){
		modelName = "tree4";
		modelPos = new THREE.Vector3( 0, 0.1, 0 );
		modelScale = 0.03 * globalScalingFactor;

	} else {
		// FALLBACK
		modelName = "tree4";
		modelPos = new THREE.Vector3( 0, 0.1, 0 );
		modelScale = 0.03 * globalScalingFactor;
	}

	if(rick){
		modelName = "rick";
		modelPos = new THREE.Vector3( 0, 0.1, 0 );
		modelScale = 0.06 * globalScalingFactor;
		audio = new Audio("assets/music/rick.mp3");
		greetingText = "Tis the season to be rolled!"
		greetingName = "Santarick"
	}

}

function initializeAR(){

	////////////////////////////////////////////////////////////
	// setup arToolkitSource
	////////////////////////////////////////////////////////////
/* */
		
	arToolkitSource = new THREEx.ArToolkitSource({
		sourceType : 'webcam',
	});

	function onResize()
	{
		arToolkitSource.onResize()	
		arToolkitSource.copySizeTo(renderer.domElement)	
		if ( arToolkitContext.arController !== null )
		{
			arToolkitSource.copySizeTo(arToolkitContext.arController.canvas)	
		}
		audio.play();
		audio.volume = 0;
	}

	arToolkitSource.init(function onReady(){
		onResize()
	});

	// handle resize event
	window.addEventListener('resize', function(){
		//console.log("resize!");
		onResize();
	});

	window.addEventListener('mousemove', function(){
		//console.log("mousemove!");
		//audio.play();
		//audio.volume = 0;
	});

	////////////////////////////////////////////////////////////
	// setup arToolkitContext
	////////////////////////////////////////////////////////////

	// create atToolkitContext
	arToolkitContext = new THREEx.ArToolkitContext({
		cameraParametersUrl: cameraParaPath,
		detectionMode: 'mono'
	});

	// copy projection matrix to camera when initialization complete
	arToolkitContext.init( function onCompleted(){
		camera.projectionMatrix.copy( arToolkitContext.getProjectionMatrix() );
	});

	////////////////////////////////////////////////////////////
	// setup markerRoots
	////////////////////////////////////////////////////////////

	// build markerControls
	markerRoot1 = new THREE.Group();
	scene.add(markerRoot1);

	let markerControls1 = new THREEx.ArMarkerControls(arToolkitContext, markerRoot1, {
		type: 'pattern', patternUrl: patternPath,
	})

	let geometry1 = new THREE.PlaneBufferGeometry(1,1, 4,4);
	//let loader = new THREE.TextureLoader();
	// let texture = loader.load( 'images/earth.jpg', render );
	let material1 = new THREE.MeshBasicMaterial( { color: 0x0000ff, opacity: 0.5 } );
	mesh0 = new THREE.Mesh( geometry1, material1 );
	mesh0.rotation.x = -Math.PI/2;
	markerRoot1.add( mesh0 );

	markerControls1.addEventListener('markerFound', function(event){
		if(!markerFound){
			markerFound = true;
			hideHelpText();
			console.log("Marker found!");
			audio.currentTime = 0;
			audio.volume = 0.6;
		}
	})

	//----------------------------------------

}

function initializeScene()
{
	// Define scene
	scene = new THREE.Scene();

	// Define camera
	camera = new THREE.Camera();
	scene.add(camera);

	renderer = new THREE.WebGLRenderer({
		antialias : true,
		alpha: true
	});
	renderer.setClearColor(new THREE.Color('lightgrey'), 0)
	renderer.setSize( 640, 480 );
	renderer.domElement.style.position = 'absolute'
	renderer.domElement.style.top = '0px'
	renderer.domElement.style.left = '0px'
	renderer.domElement.style.zIndex = '-1'

	document.body.appendChild( renderer.domElement );

	clock = new THREE.Clock();
	deltaTime = 0;
	totalTime = 0;
}

async function loadModels(){
	LoadGLTF(modelName, modelPos, modelScale);
	AddGreeting(greetingText, greetingName);
}

function initializeLights()
{
	AddLights1();
}


function AddLights1() {

	const color = 0xFFFFFF;
	const intensity = 6;
	const light = new THREE.DirectionalLight( color, intensity );
	light.position.set( 250, 100, 20 );

	scene.add( light );
	scene.add( light.target );

	const ambientLight = new THREE.AmbientLight(  0xFFFFFF );
	ambientLight.intensity = 0.3;

	scene.add( ambientLight );

}

function LoadGLTF(name, pos, scale){
	const gltfLoader = new GLTFLoader();
	gltfLoader.load( modelsPath + "/" + name + '.glb',
		function ( gltf ) {
			gltf.animations; // Array<THREE.AnimationClip>
			mesh1 = gltf.scene.children[0];
			mesh1.position.x = pos.x;
			mesh1.position.y = pos.y;
			mesh1.position.z = pos.z;
			mesh1.scale.set(scale, scale, scale);
			markerRoot1.add(mesh1);
		}, onProgress, onError
	);
}

async function AddGreeting(greeting, name){

	const from = "From " + name;

	const textLoader = new THREE.FontLoader();
	const font = await textLoader.loadAsync( fontsPath + "/" + "Grand Hotel_Regular.json");

	// Correct scaling for long texts
	var lengthScalingFactor = 1.0;
	if(greetingText.length > 10){
		lengthScalingFactor = 1.0 - (greetingText.length - 10) * 0.04;
		lengthScalingFactor = clamp(lengthScalingFactor, 0.6, 1.0);
	}

	// TEXT GREETING
	const greetingGeometry = new THREE.TextGeometry(greeting, {
		font: font,
		size: 3,
		height: 0.1,
		curveSegments: 12,
		bevelEnabled: true, 
		bevelThickness: 0.1,
		bevelSize: 0.01,
		bevelOffset: 0,
		bevelSegments: 5,
	} );
	greetingGeometry.rotateX( -30 * Deg2Rad );
	var scaling = globalScalingFactor * lengthScalingFactor;
	greetingGeometry.scale(0.2 * scaling, 0.2 * scaling, 0.2 * scaling);
	greetingGeometry.center();
	greetingGeometry.translate(0, 1.2 * globalScalingFactor, 2 * globalScalingFactor);

	const textMaterial1 = new THREE.MeshStandardMaterial( {
		color: 0x99ffff
	} );

	const textMeshGreeting = new THREE.Mesh( greetingGeometry, textMaterial1 );
	markerRoot1.add(textMeshGreeting);

	var fromText = (language === ENGLISH ? "From " : "Hälsar ") + name;

	const nameGeometry = new THREE.TextGeometry(fromText, {
		font: font,
		size: 3,
		height: 0.1,
		curveSegments: 12,
		bevelEnabled: true, 
		bevelThickness: 0.1,
		bevelSize: 0.01,
		bevelOffset: 0,
		bevelSegments: 5,
	} );
	//geometry.rotateX( Math.PI );
	nameGeometry.rotateX( -30 * Deg2Rad );
	nameGeometry.scale(0.14 * globalScalingFactor, 0.14 * globalScalingFactor, 0.14 * globalScalingFactor);
	nameGeometry.center();
	nameGeometry.translate(0, 0.6 * globalScalingFactor, 2 * globalScalingFactor);

	const textMaterial2 = new THREE.MeshStandardMaterial( {
		color: 0xf2f954
	} );

	const textMeshName = new THREE.Mesh( nameGeometry, textMaterial2 );
	markerRoot1.add(textMeshName);

}

function update()
{
	if ( arToolkitSource.ready !== false ) {
		arToolkitContext.update( arToolkitSource.domElement );
	}
}


function render()
{
	renderer.render( scene, camera );
}


function animate()
{
	requestAnimationFrame(animate);
	deltaTime = clock.getDelta();
	totalTime += deltaTime;
	update();
	render();
}

async function showHelpTextAfterWait()
{
	await delay(5000);
	if(!markerFound){
		showHelpText();
	}

}

function hideHelpText()
{
	document.getElementById("help_sv").style.display = "none";
	document.getElementById("help_en").style.display = "none";
	document.getElementById("help").style.display = "none";
}

function showHelpText()
{
	if(language == ENGLISH){
		document.getElementById("help_en").style.display = "block";
	} else {
		document.getElementById("help_sv").style.display = "block";
	}
	document.getElementById("help").style.display = "block";
}