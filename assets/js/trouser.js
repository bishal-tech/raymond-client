import * as THREE from './threejs/build/three.module.js';
import { FBXLoader } from './threejs/examples/jsm/loaders/FBXLoader.js';


var baseMaterial;
var stichMaterial;
var buttonMaterial;
var buttonHoleMaterial;
var buttonStichMaterial;
var buttonLightMapMaterial;
var shirtLightMapMaterialLight;
var shirtLightMapMaterialDark;
var chinosPocketShadowMaterial
var baseUrl = "";
var customizationObj;
var arrLoadedObj = [];
var scene;
var currentParent;
var isLoadingFbx = false;
var coinPocketObjcet;
var coinPocketObjectIndex = -1;
var bodyType;
var objFullBodyNode = {};
var rayCasterObjects = [];
var arrFullBodyObj = [];
var productType = ""
var isDarkLightMap = false;
var buttonLightMapIntensity = 0.6;
var shirtLightMapIntensity = 0.6;

export function trouserInit(obj, wishListCustomization, threeJsScene, customizationUrl, modelBodyType, type, isSimilarItem) {
	if(obj.base_material.light_map_type) {
		isDarkLightMap = obj.base_material.light_map_type == 'dark' ? true : false;	
	}

	if(obj.base_material.button_light_map_intensity) {
		buttonLightMapIntensity = parseFloat(obj.base_material.button_light_map_intensity);	
	}

	if(obj.base_material.light_map_intensity) {
		shirtLightMapIntensity = parseFloat(obj.base_material.light_map_intensity);	
	}
	baseUrl = customizationUrl;
	productType = type;
	customizationObj = obj;
	scene = threeJsScene;
	bodyType = modelBodyType;
	coinPocketObjcet = null;
	coinPocketObjectIndex = -1;
	//update main customization object depending on wishlised customization
	if(wishListCustomization) {
		console.log(wishListCustomization.selected_items);
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

	//is it chinos front pocket call coin pocket selection, with cross pocket default
	var search = customizationObj.list_item.filter(function (el) {
	  return el.id == "893ef767-e151-4604-8c0d-753f0d521b4f";
	});
	
	if(search.length>0) {
		for(var i=0;i<search[0].child.length;i++) {
			if(search[0].child[i].is_selected) {
				hideUnhideCoinPocket(search[0].child[i].id)
			}
		}
	}

	var textureLoader = new THREE.TextureLoader();

	baseMaterial = textureLoader.load(baseUrl+customizationObj.material.base);
	baseMaterial.wrapS = baseMaterial.wrapT = THREE.RepeatWrapping;
	baseMaterial.offset.set(0,0);
	baseMaterial.repeat.set(12,12);
	stichMaterial = textureLoader.load(baseUrl+customizationObj.material.stich);
	stichMaterial.wrapS = stichMaterial.wrapT = THREE.RepeatWrapping;
	buttonMaterial = textureLoader.load(baseUrl+customizationObj.material.button);
	buttonMaterial.wrapS = buttonMaterial.wrapT = THREE.RepeatWrapping;
	buttonHoleMaterial = textureLoader.load(baseUrl+customizationObj.material.button_hole);
	buttonHoleMaterial.wrapS = buttonHoleMaterial.wrapT = THREE.RepeatWrapping;
	buttonStichMaterial = textureLoader.load(baseUrl+customizationObj.material.button_stich);
	buttonStichMaterial.wrapS = buttonStichMaterial.wrapT = THREE.RepeatWrapping;
	chinosPocketShadowMaterial = textureLoader.load(baseUrl+'texture/shadow_texture.png');
	chinosPocketShadowMaterial.wrapS = chinosPocketShadowMaterial.wrapT = THREE.RepeatWrapping;


	buttonLightMapMaterial = textureLoader.load(baseUrl+'texture/buttonlightmap.jpg');
	shirtLightMapMaterialDark = textureLoader.load(baseUrl+'texture/Trouserlightmap.jpg');
	shirtLightMapMaterialLight = textureLoader.load(baseUrl+'texture/Trouserlightmap.jpg');


	arrLoadedObj = [];
	console.log("bodyType"+bodyType);
	var timer;
	var isCommonItemLoaded = false;
	var isListItemLoaded = false;

	if(!bodyType || bodyType == "") {
		console.log(customizationObj.common_item.length);
		loadFBX(1, customizationObj.common_item[0], customizationObj.common_item, function(){
			console.log("----Common Item Loaded-----");
			//Common Item Loaded
			isCommonItemLoaded = true;
			if(isListItemLoaded) {
				hideloader();
			}
		});
		traverseListItem(customizationObj.list_item, function() {
			//list item loaded
			console.log("----List Item Loaded-----");
			clearInterval(timer);
			timer = setTimeout(x => {
				if(!isLoadingFbx) {
					isListItemLoaded = true;
					console.log("----List Item Loaded Completre-----");
					if(isCommonItemLoaded) {
						hideloader();
					}
				}
		    }, 3000);
		});
	} else {
		// loadFullBodyFbx();
		console.log(isSimilarItem);
		if(!isSimilarItem) {
			loadFullCustomizationBodyFbx();
		} else {
			hideUnhideNode();
		}
		
	}

}


function hideUnhideNode() {
	console.log("Bottom Hide Unhide");
	function setupMaterial(node, materialType) {
	
		switch(materialType) {
			case "0": //base
				node.material = new THREE.MeshPhongMaterial({
					map: baseMaterial,
					shininess: 10,
					lightMap: isDarkLightMap ? shirtLightMapMaterialDark : shirtLightMapMaterialLight,
					lightMapIntensity: shirtLightMapIntensity,
					side: THREE.DoubleSide
				})

			break;
			case "1": //button hole
				node.material = new THREE.MeshPhongMaterial({
					map: buttonHoleMaterial,
					shininess: 10,
					lightMap: buttonLightMapMaterial,
					lightMapIntensity: buttonLightMapIntensity,
					side: THREE.DoubleSide
				})
			break;
			case "2": //button stich
				node.material = new THREE.MeshPhongMaterial({
					map: buttonMaterial,
					shininess: 10,
					lightMap: buttonLightMapMaterial,
					lightMapIntensity: buttonLightMapIntensity,
					side: THREE.DoubleSide
				})

			break;
			case "3": //button
				node.material = new THREE.MeshPhongMaterial({
					map: buttonMaterial,
					shininess: 10,
					lightMap: buttonLightMapMaterial,
					lightMapIntensity: buttonLightMapIntensity,
					side: THREE.DoubleSide
				})

			break;
			case "4": //stich
				material.map = stichMaterial
				
			break;
			case "9": //light map
				break;
			
			case "10": //chinos pocket shadow
				node.material = new THREE.MeshPhongMaterial({
					map: chinosPocketShadowMaterial,
					transparent: true,
					opacity: 0.5,
					side: THREE.DoubleSide
				})
				break
			default:
				// node.material.map = baseMaterial
				node.material = new THREE.MeshPhongMaterial({
					map: baseMaterial,
					shininess: 10,
					lightMap: isDarkLightMap ? shirtLightMapMaterialDark : shirtLightMapMaterialLight,
					lightMapIntensity: 0.6,
					side: THREE.DoubleSide
				})
			break;
			break;
		}		
	}

	function getCommonItem(arrItems) {
		for(var i=0;i<arrItems.length;i++) {
			if(arrItems[i].name) {
				var selectedNode = objFullBodyNode[arrItems[i].name];
				if(selectedNode) {
					selectedNode.visible = true;
					selectedNode.material.side = THREE.DoubleSide;
					setupMaterial(selectedNode, arrItems[i].material_type);
				}
			}
		}
	}


	function getItem(arrItems) {
		for(var i=0;i<arrItems.length;i++) {
			if(arrItems[i].is_selected && arrItems[i].fbx && arrItems[i].fbx.length>0) {
				if(arrItems[i].fbx && arrItems[i].fbx.length>0) {
					for(var j=0;j<arrItems[i].fbx.length;j++) {
						if(arrItems[i].fbx[j].name) {
							var selectedNode = objFullBodyNode[arrItems[i].fbx[j].name];
							if(selectedNode) {
								selectedNode.visible = true;
								selectedNode.material.side = THREE.DoubleSide;
								setupMaterial(selectedNode, arrItems[i].fbx[j].material_type);
							}	
						}
					}
				}
				
			} else if(arrItems[i].child && arrItems[i].child.length > 0) {
				getItem(arrItems[i].child);
			}
		}
	}

	getItem(customizationObj.list_item);
	getCommonItem(customizationObj.common_item);
	console.log("Bottom Hide Unhide End");
	hideloaderFullBody();
}

function loadFullCustomizationBodyFbx() {
	for(var i=0;i<arrFullBodyObj.length;i++) {
		scene.remove(arrFullBodyObj[i]);
	}
	arrFullBodyObj = [];
	var loader = new FBXLoader();
	isLoadingFbx = true;
	rayCasterObjects = [];
	loader.load( baseUrl +"full/" +bodyType + "/full.fbx", function ( object ) {
		//onload
		isLoadingFbx = false;
		objFullBodyNode = {};
		object.traverse( function( node ) {
			if ( node.isMesh ) {
				node.visible = false;
				// node.material.map = baseMaterial;
				objFullBodyNode[node.name] = node;
				// console.log(Object.keys(objFullBodyNode).length);
				// console.log(node.name);
				
				rayCasterObjects.push(node);
				switch(productType) {
					case "shorts_fullbody":
						if(Object.keys(objFullBodyNode).length == 11) {
							hideUnhideNode();
						}
					break;
					case "chinos_fullbody":
						if(Object.keys(objFullBodyNode).length == 22) {
							hideUnhideNode();
						}
					break;
					case "trouser_fullbody":
						if(Object.keys(objFullBodyNode).length == 19) {
							hideUnhideNode();
						}
					break;
					default:
					break;
				}
			}
		});

		arrFullBodyObj.push(object);
		scene.add( object );
		
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



function loadFBX(nextIndex, customizationObjItem, arrItems, callBack) {
	var loader = new FBXLoader();
	function setupMaterial(node, materialType) {
		switch(materialType) {
			case "0": //base
				// node.material.map = baseMaterial
				node.material = new THREE.MeshPhongMaterial({
					map: baseMaterial,
					shininess: 0,
					lightMap: isDarkLightMap ? shirtLightMapMaterialDark : shirtLightMapMaterialLight,
					lightMapIntensity: shirtLightMapIntensity,
					side: THREE.DoubleSide
				})
			break;
			case "1": //button hole
				// node.material.map = buttonHoleMaterial
				// node.material.transparent = true;
				node.material = new THREE.MeshPhongMaterial({
					map: buttonHoleMaterial,
					shininess: 10,
					lightMap: buttonLightMapMaterial,
					lightMapIntensity: buttonLightMapIntensity,
					side: THREE.DoubleSide
				})
			break;
			case "2": //button stich
				// node.material.map = buttonStichMaterial
				node.material = new THREE.MeshPhongMaterial({
					map: buttonMaterial,
					shininess: 10,
					lightMap: buttonLightMapMaterial,
					lightMapIntensity: buttonLightMapIntensity,
					side: THREE.DoubleSide
				})
			break;
			case "3": //button
				// node.material.map = buttonMaterial
				node.material = new THREE.MeshPhongMaterial({
					map: buttonMaterial,
					shininess: 10,
					lightMap: buttonLightMapMaterial,
					lightMapIntensity: buttonLightMapIntensity,
					side: THREE.DoubleSide
				})
			break;
			case "4": //stich
				node.material.map = stichMaterial
			break;
			case "9": //light map
				break;
			case "10": //chinos pocket shadow
				node.material = new THREE.MeshPhongMaterial({
					map: chinosPocketShadowMaterial,
					transparent: true,
					opacity: 0.5,
					side: THREE.DoubleSide
				})
				break
			default:
				// node.material.map = baseMaterial
				node.material = new THREE.MeshPhongMaterial({
					map: baseMaterial,
					shininess: 0,
					lightMap: isDarkLightMap ? shirtLightMapMaterialDark : shirtLightMapMaterialLight,
					lightMapIntensity: 0.6,
					side: THREE.DoubleSide
				})
			break;
		}

	}
	isLoadingFbx = true;
	loader.load( baseUrl + customizationObjItem.path, function ( object ) {
		//onload
		isLoadingFbx = false;
		object.traverse( function( node ) {
			if ( node.isMesh ) {
				// console.log(node.name);
				if( node.material ) {
					node.material.side = THREE.DoubleSide;
					setupMaterial(node, customizationObjItem.material_type);
					
				}	
			}
		});
		arrLoadedObj.push({"fbx": customizationObjItem, "object": object});
		scene.add( object );
		if(nextIndex<arrItems.length) {
			loadFBX(nextIndex+1, arrItems[nextIndex], arrItems, callBack);
		} else {
			callBack();
		}
	}, function ( progress ) {
		//on progress
		isLoadingFbx = true;
		// console.log(progress);
	}, function ( error ) {
		//on error
		isLoadingFbx = false;
		console.log(error);
	});
}

function traverseListItem(arrItems, callBack) {
	if(bodyType == "") {
		for(var i=0; i<arrItems.length;i++) {
			let item = arrItems[i];
			if(item.is_selected && item.fbx != null && item.fbx.length > 0) {
				loadFBX(1, item.fbx[0], item.fbx, callBack);
			}

			if(item.child != null && item.child.length>0) {
				traverseListItem(item.child, callBack);
			}
		}
	}
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

//for chinos only
function hideUnhideCoinPocket(frontPocketId) {
	function hideUnhideCoinPocketForID(coinPocketId) {
		if(coinPocketObjectIndex != -1) {
			//Previous pocket object is there, need to replace with the searched value

			var searchedItem;
			for(var i=0;i<customizationObj.list_item.length;i++) {
				if(customizationObj.list_item[i].id == coinPocketId) {
					searchedItem = customizationObj.list_item[i];
					coinPocketObjectIndex = i;
					break;
				}
			}
			if(searchedItem != null && coinPocketObjectIndex >= 0) {
				customizationObj.list_item[coinPocketObjectIndex] = coinPocketObjcet;
				coinPocketObjcet = searchedItem;
			}
		} else {
			//both of them are in the array remove only the search value
			for(var i=0;i<customizationObj.list_item.length;i++) {
				if(customizationObj.list_item[i].id == coinPocketId) {
					coinPocketObjcet = customizationObj.list_item[i];
					coinPocketObjectIndex = i;
					break;
				}
			}
			if(coinPocketObjectIndex >= 0) {
				customizationObj.list_item.splice(coinPocketObjectIndex, 1);
			}
		}
	}
	var coinPocketIdToLoad = "";
	if(frontPocketId == 'ba6bbe31-91b2-447a-b3ef-f1073022cb00') {
		//cross pocket
		hideUnhideCoinPocketForID("89c415b8-711e-4c4d-baf3-333cbfc2b3f1");
		coinPocketIdToLoad = "2f821f2f-a12f-4ac0-920d-e2b190d3940c";
		
	} else if(frontPocketId == '1d1c2d81-4719-4828-a9af-024b3fcc76cd') {
		//curved pocket
		hideUnhideCoinPocketForID("2f821f2f-a12f-4ac0-920d-e2b190d3940c");
		coinPocketIdToLoad = "89c415b8-711e-4c4d-baf3-333cbfc2b3f1";
	}

	//Remove coin pocket fbx
	var search = arrLoadedObj.filter(function (el) {
	  return el.fbx.category == "coin_pocket";
	});

	//remove the found items
	if(search.length>0) {
		for(var i=0; i<search.length; i++) {
			scene.remove(search[i].object)
		}
	}

	//load the current coin pocket
	var coinPocketToLoad;
	for(var i=0;i<customizationObj.list_item.length;i++) {
		if(customizationObj.list_item[i].id == coinPocketIdToLoad) {
			coinPocketToLoad = customizationObj.list_item[i];
			break;
		}
	}
	if(coinPocketToLoad != null) {
		traverseListItem([coinPocketToLoad]);
	}

}



function selectTrouserCustomizationItem(item) {
	console.log(item);

	//if ongoing loading, do nothing or it will overlap
	if(isLoadingFbx) {
		return;
	}
	//fbx update

	//search the loaded fbx for the category
	var search = arrLoadedObj.filter(function (el) {
	  return el.fbx.category == item.category;
	});

	//remove the found items
	if(search.length>0) {
		for(var i=0; i<search.length; i++) {
			scene.remove(search[i].object)
		}
	}

	//update the array
	arrLoadedObj = arrLoadedObj.filter(function (el) {
	  return el.fbx.category != item.category;
	});

	//update is_selected
	currentParent = null;
	getParent(item, customizationObj.list_item);
	if(currentParent != null) {
		for(var i=0;i<currentParent.child.length;i++) {
			currentParent.child[i].is_selected = currentParent.child[i].id == item.id;
		}

		//insert the new fbx
		traverseListItem(currentParent.child);
	}

	switch(item.category) {
		case "front_pocket":
			hideUnhideCoinPocket(item.id);
		break;
		default:
		break;
	}
}

export function isLoadingTrouserFbx() {
	return isLoadingFbx;
}
function makeid(length) {
    var result           = [];
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result.push(characters.charAt(Math.floor(Math.random() * 
 charactersLength)));
   }
   return result.join('');
}

export function getTrouserRayCasterObject() {
	return rayCasterObjects;
}
window.getTrouserRayCasterObject = getTrouserRayCasterObject;

window.isLoadingTrouserFbx = isLoadingTrouserFbx;

window.trouserInit = trouserInit;
window.selectTrouserCustomizationItem = selectTrouserCustomizationItem;
