import * as THREE from "./vendor/three127/build/three.module.js";
import { GLTFLoader } from "./vendor/three127/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "./vendor/three127/examples/jsm/controls/OrbitControls.js";

var language=document.getElementById("language").value;
var scene1, camera1, renderer1,controls1,container1;
var textGroup,language;
var modelsPath = "assets/models"
var webpageQuery = window.location.search;

//const temp = language === 'en' ? "Your text: " : "Din text: ";
//document.getElementById("exampleText").innerHTML = "<p><i>"+temp + "</i></p>"; 
document.getElementById("qrcodeBtn").focus(); 


var r = /\d+/;

julgran =  (webpageQuery.match(r));
function onProgress(xhr) { 
	console.log( (xhr.loaded / xhr.total * 100) + '% loaded' ); 
}
function onError(xhr) { console.log( 'ERROR: ' + xhr); }

const Deg2Rad = Math.PI / 180;
const Rad2Deg = 180 / Math.PI;
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);


window.onload = function() {
    console.log(webpageQuery)
	initializeScene();
	initializeLights();
	loadModels();
	animate();
  };

//postExampleText();

document.getElementById("christmas-greeting").addEventListener('change', (event) => { postExampleText() } );
document.getElementById("qrcodeBtn").addEventListener('keyup', (event) => { postExampleText() } );
  
function initializeScene()
{
	var container1 = document.getElementById("ida5");

	const w1 = container1.offsetWidth-8;
	const h1 = container1.offsetHeight-8;

	renderer1 = new THREE.WebGLRenderer( { antialias: true,alpha: true } );
	renderer1.setClearColor('#FFFFFF', 0);
	renderer1.setSize( w1, h1, false );

	container1.appendChild( renderer1.domElement );

	scene1 = new THREE.Scene();
	camera1 = new THREE.PerspectiveCamera( 45, w1 / h1, 1, 100 );
	camera1.position.set( 0, 2, 8);
	
	controls1 = new OrbitControls( camera1, renderer1.domElement );
	controls1.target = new THREE.Vector3( 0, 2.5, 0 );


	textGroup = new THREE.Group;
	scene1.add (textGroup);

	controls1.update();

}

function loadModels(){
    
    var modelPos,modelScale;
    if(julgran == 1){

    modelPos = new THREE.Vector3( 0, 0, 0 ); 
	modelScale = 0.015;
	LoadGLTF(scene1,"tree1", modelPos, modelScale);


    }
    if(julgran == 2){
    modelPos = new THREE.Vector3( 0, 0, 0 );
	modelScale = 0.33;
	LoadGLTF(scene1,"tree2", modelPos, modelScale);


    }
    if(julgran == 3){
        modelPos = new THREE.Vector3(0, 0, 0 );
        modelScale = 2.7;
        LoadGLTF(scene1,"tree3", modelPos, modelScale);

    }
    if(julgran == 4){
		modelPos = new THREE.Vector3( 0, 0, 0 );
		modelScale = 0.03;
		LoadGLTF(scene1,"tree4", modelPos, modelScale);

    }
	

	
}

function initializeLights()
{
	AddLights1(scene1);

}


function AddLights1(scene) {

	const color = 0xAAFFAA;
	const intensity = 2;
	const light = new THREE.DirectionalLight( color, intensity );
	light.position.set( 10, 40, 40 );

	scene.add( light );
	scene.add( light.target );

	const ambientLight = new THREE.AmbientLight(  0xFFFFFF );
	ambientLight.intensity = 0.7;

	scene.add( ambientLight );

}

function LoadGLTF(scene,name, pos, scale){
	const gltfLoader = new GLTFLoader();
	gltfLoader.load( modelsPath + "/" + name + '.glb',
		function ( gltf ) {
			gltf.animations; 
			const mesh1 = gltf.scene.children[0];
			mesh1.position.x = pos.x;
			mesh1.position.y = pos.y;
			mesh1.position.z = pos.z;
			mesh1.scale.set(scale, scale, scale);
			mesh1.name=scene;
			scene.add(mesh1);

		}, onProgress, onError
	);
}

function postExampleText() {
	var greetingId = document.getElementById("christmas-greeting").value;
	var sender = document.getElementById("qrcodeBtn").value;
	var greetingText,printText;


	if(greetingId == 1){
		greetingText = language === 'en' ? "Merry Christmas!" : "God jul och gott nytt år!";
	} else if (greetingId == 2){
		greetingText = language === 'en' ? "A very innovative christmas!" : "Ha en riktig innovativ jul!";
	} else if (greetingId == 3){
		greetingText = language === 'en' ? "Season’s greetings!" : "Hoppas du får en vit jul!";
	} else if (greetingId == 4){
		greetingText = language === 'en' ? "Ho ho ho!" : "En julk(AR)amell till dig!";
	} else if (greetingId == 5){
		greetingText = language === 'en' ? "Happy holidays!" : "En god jul (på distans)!";
	} else if (greetingId == 6){
		greetingText = language === 'en' ? "Xmas greetings!" : "God helg!";
	} else {
		// FALLBACK
		greetingText = "";
	} 
 
	if ( greetingId != "0" && sender != "" ) {
		const temp = language === 'en' ? " from " : " önskar ";
		printText = greetingText +  temp + sender;
		document.getElementById("skapaQrCode").disabled = false;
		document.getElementById("julBtnHolder").classList.add("cta");
		document.getElementById("julBtnHolder").classList.remove("ctaInactive");
		RenderGreeting(greetingText,temp,sender);
	} else {
		 printText = "";
		 document.getElementById("skapaQrCode").disabled = true;
		 document.getElementById("julBtnHolder").classList.remove("cta");
		 document.getElementById("julBtnHolder").classList.add("ctaInactive");
		 RenderGreeting('','','');
	}
	const temp = language === 'en' ? "Your text: " : "Din text: ";

	//document.getElementById("exampleText").innerHTML = "<p><i>"+temp + "</i>" +  printText  + "</p>"; 
}

function RenderGreeting(greetingText,wishes,sender){

	//remove old text
	textGroup.remove(...textGroup.children);

	// Correct scaling for long texts
	var scalingFactor = 1.0;
	if(greetingText.length > 10){
		scalingFactor = 1.0 - (greetingText.length - 10) * 0.04;
		scalingFactor = clamp(scalingFactor, 0.6, 1.0);
	}

    var loader = new THREE.FontLoader();
	loader.load( 'assets/fonts/Grand Hotel_Regular.json', function ( font ) {
        var geometry = new THREE.TextBufferGeometry( greetingText+'', {
            font: font,
            size: 3,
            height: 0.1,
            curveSegments: 6,
			bevelThickness: 0.1,
			bevelSize: 0.01,
			bevelOffset: 0,
			bevelSegments: 5
        } );

        geometry.center();
		geometry.scale(0.2 * scalingFactor, 0.2 * scalingFactor, 0.2 * scalingFactor);
		geometry.center();
		geometry.translate(0, 1, 1.75);

        const material = new THREE.MeshStandardMaterial(
            { color: 0x99ffff}
        );

        const mesh = new THREE.Mesh( geometry, material );

        
        textGroup.add( mesh );	
    } );

	loader.load( 'assets/fonts/Grand Hotel_Regular.json', function ( font ) {
        var geometry = new THREE.TextBufferGeometry( wishes+'', {
            font: font,
            size: 2,
            height: 0.1,
            curveSegments: 6,
			bevelThickness: 0.1,
			bevelSize: 0.01,
			bevelOffset: 0,
			bevelSegments: 5
        } );

        geometry.center();
		geometry.scale(0.2 * scalingFactor, 0.2 * scalingFactor, 0.2 * scalingFactor);
		geometry.center();
		geometry.translate(0, 0.5, 1.75);

        const material = new THREE.MeshStandardMaterial(
            { color: 0x224422}
        );

        const mesh = new THREE.Mesh( geometry, material );

        
        textGroup.add( mesh );	
    } );

	loader.load( 'assets/fonts/Grand Hotel_Regular.json', function ( font ) {
        var geometry = new THREE.TextBufferGeometry( sender+'', {
            font: font,
            size: 3,
            height: 0.1,
            curveSegments: 6,
			bevelThickness: 0.1,
			bevelSize: 0.01,
			bevelOffset: 0,
			bevelSegments: 5
        } );

        geometry.center();
		
		geometry.scale(0.14, 0.14, 0.14);;
		geometry.center();
		geometry.translate(0, 0, 1.75);

        const material = new THREE.MeshStandardMaterial(
            { color: 0x449944}
        );

        const mesh = new THREE.Mesh( geometry, material );

        
        textGroup.add( mesh );	
    } );

	textGroup.rotation.x = -10 * Deg2Rad;

}


function render()
{
	renderer1.render( scene1, camera1 );

}


function animate()
{
	requestAnimationFrame(animate);
	scene1.rotation.y += 0.005;
	controls1.update();
	
	render();
}
