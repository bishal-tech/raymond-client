
import * as THREE from './threejs/build/three.min.js';
import { OrbitControls } from './threejs/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from './threejs/examples/jsm/loaders/FBXLoader.js';

var container, controls;
var camera, scene, renderer, light;
var mouse, raycaster;
var type;

var dir = new THREE.Vector3();

var bottomDistance = 170;
var rightDistance = 120;

var arrCustomization = []
var mouseClickedCallBack;

var frustumSize = 100;
var isLoadingFbx = false;
var isDarkLightMap = false;
var shirtLightMapIntensity = 0.6;
var customizationObj;
var baseUrl = "";
var baseMaterial;
var stichMaterial;
var buttonMaterial;
var buttonLightMapMaterial;
var monogramLightMapMaterial;
var bottomType = "round"; // round, straight
var collarPocketShadowMaterial;
var shirtLightMapMaterialLight;
var shirtLightMapMaterialDark;
var buttonHoleMaterial;
var buttonStichMaterial;
var arrLoadedObj = [];
var arrLoadedObjBack = [];
var shirtLightMapMaterialLight;
var shirtLightMapMaterialDark;
var textureLoader = new THREE.TextureLoader();
var selectedStyleMaterial = {};
var buttonLightMapIntensity = 0.6;
var currentParent;
var arrItemsBack = [];
var arrMonogramPosition;
var activeView = "Front";
var cuffObjectIndex = -1;
var cuffObjcet;
var monogramMaterialPath = "";
var monogramMaterial;
var monogramPostion;
var selectedSleeveID = "e4c7a9d8-9378-49a5-9701-04f46fb5dc74";
var id;
var isMobile = false;
var productWishListCustomization = null;

function getWidth() {
	//console.log("Width: ---" + document.querySelector('#customizer').getBoundingClientRect().width);
	return document.querySelector('#customizer').getBoundingClientRect().width;
}

function getHeight() {
	//console.log("Height: ----" + document.querySelector('#customizer').getBoundingClientRect().height);
	return document.querySelector('#customizer').getBoundingClientRect().height;
}

export function initCustomizerView(customizationObj, wishListCustomization, customizationType, customizationUrl, bodyType, isApp){
	let aspect = getWidth() / getHeight();
	type = customizationType;
	container = document.getElementById('customizer');
	raycaster = new THREE.Raycaster();
	mouse = new THREE.Vector2();
	isMobile = isApp;

	// camera = new THREE.PerspectiveCamera( 45, getWidth() / getHeight(), 1, 2000 );
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xf9f9f9 );

    switch(type) {
		case "shirt":
			if(isApp){
				frustumSize = 90;
			}else{
				frustumSize = 80;
			}
			break;
		case "trouser":
		case "chinos":
		case "shorts":
		case "jeans":
			if(isApp){
				frustumSize = 110;
			}else{
				frustumSize = 100;
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
			camera.position.set( 2, 55, 160 );
			break;
		default:
			break;
	}
    switch(type) {
		case "shirt":
			MTOshirtInit(customizationObj, wishListCustomization, scene, customizationUrl, bodyType, false);
			break;
		case "jeans":
			jeansInit(customizationObj, wishListCustomization, scene, customizationUrl, false);
			break;
		default:
			break;

	}
    renderer = new THREE.WebGLRenderer({ antialias: true });
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
			controls.target.set( 0, 55, 0 );
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
function onWindowResize() {
	// camera.aspect = getWidth() / getHeight();
	const aspect = getWidth() / getHeight();

	camera.left = - frustumSize * aspect / 2;
	camera.right = frustumSize * aspect / 2;
	camera.top = frustumSize / 2;
	camera.bottom = - frustumSize / 2;

	camera.updateProjectionMatrix();
	renderer.setSize( getWidth(), getHeight() );

}

function animate() {
	if(camera!=null){
		camera.updateProjectionMatrix();
	}
	
	id = requestAnimationFrame(animate);
	TWEEN.update();
	render();
	controls.update();
}

function render() {
	controls.update();
	renderer.render(scene, camera);
}
export function selectCategory(positionX, positionY, positionZ, controlX, controlY, controlZ, zoomPosition, visibility, mobileAdjust = true, zoomMobile = "") {
	setTimeout( ()=>{
		//console.log("Zoom"+zoomPosition);
		if(isMobile && mobileAdjust){
			if(zoomMobile!=""){
				zoomPosition = zoomMobile;
			}else{
				if(type == 'shirt'){
					zoomPosition = zoomPosition-0.2;
				}else{
					zoomPosition = zoomPosition-0.4;
				}
			}
		}
		
		controls.enabled = false;
		var duration = 700;
		var position = new THREE.Vector3().copy(camera.position);
		var targetPosition = new THREE.Vector3(positionX, positionY, positionZ);
		tweenUpdate(duration, position, targetPosition, zoomPosition)
		var controlPosition = new THREE.Vector3().copy(controls.target);
		var controlTargetPosition = new THREE.Vector3(controlX, controlY, controlZ);
		tweenControlUpdate(duration, controlPosition, controlTargetPosition);
		onWindowResize();
		switch(type) {
			case "shirt":
				controlShirtVisibility(visibility);
				break;
			case "jeans":
				controlVisibilityJeans(visibility);
				break;
		}
	}, 100);
	
    
}
function controlShirtVisibility(visibility){
	activeView = visibility;
	if(visibility == 'Back'){
        for(var i=0; i<arrLoadedObj.length; i++) {
            arrLoadedObj[i].object.visible = false;
		}
        for(var i=0; i<arrLoadedObjBack.length; i++) {
            arrLoadedObjBack[i].object.visible = true;
		}
        
    }else{
        for(var i=0; i<arrLoadedObjBack.length; i++) {
            arrLoadedObjBack[i].object.visible = false;
		}
        for(var i=0; i<arrLoadedObj.length; i++) {
            arrLoadedObj[i].object.visible = true;
		}
    }
}
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
export function resetModel() {
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
			targetPosition = new THREE.Vector3( 2, 55, 160 );
			controlTargetPosition = new THREE.Vector3(0, 55, 0);
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
window.resetModel = resetModel;

export function resetSelection(selectedItem,selectedChildItem){
	switch(type) {
		case "shirt":
			resetSelectionShirt(selectedItem,selectedChildItem);
			break;
		case "jeans":
			resetSelectionJeans(selectedItem,selectedChildItem);
			break;
	}
}
window.resetSelection = resetSelection;

function resetSelectionShirt(selectedItem,selectedChildItem){
	if(activeView == "Back"){
		for(var i=0; i<arrLoadedObjBack.length; i++) {
            arrLoadedObjBack[i].object.visible = false;
		}
        for(var i=0; i<arrLoadedObj.length; i++) {
            arrLoadedObj[i].object.visible = true;
		}
	}
	activeView = "Front";
	
    for(var i=0; i<customizationObj.list_item.length;i++) {
        let item = customizationObj.list_item[i];
        if(item.id==selectedItem) {
            console.log(item);
            let childItem = item.child;
            for(var j=0; j<childItem.length;j++) {
                if(childItem[j].child!= null && childItem[j].child.length>0){
                    if(childItem[j].id == selectedChildItem){
                        for(var k=0; k<childItem[j].child.length;k++) {
                            let childElm = childItem[j].child[k];
                            childElm.is_selected = false;
                            if(childElm.selectionType!=undefined && childElm.selectionType == 'final'){
                                childElm.is_selected = true;
                                selectMTOShirtCustomizationItem(childElm);
                            }
                        }
                    }
                }else{
                    childItem[j].is_selected = false;
                    if(childItem[j].selectionType!=undefined && childItem[j].selectionType == 'final'){
                        childItem[j].is_selected = true;
                        selectMTOShirtCustomizationItem(childItem[j]);
                    }
                }
            }

        }
    }
}

function applySelectionShirt(selectedItem,selectedChildItem){
	if(activeView == "Back"){
		for(var i=0; i<arrLoadedObjBack.length; i++) {
            arrLoadedObjBack[i].object.visible = false;
		}
        for(var i=0; i<arrLoadedObj.length; i++) {
            arrLoadedObj[i].object.visible = true;
		}
	}
	activeView = "Front";
    for(var i=0; i<customizationObj.list_item.length;i++) {
        let item = customizationObj.list_item[i];
        if(item.id==selectedItem) {
            let childItem = item.child;
            for(var j=0; j<childItem.length;j++) {
                if(childItem[j].child!= null && childItem[j].child.length>0){
                    if(childItem[j].id == selectedChildItem){
                        for(var k=0; k<childItem[j].child.length;k++) {
                            let childElm = childItem[j].child[k];
                            childElm.selectionType = 'temp';
                            if(childElm.is_selected){
                                childElm.selectionType = 'final';
                            }
                        }
                    }
                }else{
                    childItem[j].selectionType = 'temp';
                    if(childItem[j].is_selected){
                        childItem[j].selectionType = 'final';
                    }
                }
            }

        }
    }
	

	localStorage.setItem("selectedSleeveID",selectedSleeveID);
}

export function applySelection(selectedItem,selectedChildItem){
	switch(type) {
		case "shirt":
			applySelectionShirt(selectedItem,selectedChildItem);
			break;
		case "jeans":
			applySelectionJeans(selectedItem,selectedChildItem);
			break;
	}
}
window.applySelection = applySelection;

export function selectCustomizationItem(item, type) {
	switch(type) {
		case "shirt":
			selectMTOShirtCustomizationItem(item);
			break;
		case "trouser":
		case "chinos":
		case "shorts":
			selectTrouserCustomizationItem(item);
			break;
		case "jeans":
			selectJeansCustomizationItem(item);
			break;
		default:
			break;

	}

}

window.selectCustomizationItem = selectCustomizationItem;
function MTOshirtInit(obj, wishListCustomization, threeJsScene, customizationUrl, modelBodyType, isSimilarItem){
    var isCommonItemLoaded = false;
	var isListItemLoaded = false;
    customizationObj = obj;
    baseUrl = customizationUrl;
    arrItemsBack = customizationObj.list_item_back;

    if(obj.base_material.light_map_intensity) {
		shirtLightMapIntensity = parseFloat(obj.base_material.light_map_intensity);	
        //shirtLightMapIntensity = 1.4;	
	}

    if(obj.base_material.button_light_map_intensity) {
		buttonLightMapIntensity = parseFloat(obj.base_material.button_light_map_intensity);	
	}

	cuffObjcet = null;
	cuffObjectIndex = -1;
	arrMonogramPosition = JSON.parse(JSON.stringify(customizationObj.monogram_position));
	selectedStyleMaterial = {};
	productWishListCustomization = wishListCustomization;
	//update main customization object depending on wishlised customization
	if(wishListCustomization) {
		//style color set
		for(var i=0;i<wishListCustomization.selected_items.length;i++) {
			if(wishListCustomization.selected_items[i].parent_id=='908614ee-fd26-46cd-8e6c-814c9dd6f48e') {
				selectedStyleMaterial["collar_inside"] = {"material": wishListCustomization.selected_items[i].material}
			} else if(wishListCustomization.selected_items[i].parent_id=='9ff29c02-f7f8-46c0-b0be-877d7559002a') {
				selectedStyleMaterial["cuff_inside"] = {"material": wishListCustomization.selected_items[i].material}
			} else if(wishListCustomization.selected_items[i].parent_id=='661af857-db07-4417-9e66-4c7f05ddab73') {
				selectedStyleMaterial["placket_inside"] = {"material": wishListCustomization.selected_items[i].material}
			}
		}

		function getObject(parentId, arr) {

			var filter = wishListCustomization.selected_items.filter(function(item) {
        		return item.parent_id == parentId;
        	});
	        for (var i = 0; i < arr.length; i++) {
	        	if(filter.length>0) {
	        		if(filter[0].selected_id == arr[i].id) {
	        			arr[i].is_selected = true;
	        		} else {
	        			arr[i].is_selected = false;
	        		}		
	        	}
	            if (arr[i].child && arr[i].child.length > 0) {
	                getObject(arr[i].id, arr[i].child);
	            }
	        }
	    }
	    getObject("", customizationObj.list_item);
	}

	//for sleeve
	var search = customizationObj.list_item.filter(function (el) {
	  return el.id == "01a9d20f-fec4-421e-9b10-caeee857cee9";
	});
	if(search.length>0) {
		for(var i=0;i<search[0].child.length;i++) {
			if(search[0].child[i].is_selected) {
				hideUnhideCuff(search[0].child[i].id);
				if(search[0].child[i].id == 'e4c7a9d8-9378-49a5-9701-04f46fb5dc74') {
					//full sleeve
					showHideMonogram("sleeve_placket", true);
					showHideMonogram("cuff", true);
				} else if(search[0].child[i].id == 'b3150be2-80d4-4645-bb54-86977d1a895f') {
					//half seleeve
					showHideMonogram("sleeve_placket", false);
					showHideMonogram("cuff", false);
				}
			}
		}
	}

	var searchBack = customizationObj.list_item.filter(function (el) {
	  return el.id == "35e96c17-a1f7-402a-a96e-5eb64304446c";
	});
	if(searchBack.length>0) {
		for(var i=0;i<searchBack[0].child.length;i++) {
			if(searchBack[0].child[i].is_selected) {
				if(searchBack[0].child[i].id == "438d455b-469a-42bf-a7f5-8146d85258c6") {
					//round cut
					bottomType = "round";
				} else {
					//straight
					bottomType = "straight";
				}
			}
		}
	}
	
	baseMaterial = textureLoader.load(baseUrl+customizationObj.material.base);
	baseMaterial.wrapS = baseMaterial.wrapT = THREE.RepeatWrapping;
	baseMaterial.offset.set(0,0);
	baseMaterial.repeat.set(12,12);
    shirtLightMapMaterialDark = textureLoader.load(baseUrl+'texture/shirtlightmapdark.jpg');
	shirtLightMapMaterialLight = textureLoader.load(baseUrl+'texture/shirtlightmaplight.jpg');
    stichMaterial = textureLoader.load(baseUrl+customizationObj.material.stich);
	stichMaterial.wrapS = stichMaterial.wrapT = THREE.RepeatWrapping;
	buttonMaterial = textureLoader.load(baseUrl+customizationObj.material.button);
	buttonMaterial.wrapS = buttonMaterial.wrapT = THREE.RepeatWrapping;
	buttonHoleMaterial = textureLoader.load(baseUrl+customizationObj.material.button_hole);
	buttonHoleMaterial.wrapS = buttonHoleMaterial.wrapT = THREE.RepeatWrapping;
	buttonStichMaterial = textureLoader.load(baseUrl+customizationObj.material.button_stich);
	buttonStichMaterial.wrapS = buttonStichMaterial.wrapT = THREE.RepeatWrapping;
    buttonLightMapMaterial = textureLoader.load(baseUrl+'texture/buttonlightmap.jpg');
	collarPocketShadowMaterial = textureLoader.load(baseUrl+'texture/collarpocketshadowmap.png');
	collarPocketShadowMaterial.wrapS = collarPocketShadowMaterial.wrapT = THREE.RepeatWrapping;

    arrLoadedObj = [];
	arrLoadedObjBack = [];
	activeView = "Front";
	selectedSleeveID = "e4c7a9d8-9378-49a5-9701-04f46fb5dc74";
	
    loadModel(1, customizationObj.common_item[0], customizationObj.common_item, function(){
        //Common Item Loaded
        isCommonItemLoaded = true;
        // if(isListItemLoaded) {
        //     hideloader();
        // }
    },"Front");
	loadModel(1, customizationObj.common_item_back[0], customizationObj.common_item_back, function(){
        //Common Item Loaded
        //isCommonItemLoaded = true;
        // if(isListItemLoaded) {
        //     hideloader();
        // }
    },"Back");
    traverseListItem(customizationObj.list_item);
}
function traverseListItem(arrItems) {
	for(var i=0; i<arrItems.length;i++) {
        let item = arrItems[i];
        if(item.is_selected && item.fbx != null && item.fbx.length > 0) {
            loadModel(1, item.fbx[0], item.fbx, "","Front");
        }
        if(item.is_selected && item.fbxBack != null && item.fbxBack.length > 0 && arrItemsBack.includes(item.category)) {
			console.log(item.fbxBack);
            loadModel(1, item.fbxBack[0], item.fbxBack, "","Back");
        }



        if(item.child != null && item.child.length>0) {
            traverseListItem(item.child);
        }
    }
}
function loadModel(nextIndex, customizationObjItem, arrItems, callBack, view) {
	var loader = new FBXLoader();
	isLoadingFbx = true;
    function loadMaterial(node, item) {
		var newMaterial = baseMaterial;
		if(item.material != "-1") {
			newMaterial = textureLoader.load(baseUrl+item.material);
			newMaterial.offset.set(0,0);
			newMaterial.repeat.set(12,12);
			newMaterial.wrapS = newMaterial.wrapT = THREE.RepeatWrapping;
			node.material.map = newMaterial	
		}
	}
	function setupMaterial(node, materialType,bumpMap) {
        //console.log(bumpMap);
		switch(materialType) {
			case "0": //base
				// node.material.map = baseMaterial
				node.material = new THREE.MeshPhongMaterial({
					map: baseMaterial,
					shininess: 10,
					lightMap: textureLoader.load(baseUrl+view+'/'+bumpMap),
					lightMapIntensity: shirtLightMapIntensity,
				});
				node.material.side = THREE.DoubleSide;
			break;
			case "1": //button hole
				// node.material.map = buttonHoleMaterial
				node.material = new THREE.MeshPhongMaterial({
					map: buttonHoleMaterial,
					shininess: 10,
					lightMap: buttonLightMapMaterial,
					lightMapIntensity: buttonLightMapIntensity,
				})
			break;
			case "2": //button stich
				// node.material.map = buttonStichMaterial
				node.material = new THREE.MeshPhongMaterial({
					map: buttonMaterial,
					shininess: 10,
					lightMap: buttonLightMapMaterial,
					lightMapIntensity: buttonLightMapIntensity,
				})
			break;
			case "3": //button
				// node.material.map = buttonMaterial
				node.material = new THREE.MeshPhongMaterial({
					map: buttonMaterial,
					shininess: 10,
					lightMap: buttonLightMapMaterial,
					lightMapIntensity: buttonLightMapIntensity,
				})
			break;
			case "4": //stich
				node.material.map = stichMaterial
			break;
			case "7": //collar shadow
				var shadowTexture = textureLoader.load(baseUrl+view+'/'+bumpMap);
				node.material = new THREE.MeshPhongMaterial({
					map: shadowTexture,
					transparent: true,
					opacity: 0.5,
					lightMap: shadowTexture,
					lightMapIntensity: shirtLightMapIntensity
				})
				break;
			case "8": //pocket shadow
				node.material = new THREE.MeshPhongMaterial({
					map: collarPocketShadowMaterial,
					transparent: true,
					opacity: 0.5
				})
			break;
			case "9": //light map
				break;
			default:
				// node.material.map = baseMaterial
				node.material = new THREE.MeshPhongMaterial({
					map: baseMaterial,
					shininess: 10,
					lightMap: isDarkLightMap ? shirtLightMapMaterialDark : shirtLightMapMaterialLight,
					lightMapIntensity: 0.6,
				})
			break;
		}

	}
	// console.log(baseUrl + customizationObjItem.path);
	loader.load( baseUrl+view+"/" + customizationObjItem.path, function ( object ) {
		//onload
		isLoadingFbx = false;
		object.traverse( function( node ) {
			if ( node.isMesh ) {
				if( node.material ) {
					node.material.side = THREE.DoubleSide;
					setupMaterial(node, customizationObjItem.material_type,customizationObjItem.bump);
					switch(customizationObjItem.sub_category) {
						case "collar_inside":
							if(selectedStyleMaterial["collar_inside"]) {
								loadMaterial(node, selectedStyleMaterial["collar_inside"])
							}
						break;
						case "cuff_inside":
							if(selectedStyleMaterial["cuff_inside"]) {
								loadMaterial(node, selectedStyleMaterial["cuff_inside"])
							}
						break;
						case "placket_inside_round":
							if(selectedStyleMaterial["placket_inside"]) {
								loadMaterial(node, selectedStyleMaterial["placket_inside"])
							}
						break;
						case "placket_inside_straight":
							if(selectedStyleMaterial["placket_inside"]) {
								loadMaterial(node, selectedStyleMaterial["placket_inside"])
							}
						break;
						default:
						break;
					}
					
				}	
			}
		});
        if(view == "Front"){
            arrLoadedObj.push({"fbx": customizationObjItem, "object": object});
		    scene.add( object );
        }else{
            arrLoadedObjBack.push({"fbx": customizationObjItem, "object": object});
			if(activeView!=view){
				object.visible = false;
			}
            scene.add( object );
        }
		
        
		if(nextIndex<arrItems.length) {
			loadModel(nextIndex+1, arrItems[nextIndex], arrItems, callBack,view);
		} else {
			callBack();
		}

		switch(customizationObjItem.category) {
			case "placket":
				hideUnhiderRoundStraightPlacket();
			break;
			case "back_style":
				hideUnhiderRoundStraightBack();
			break;
			default:
			break;
		}
	}, function ( progress ) {
		//on progress
		isLoadingFbx = true;
		// console.log(progress);
	}, function ( error ) {
		//on error
		isLoadingFbx = false;
		// console.log(error);
	});
}
function selectMTOShirtCustomizationItem(item) {
	console.log(item);
	//if ongoing loading, do nothing or it will overlap
	if(isLoadingFbx) {
		return;
	}
	if(item.material != null && item.material != "") {
		//material update

		var textureLoader = new THREE.TextureLoader();
		var newMaterial = baseMaterial;
		if(item.material != "-1") {
			newMaterial = textureLoader.load(baseUrl+item.material);
			newMaterial.wrapS = newMaterial.wrapT = THREE.RepeatWrapping;
			newMaterial.offset.set(0,0);
			newMaterial.repeat.set(12,12);
			
		}

		//update is_selected
		currentParent = null;
		getParent(item, customizationObj.list_item);
		if(currentParent != null) {
			for(var i=0;i<currentParent.child.length;i++) {
				currentParent.child[i].is_selected = currentParent.child[i].id == item.id;
			}
		}

		function serchAndUpdateMaterial(subCategory) {
			//search the loaded fbx for the sub-category
			var search = arrLoadedObj.filter(function (el) {
		  		return el.fbx.sub_category == subCategory;
			});

			for(var i=0;i<search.length;i++) {
				search[i].object.traverse( function( node ) {
					if ( node.isMesh ) {
						node.material.map = newMaterial;
					}
				});
			}
		}

        console.log(customizationObj.list_item);

		switch(item.sub_category) {
			case "collar_inside":
				serchAndUpdateMaterial("collar_inside");
				selectedStyleMaterial["collar_inside"] = item;
			break;
			case "collar_piping":
				serchAndUpdateMaterial("collar_piping");
				selectedStyleMaterial["collar_piping"] = item;
			break;
			case "collar_outside":
				serchAndUpdateMaterial("collar_outside");
				selectedStyleMaterial["collar_outside"] = item;
			break;
			case "collar_full":
				serchAndUpdateMaterial("collar");
				serchAndUpdateMaterial("collar_outside");
				serchAndUpdateMaterial("collar_inside");
				serchAndUpdateMaterial("collar_piping");
				selectedStyleMaterial["collar_full"] = item;
				//make inside, outside, piping de-selected
				deSelectMaterialItem(customizationObj.list_item, ["collar_inside", "collar_outside", "collar_piping"]);
				selectedStyleMaterial["collar_inside"] = null;
				selectedStyleMaterial["collar_piping"] = null;
				selectedStyleMaterial["collar_outside"] = null;
			break;
			case "cuff_inside":
				serchAndUpdateMaterial("cuff_inside");
				selectedStyleMaterial["cuff_inside"] = item;
			break;
			case "cuff_piping":
				serchAndUpdateMaterial("cuff_piping");
				selectedStyleMaterial["cuff_piping"] = item;
			break;
			case "cuff_outside":
				serchAndUpdateMaterial("cuff_outside");
				selectedStyleMaterial["cuff_outside"] = item;
			break;
			case "cuff_full":
				serchAndUpdateMaterial("cuff");
				serchAndUpdateMaterial("cuff_outside");
				serchAndUpdateMaterial("cuff_inside");
				serchAndUpdateMaterial("cuff_piping");
				selectedStyleMaterial["cuff_full"] = item;
				//make inside, outside, piping de-selected
				deSelectMaterialItem(customizationObj.list_item, ["cuff_inside", "cuff_outside", "cuff_piping"]);
				selectedStyleMaterial["cuff_outside"] = null;
				selectedStyleMaterial["cuff_piping"] = null;
				selectedStyleMaterial["cuff_inside"] = null;
			break;

			case "placket_inside":
				serchAndUpdateMaterial("placket_inside_round");
				serchAndUpdateMaterial("placket_inside_straight");
				selectedStyleMaterial["placket_inside"] = item;
			break;
			case "placket_piping":
				serchAndUpdateMaterial("placket_piping");
				serchAndUpdateMaterial("placket_piping_inside");
				serchAndUpdateMaterial("placket_piping_outside");
				selectedStyleMaterial["placket_piping"] = item;
			break;
			case "placket_outside":
				serchAndUpdateMaterial("placket_outside_round");
				serchAndUpdateMaterial("placket_outside_straight");
				selectedStyleMaterial["placket_outside"] = item;
			break;
			case "placket_full":
				serchAndUpdateMaterial("placket_outside_round");
				serchAndUpdateMaterial("placket_inside_round");
				serchAndUpdateMaterial("placket_piping_round");
				serchAndUpdateMaterial("placket_piping_inside_round");
				serchAndUpdateMaterial("placket_piping_outside_round");
				serchAndUpdateMaterial("placket_outside_straight");
				serchAndUpdateMaterial("placket_inside_straight");
				serchAndUpdateMaterial("placket_piping_straight");
				serchAndUpdateMaterial("placket_piping_inside_straight");
				serchAndUpdateMaterial("placket_piping_outside_straight");
				serchAndUpdateMaterial("placket_edge_straight");
				selectedStyleMaterial["placket_full"] = item;
				//make inside, outside, piping de-selected
				deSelectMaterialItem(customizationObj.list_item, [
					"placket_inside_round", 
					"placket_outside_round", 
					"placket_piping_round",
					"placket_inside_straight", 
					"placket_outside_straight", 
					"placket_piping_straight"]);
				selectedStyleMaterial["placket_outside"] = null;
				selectedStyleMaterial["placket_piping"] = null;
				selectedStyleMaterial["placket_inside"] = null;
			break;
			case "button_thread":
				//update the button stich material
				buttonStichMaterial = newMaterial;
				buttonStichMaterial.wrapS = buttonStichMaterial.wrapT = THREE.RepeatWrapping;

				//update all the button stich
				var search = arrLoadedObj.filter(function (el) {
		  			return el.fbx.material_type == "2";
				});

				for(var i=0;i<search.length;i++) {
					search[i].object.traverse( function( node ) {
						if ( node.isMesh ) {
							node.material.map = buttonStichMaterial;
						}
					});
				}

			break;

			default:
			break;
		}

	} else {
		//fbx update
		removeFBX(item.category);
		
		//update is_selected
		currentParent = null;
		getParent(item, customizationObj.list_item);
		if(currentParent != null) {
			for(var i=0;i<currentParent.child.length;i++) {
				currentParent.child[i].is_selected = currentParent.child[i].id == item.id;
			}

			//insert the new fbx
			traverseListItem(currentParent.child, function(){});
		}


		//de-select material if any
		switch(item.category) {
			case "collar":
				//make inside, outside, piping de-selected
				// deSelectMaterialItem(customizationObj.list_item, ["collar_full", "collar_inside", "collar_outside", "collar_piping"]);
				//make full collar to base
				// selectMaterialItemToBase(customizationObj.list_item, ["collar_full"]);
			break;
			case "cuff":
				//make inside, outside, piping de-selected
				// deSelectMaterialItem(customizationObj.list_item, ["cuff_full", "cuff_inside", "cuff_outside", "cuff_piping"]);
				//make full collar to base
				// selectMaterialItemToBase(customizationObj.list_item, ["cuff_full"]);
			break;
			case "placket":
				//make inside, outside, piping de-selected
				// deSelectMaterialItem(customizationObj.list_item, ["placket_full", "placket_inside", "placket_outside", "placket_piping"]);
				//make full collar to base
				// selectMaterialItemToBase(customizationObj.list_item, ["placket_full"]);
			break;
			case "bottom":
				if(item.id == "438d455b-469a-42bf-a7f5-8146d85258c6") {
					//round cut
					bottomType = "round";
				} else {
					//straight
					bottomType = "straight";
				}

				hideUnhiderRoundStraightPlacket();
				hideUnhiderRoundStraightBack();
			break;
			case "sleeve":
				hideUnhideCuff(item.id);
				if(item.id == 'e4c7a9d8-9378-49a5-9701-04f46fb5dc74') {
					//full sleeve
					showHideMonogram("sleeve_placket", true);
					showHideMonogram("cuff", true);
				} else if(item.id == 'b3150be2-80d4-4645-bb54-86977d1a895f') {
					//half seleeve
					showHideMonogram("sleeve_placket", false);
					showHideMonogram("cuff", false);
				}
	
			break;
			case "pocket":
				if(item.id == '85feda1c-b21f-4088-8083-d002c4b7480c') {
					//no pocket
					showHideMonogram("pocket", false);
				} else {
					showHideMonogram("pocket", true);
				}
			break;
			default:
			break;
		}
	}
}
function removeFBX(category) {
	//search the loaded fbx for the category
	var search = arrLoadedObj.filter(function (el) {
	  return el.fbx.category == category;
	});

	//remove the found items
	if(search.length>0) {
		for(var i=0; i<search.length; i++) {
			scene.remove(search[i].object)
		}
	}

	//update the array
	arrLoadedObj = arrLoadedObj.filter(function (el) {
	  return el.fbx.category != category;
	});

	//search the loaded fbx for the category
	

	var searchBack = arrLoadedObjBack.filter(function (el) {
		return el.fbx.category == category;
	  });
  
	  //remove the found items
	  if(searchBack.length>0) {
		  for(var i=0; i<searchBack.length; i++) {
			  scene.remove(searchBack[i].object)
		  }
	  }
  
	  //update the array
	  arrLoadedObjBack = arrLoadedObjBack.filter(function (el) {
		return el.fbx.category != category;
	  });

	  //console.log(arrLoadedObj);
}
function getParent(item, arrItems) {
	for(var i=0;i<arrItems.length;i++) {
		var parent = arrItems[i];
		for(var j=0;j<parent.child.length;j++) {
			if(parent.child[j].child != null && parent.child[j].child.length > 0) {
				getParent(item, parent.child);
			} else {
				if(item.id == parent.child[j].id) {
					currentParent = parent;
					break;
				}
			}
			
		}
	}

}

function deSelectMaterialItem(arrItems, subCategory) {
	for(var i=0;i<arrItems.length;i++) {
		let item = arrItems[i];
		if(item.material != null && item.material != "" && item.sub_category != null && subCategory.includes(item.sub_category) ) {
			arrItems[i].is_selected = false;
		} else if(item.child != null && item.child.length > 0) {
			deSelectMaterialItem(item.child, subCategory);
		}
	}
}
function hideUnhiderRoundStraightPlacket() {
	if(bottomType == "round") {
		hideUnhideFbxForSubCategory("placket_front_round", false);
		hideUnhideFbxForSubCategory("placket_inside_round", false);
		hideUnhideFbxForSubCategory("placket_outside_round", false);

		hideUnhideFbxForSubCategory("placket_front_straight", true);
		hideUnhideFbxForSubCategory("placket_inside_straight", true);
		hideUnhideFbxForSubCategory("placket_outside_straight", true);
	} else {
		hideUnhideFbxForSubCategory("placket_front_round", true);
		hideUnhideFbxForSubCategory("placket_inside_round", true);
		hideUnhideFbxForSubCategory("placket_outside_round", true);

		hideUnhideFbxForSubCategory("placket_front_straight", false);
		hideUnhideFbxForSubCategory("placket_inside_straight", false);
		hideUnhideFbxForSubCategory("placket_outside_straight", false);
	}
}

function hideUnhiderRoundStraightBack() {
	if(bottomType == "round") {
		hideUnhideFbxForSubCategory("back_style_round", false);
		hideUnhideFbxForSubCategory("back_style_straight", true);
	} else {
		hideUnhideFbxForSubCategory("back_style_round", true);
		hideUnhideFbxForSubCategory("back_style_straight", false);
	}
}
function hideUnhideFbxForSubCategory(subCategory, shouldHide) {
	var search = arrLoadedObj.filter(function (el) {
  		return el.fbx.sub_category == subCategory;
	});

	for(var i=0;i<search.length;i++) {
		search[i].object.traverse( function( node ) {
			if ( node.isMesh ) {
				node.visible = !shouldHide;
			}
		});
	}
}
function showHideMonogram(positionId, shouldShow) {
	if(shouldShow) {
		let pocketPostion = arrMonogramPosition.filter(function (el) {
			return el.id == positionId;
		});

		let isAlreadyAdded = customizationObj.monogram_position.filter(function (el) {
			return el.id == positionId;
		});

		if(isAlreadyAdded.length == 0 && pocketPostion.length>0) {
			customizationObj.monogram_position.push(JSON.parse(JSON.stringify(pocketPostion[0])))
		}
	} else {
		if(monogramPostion == positionId) {
			removeFBX("monogram");
			for(var i=0;i<customizationObj.monogram_position.length;i++) {
				if(customizationObj.monogram_position.id == "none") {
					customizationObj.monogram_position.is_selected = true;
				} else {
					customizationObj.monogram_position.is_selected = false;
				}
			}
		}

		customizationObj.monogram_position = customizationObj.monogram_position.filter(function (el) {
			return el.id != positionId;
		});


	}
	
}
function hideUnhideCuff(sleeveId) {
	function hideUnhideCuffForID(cuffId) {
		if(cuffObjectIndex != -1) {
			//Previous cuff object is there, need to replace with the searched value

			var searchedItem;
			for(var i=0;i<customizationObj.list_item.length;i++) {
				if(customizationObj.list_item[i].id == cuffId) {
					searchedItem = customizationObj.list_item[i];
					cuffObjectIndex = i;
					break;
				}
			}
			if(searchedItem != null && cuffObjectIndex >= 0) {
				customizationObj.list_item[cuffObjectIndex] = cuffObjcet;
				cuffObjcet = searchedItem;
			}
		} else {
			//both of them are in the array remove only the search value
			for(var i=0;i<customizationObj.list_item.length;i++) {
				if(customizationObj.list_item[i].id == cuffId) {
					cuffObjcet = customizationObj.list_item[i];
					cuffObjectIndex = i;
					break;
				}
			}
			if(cuffObjectIndex >= 0) {
				customizationObj.list_item.splice(cuffObjectIndex, 1);
			}
		}
	}
	var cuffIdToLoad = "";
	selectedSleeveID = sleeveId;
	if(sleeveId == 'e4c7a9d8-9378-49a5-9701-04f46fb5dc74') {
		//full sleeve
		hideUnhideCuffForID("bec1041e-dd39-4403-8632-6b1b323e3550");
		cuffIdToLoad = "747e1560-a5db-4c45-a37f-6b49c1200b19";
		
	} else if(sleeveId == 'b3150be2-80d4-4645-bb54-86977d1a895f') {
		//half seleeve
		hideUnhideCuffForID("747e1560-a5db-4c45-a37f-6b49c1200b19");
		cuffIdToLoad = "bec1041e-dd39-4403-8632-6b1b323e3550";
		
	}

	//Remove cuff fbx
	removeFBX("cuff")

	//load the current cuff 
	var cuffToLoad;
	for(var i=0;i<customizationObj.list_item.length;i++) {
		if(customizationObj.list_item[i].id == cuffIdToLoad) {
			cuffToLoad = customizationObj.list_item[i];
			break;
		}
	}
	if(cuffToLoad != null) {
		traverseListItem([cuffToLoad], function(){});
	}

}
export function removeScene(){
	cancelAnimationFrame(id);
	renderer.domElement.addEventListener('dblclick', null, false);
    scene = null;
    camera = null;
    controls = null;
}
window.removeScene = removeScene;

export function updateMonogram(value, type, monogramUpdateType) {
	switch(type) {
		case "shirt":
			updateShirtMonogram(value, monogramUpdateType);
			break;
		case "trouser":
		case "chinos":
		case "shorts":
			break;
		case "jeans":
			updateJeansMonogram(value, monogramUpdateType);
			break;
		default:
			break;

	}
}
window.updateMonogram = updateMonogram;

function getMonogramPositonForPath(path,material) {
	var loader = new FBXLoader();
	loader.load( baseUrl + path, function ( object ) {
		//onload
		object.traverse( function( node ) {
			if ( node.isMesh ) {
				if( node.material ) {
					node.material = new THREE.MeshPhongMaterial({
						map: material,
						side: THREE.DoubleSide,
						shininess: 10,
						lightMap: buttonLightMapMaterial,
						lightMapIntensity: buttonLightMapIntensity,
						transparent: true,
						opacity:1
					});
					// node.material.side = THREE.DoubleSide;
					// node.material.map = monogramMaterial;
					// node.material.lightMap = monogramLightMapMaterial;
					// node.material.lightMapIntensity = 1.2;
				}	
			}
		});
		arrLoadedObj.push({"fbx": {"category": "monogram"}, "object": object});
		scene.add( object );
		object.position.x = x;
		object.position.y = y;
		object.position.z = z;
	}, function ( progress ) {

	}, function ( error ) {
		//on error
	});
}
function updateShirtMonogram(value, type) {
	updateMonogramFromValue(value, type, true);
}
function updateMonogramFromValue(value, type, shouldAnimate) {
	switch(type) {
		case "texture":
			for(var i=0; i<customizationObj.monogram_material.length; i++) {
				var item = customizationObj.monogram_material[i];
				if(item){
					if(item.id == value.id) {
						item.is_selected = true;
						monogramMaterialPath = item.path;
					} else {
						item.is_selected = false;
					}
				}
				
			}
			applyMonogram();
		break;
		case "text":
			customizationObj.monogram_text = value;
			applyMonogram();
		break;
		case "position":
			for(var i=0; i<customizationObj.monogram_position.length; i++) {
				var item = customizationObj.monogram_position[i];
				if(item){
					if(item.id == value) {
						item.is_selected = true;
						if(shouldAnimate) {
							selectCategory(item.position.positionX, item.position.positionY, item.position.positionZ, item.position.controlX, item.position.controlY, item.position.controlZ, item.position.zoom);
						}
					} else {
						item.is_selected = false;
					}
				}
			}
			applyMonogram();
		break;
		case "save":
			applyMonogram();
		break;
		default:
		break;
	}
	
}

function applyMonogram() {
	console.log(customizationObj);
	//remove previously added monogram
	removeFBX("monogram");

	var searchTexture = customizationObj.monogram_material.filter(function (el) {
		return el.is_selected;
	});

	var searchPosition = customizationObj.monogram_position.filter(function (el) {
		return el.is_selected;
	});
	

	if(customizationObj.monogram_text && customizationObj.monogram_text != "" && searchTexture.length>0 && searchPosition.length>0 && searchPosition[0].id != 'none') {
		monogramPostion = searchPosition[0].id;
		monogramMaterialPath = searchTexture[0].path;
		console.log(customizationObj.monogram_text.length);
		
		for (var i = 0; i < customizationObj.monogram_text.length; i++) {
			var char = customizationObj.monogram_text.charAt(i).toUpperCase();
			var monogramMaterialLoader = new THREE.TextureLoader();
			console.log(char);
			monogramMaterial = monogramMaterialLoader.load(baseUrl+monogramMaterialPath+"/"+char+".png");

			var searchedItem = searchPosition[0];
			var strIndex = (i+1).toString();
			getMonogramPositonForPath(searchedItem.path.replace("%monogram_char%", strIndex),monogramMaterial);
		}



		//create material
		// var monogramMaterialLoader = new THREE.TextureLoader();
		// monogramMaterialPath = searchTexture[0].path;
		// monogramMaterialLoader.load(
		// 	// resource URL
		// 	baseUrl+monogramMaterialPath,

		// 	// onLoad callback
		// 	function ( texture ) {
		// 		monogramMaterial = texture;
		// 		monogramMaterial.wrapS = monogramMaterial.wrapT = THREE.RepeatWrapping;
		// 		//create monogram fbx
		// 		for (var i = 0; i < customizationObj.monogram_text.length; i++) {
		// 			var char = customizationObj.monogram_text.charAt(i);
		// 			var searchedItem = searchPosition[0];
		// 			var strIndex = (i+1).toString();
		// 			getMonogramPositonForPath(searchedItem.path.replace("%monogram_char%", strIndex));
		// 		}
		// 	},
		// 	undefined,
		// 	function ( err ) {
		// 		console.log(err);
		// 		console.error( 'An error happened.' );
		// 	}
		// );
	}
		
}
function changebaseFabricShirt(material,base_material){
	baseMaterial = textureLoader.load(baseUrl+material.base);
	baseMaterial.wrapS = baseMaterial.wrapT = THREE.RepeatWrapping;
	baseMaterial.offset.set(0,0);
	baseMaterial.repeat.set(15,15);
	shirtLightMapIntensity = parseFloat(base_material.light_map_intensity);	
	
	buttonMaterial = textureLoader.load(baseUrl+material.button);
	buttonMaterial.wrapS = buttonMaterial.wrapT = THREE.RepeatWrapping;
	buttonHoleMaterial = textureLoader.load(baseUrl+material.button_hole);
	buttonHoleMaterial.wrapS = buttonHoleMaterial.wrapT = THREE.RepeatWrapping;
	

	for(var i=0; i<arrLoadedObj.length; i++) {
		if(arrLoadedObj[i].fbx.material_type == 0){
			switch(arrLoadedObj[i].fbx.sub_category) {
				case "collar_inside":
					if(!selectedStyleMaterial["collar_inside"]) {
						arrLoadedObj[i].object.traverse( function( node ) {
							if ( node.isMesh ) {
								node.material.map = baseMaterial;
								node.material.lightMapIntensity = shirtLightMapIntensity;
							}
						});
					}
				break;
				case "cuff_inside":
					if(!selectedStyleMaterial["cuff_inside"]) {
						arrLoadedObj[i].object.traverse( function( node ) {
							if ( node.isMesh ) {
								node.material.map = baseMaterial;
								node.material.lightMapIntensity = shirtLightMapIntensity;
							}
						});
					}
				break;
				case "placket_inside":
					if(!selectedStyleMaterial["placket_inside"]) {
						arrLoadedObj[i].object.traverse( function( node ) {
							if ( node.isMesh ) {
								node.material.map = baseMaterial;
								node.material.lightMapIntensity = shirtLightMapIntensity;
							}
						});
					}
				break;
				default:
					arrLoadedObj[i].object.traverse( function( node ) {
						if ( node.isMesh ) {
							node.material.map = baseMaterial;
							node.material.lightMapIntensity = shirtLightMapIntensity;
						}
					});
				break;
			}
		}else if(arrLoadedObj[i].fbx.material_type == 2 || arrLoadedObj[i].fbx.material_type == 3){
			arrLoadedObj[i].object.traverse( function( node ) {
				if ( node.isMesh ) {
					node.material.map = buttonMaterial;
				}
			});
		}else if(arrLoadedObj[i].fbx.material_type == 1){
			arrLoadedObj[i].object.traverse( function( node ) {
				if ( node.isMesh ) {
					node.material.map = buttonHoleMaterial;
				}
			});
		}
	}
	for(var i=0; i<arrLoadedObjBack.length; i++) {
		if(arrLoadedObjBack[i].fbx.material_type == 0){
			arrLoadedObjBack[i].object.traverse( function( node ) {
				if ( node.isMesh ) {
					node.material.map = baseMaterial;
					node.material.lightMapIntensity = shirtLightMapIntensity;
				}
			});
		}
	}
}

export function changeBaseTexture(material,base_material){
	switch(type) {
		case "shirt":
			changebaseFabricShirt(material,base_material);
			break;
		case "jeans":
			changebaseFabricJeans(material,base_material);
			break;
	}
}

window.changeBaseTexture = changeBaseTexture;