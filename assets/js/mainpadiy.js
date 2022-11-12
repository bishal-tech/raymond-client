
import * as THREE from './threejs/build/three.module.js';
import { OrbitControls } from './threejs/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from './threejs/examples/jsm/loaders/FBXLoader.js';

var container, controls;
var camera, scene, renderer, light;
var mouse, raycaster;
var type;
var isMobile = false;
var dir = new THREE.Vector3();
var activeView = "Front";
var bottomDistance = 170;
var rightDistance = 120;

var arrCustomization = []

var frustumSize = 100;
var id;
function getWidth() {
	// console.log("Width: ---" + document.querySelector('#fbx-scene').getBoundingClientRect().width);
	return document.querySelector('#customizer').getBoundingClientRect().width;
}

function getHeight() {
	// console.log("Height: ----" + document.querySelector('#fbx-scene').getBoundingClientRect().width);
	return document.querySelector('#customizer').getBoundingClientRect().height;
}

export function initPadiy(customizationObj, customizationType, customizationUrl, isApp) {
	let aspect = getWidth() / getHeight();
	type = customizationType;
	container = document.getElementById('customizer');
	raycaster = new THREE.Raycaster();
	mouse = new THREE.Vector2();

	isMobile = isApp;

	switch(type) {
		case "shirt":
		case "trouser":
		case "chinos":
		case "shorts":
		case "jeans":
			if(isApp){
				frustumSize = 90;
			}else{
				frustumSize = 80;
			}
			break;
		default:
			break;

	}

	camera = new THREE.OrthographicCamera(frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, -100, 1000);

	switch(type) {
		case "shirt":
			camera.position.set( 0, 120, 0 )
			break;
		case "trouser":
			camera.position.set( 2, 60, 160 );
			break;
		case "chinos":
			camera.position.set( 2, 80, 160 );
			break;
		case "shorts":
			camera.position.set( 2, 60, 100 );
			break;
		case "jeans":
			camera.position.set( 2, 60, 160 );
			break;
		default:
			break;

	}
	
	

	// light = new THREE.PointLight( 0xffffff, 1 );
	// camera.add( light );

	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xf9f9f9 );
	
	var helper;
	// console.log(customizationObj.base_material.light_one_intensity);
	// console.log(customizationObj.base_material.light_two_intensity);
	// var arrDirectionalLight = [
	// 	{"dir": new THREE.Vector3( 0, 1, 50 ), "intensity": customizationObj.base_material.light_one_intensity, "color": 0xfffee7 },
	// 	{"dir": new THREE.Vector3( 200, -300, 1 ), "intensity": customizationObj.base_material.light_one_intensity, "color": 0xffffff },
	// 	{"dir": new THREE.Vector3( -200, -300, 0 ), "intensity": customizationObj.base_material.light_one_intensity, "color": 0xffffff },
	// 	{"dir": new THREE.Vector3(  0, 1, -50 ), "intensity": customizationObj.base_material.light_one_intensity, "color": 0xfffee7 },
	// 	{"dir": new THREE.Vector3( 0, 300, 550 ), "intensity": customizationObj.base_material.light_one_intensity, "color": 0xffffff },
	// 	{"dir": new THREE.Vector3( 0, 300, -550 ), "intensity": customizationObj.base_material.light_two_intensity, "color": 0xffffff }
	// ]

	// for(var i=0; i<arrDirectionalLight.length; i++) {
	// 	light = new THREE.DirectionalLight( arrDirectionalLight[i].color, arrDirectionalLight[i].intensity );
	// 	light.position.set( arrDirectionalLight[i].dir.x, arrDirectionalLight[i].dir.y, arrDirectionalLight[i].dir.z );
	// 	scene.add( light );
	// 	// var helper = new THREE.DirectionalLightHelper( light, 5, 0x444444 );
	// 	// scene.add( helper );
	// }



	switch(type) {
		case "shirt":
			shirtInitPadiy(customizationObj, scene, customizationUrl);
			break;
		case "trouser":
		case "chinos":
		case "shorts":
			trouserInitPadiy(customizationObj, scene, customizationUrl);
			break;
		case "jeans":
			jeansInit(customizationObj, scene, customizationUrl);
			break;
		default:
			break;

	}

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( getWidth(), getHeight() );
	renderer.shadowMap.enabled = true;
	renderer.shadowMapSoft = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	container.appendChild( renderer.domElement );

	controls = new OrbitControls( camera, renderer.domElement );
	controls.minZoom = 0.5;
	controls.maxZoom = 3;
    controls.enableRotate = false;
    controls.enableZoom = false;
	controls.enablePan = false;
	controls.enabled = false;
	switch(type) {
		case "shirt":
			controls.minZoom = 0.5;
			controls.maxZoom = 10;
			controls.minDistance = 40;
			controls.maxDistance = 150;
			controls.target.set( 0, 120, 0 );
			break;
		case "trouser":
			controls.minDistance = 40;
			controls.maxDistance = 150;
			controls.target.set( 0, 60, 0 );
			break;
		case "chinos":
			controls.minDistance = 40;
			controls.maxDistance = 150;
			controls.target.set( 0, 60, 0 );
			break;
		case "shorts":
			controls.minDistance = 40;
			controls.maxDistance = 150;
			controls.target.set( 0, 80, 0 );
			break;
		case "jeans":
			controls.minDistance = 40;
			controls.maxDistance = 150;
			controls.target.set( 0, 60, 0 );
			break;
		default:
			break;
	}
	//commit
	controls.minAzimuthAngle = - Infinity;
	controls.maxAzimuthAngle = Infinity;
	// controls.minDistance = 40;
	// controls.maxDistance = 150;
	controls.autoRotate = false;
	controls.touches.ONE = THREE.TOUCH.ROTATE;
	controls.touches.TWO = THREE.TOUCH.DOLLY_PAN;
	controls.minPolarAngle = Math.PI/2;
	controls.maxPolarAngle = Math.PI/2;
	controls.enableDamping = false; 
	controls.dampingFactor = 0.05;
	window.addEventListener( 'resize', onWindowResize, false );
	//addTouchEvent();
	animate();
}

	window.initPadiy = initPadiy;

function tweenUpdate(duration, position, targetPosition, zoomPosition) {
	
	var tween = new TWEEN.Tween(position)
	.to(targetPosition, duration)
	.easing( TWEEN.Easing.Sinusoidal.InOut )
	.onUpdate(function () {
		camera.position.copy(position);
		camera.lookAt( controls.target );
	})
	.onComplete(function () {
		camera.position.copy( targetPosition );
		camera.lookAt( controls.target );
		controls.enabled = false;
	})
	.start();


	var zoom = {
		value: camera.zoom
	};
	var zoomEnd = {
		value: zoomPosition
	};
	var tweenZoom = new TWEEN.Tween(zoom).to(zoomEnd, duration/2);
	tweenZoom.easing = TWEEN.Easing.Sinusoidal.InOut;
	tweenZoom.onUpdate(function() {
		camera.zoom = zoom.value;
	});
	tweenZoom.start();
}

function tweenControlUpdate(duration, position, targetPosition) {
	var tween = new TWEEN.Tween(position)
	.to(targetPosition, duration)
	.easing( TWEEN.Easing.Sinusoidal.InOut )
	.onUpdate(function () {
		controls.target.copy( position );
	})
	.onComplete(function () {
		controls.target.copy( targetPosition );
		controls.enabled = false;
	})
	.start();
}


export function selectCategoryPadiy(positionX, positionY, positionZ, controlX, controlY, controlZ, zoomPosition, mobileAdjust = true) {
	//console.log("Adjust"+mobileAdjust);
	if(isMobile && mobileAdjust){
		zoomPosition = zoomPosition-0.6;
	}
	console.log(zoomPosition);
	
	controls.enabled = false;
	var duration = 700;
	var position = new THREE.Vector3().copy(camera.position);
	var targetPosition = new THREE.Vector3(positionX, positionY, positionZ);
	tweenUpdate(duration, position, targetPosition, zoomPosition)
	var controlPosition = new THREE.Vector3().copy(controls.target);
	var controlTargetPosition = new THREE.Vector3(controlX, controlY, controlZ);
	tweenControlUpdate(duration, controlPosition, controlTargetPosition);
    onWindowResize();
}
window.selectCategoryPadiy = selectCategoryPadiy;

export function resetModelPadiy() {
	controls.enabled = false;
	var duration = 700;
	var position = new THREE.Vector3().copy(camera.position);
	var targetPosition = new THREE.Vector3(2, 120, 100);
	
	var controlPosition = new THREE.Vector3().copy(controls.target);
	var controlTargetPosition = new THREE.Vector3(0, 120, 0);
	switch(type) {
		case "shirt":
			targetPosition = new THREE.Vector3( 0, 120, 0);
			controlTargetPosition = new THREE.Vector3(0, 120, 0);
			break;
		case "trouser":
			targetPosition = new THREE.Vector3( 2, 60, 160 );
			controlTargetPosition = new THREE.Vector3(0, 60, 0);
			break;
		case "chinos":
			targetPosition = new THREE.Vector3( 2, 80, 160 );
			controlTargetPosition = new THREE.Vector3(0, 60, 0);
			break;
		case "shorts":
			targetPosition = new THREE.Vector3( 2, 80, 100 );
			controlTargetPosition = new THREE.Vector3(0, 80, 0);
			break;
		case "jeans":
			targetPosition = new THREE.Vector3( 2, 60, 160 );
			controlTargetPosition = new THREE.Vector3(0, 60, 0);
			break;
		case "shirt_fullbody":
		case "trouser_fullbody":
		case "chinos_fullbody":
		case "shorts_fullbody":
		case "jeans_fullbody":
			targetPosition = new THREE.Vector3( 2, 90, 340 );
			controlTargetPosition = new THREE.Vector3(0, 90, 0);
			break;
		default:
			break;

	}
	tweenUpdate(duration, position, targetPosition, 1);
	tweenControlUpdate(duration, controlPosition, controlTargetPosition);
    onWindowResize();
}

window.resetModelPadiy = resetModelPadiy;

export function selectCustomizationItemPadiy(item, type) {
	switch(type) {
		case "shirt":
			selectShirtCustomizationItemPadiy(item);
			break;
		case "trouser":
		case "chinos":
		case "shorts":
			selectTrouserCustomizationItemPadiy(item);
			break;
		case "jeans":
			selectJeansCustomizationItem(item);
			break;
		default:
			break;

	}

}

window.selectCustomizationItemPadiy = selectCustomizationItemPadiy;

function onWindowResize() {
	//console.log(document.getElementById('customizer_selection').clientHeight-50);
	//document.getElementById("customizer").style.height = document.getElementById('customizer_selection').clientHeight+'px';
	const aspect = getWidth() / getHeight();

	camera.left = - frustumSize * aspect / 2;
	camera.right = frustumSize * aspect / 2;
	camera.top = frustumSize / 2;
	camera.bottom = - frustumSize / 2;

	camera.updateProjectionMatrix();
	renderer.setSize( getWidth(), getHeight() );

}

function animate() {
	camera.updateProjectionMatrix();
	id = requestAnimationFrame(animate);
	TWEEN.update();
	render();
	controls.update();
}

function render() {
	controls.update();
	renderer.render(scene, camera);
}

export function updateMonogramPadiy(value, type, monogramUpdateType) {
	switch(type) {
		case "shirt":
			updateShirtMonogramPadiy(value, monogramUpdateType);
			break;
		case "trouser":
		case "chinos":
		case "shorts":
			break;
		case "jeans":
			break;
		default:
			break;

	}
}

window.updateMonogramPadiy = updateMonogramPadiy;	


					
