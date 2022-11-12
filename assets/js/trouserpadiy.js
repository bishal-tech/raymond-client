import * as THREE from './threejs/build/three.module.js';
import { FBXLoader } from './threejs/examples/jsm/loaders/FBXLoader.js';


var baseMaterial;
var stichMaterial;
var buttonMaterial;
var buttonHoleMaterial;
var buttonStichMaterial;
var baseUrl = "";
var customizationObj;
var arrLoadedObj = [];
var scene;
var currentParent;
var isLoadingFbx = false;
var coinPocketObjcet;
var coinPocketObjectIndex = -1;

export function trouserInitPadiy(obj, threeJsScene, customizationUrl) {
	currentParent = null;
	coinPocketObjcet = null;
	coinPocketObjectIndex = -1;

	baseUrl = customizationUrl;
	customizationObj = obj;
	scene = threeJsScene;

	var textureLoader = new THREE.TextureLoader();

	baseMaterial = textureLoader.load(baseUrl+customizationObj.material.base);
	baseMaterial.wrapS = baseMaterial.wrapT = THREE.RepeatWrapping;
	stichMaterial = textureLoader.load(baseUrl+customizationObj.material.stich);
	stichMaterial.wrapS = stichMaterial.wrapT = THREE.RepeatWrapping;
	buttonMaterial = textureLoader.load(baseUrl+customizationObj.material.button);
	buttonMaterial.wrapS = buttonMaterial.wrapT = THREE.RepeatWrapping;
	buttonHoleMaterial = textureLoader.load(baseUrl+customizationObj.material.button);
	buttonHoleMaterial.wrapS = buttonHoleMaterial.wrapT = THREE.RepeatWrapping;
	buttonStichMaterial = textureLoader.load(baseUrl+customizationObj.material.button);
	buttonStichMaterial.wrapS = buttonStichMaterial.wrapT = THREE.RepeatWrapping;
	arrLoadedObj = [];
	loadFBX(1, customizationObj.common_item[0], customizationObj.common_item);

	traverseListItem(customizationObj.list_item);
	hideUnhideFrontSelection();
	setInterval(function(){hideUnhideFrontSelection();},3000);
	
}

function loadFBX(nextIndex, customizationObjItem, arrItems) {
	var loader = new FBXLoader();
	function setupMaterial(node, materialType) {
		switch(materialType) {
			case "0": //base
				node.material.map = baseMaterial
			break;
			case "1": //button hole
				node.material.map = buttonHoleMaterial
				node.material.transparent = true;
			break;
			case "2": //button stich
				node.material.map = buttonStichMaterial
			break;
			case "3": //button
				node.material.map = buttonMaterial
			break;
			case "4": //stich
				node.material.map = stichMaterial
			break;
			default:
				node.material.map = baseMaterial
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
			loadFBX(nextIndex+1, arrItems[nextIndex], arrItems);
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

function traverseListItem(arrItems) {
	for(var i=0; i<arrItems.length;i++) {
		let item = arrItems[i];
		if(item.is_selected && item.fbx != null && item.fbx.length > 0) {
			loadFBX(1, item.fbx[0], item.fbx);
		}

		if(item.child != null && item.child.length>0) {
			traverseListItem(item.child);
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

function hideUnhideFrontSelection() {
	var selectedCrease = getSelectedValue('52b9bb0c-07af-4c5f-b12c-0fddf1a8f338', customizationObj.list_item);
	if(selectedCrease.id == "d8a85ec1-e83a-4a92-a627-b21f91b810d8") {
		//front crease
		hideUnhideFbxForSubCategory('front_pocket_crease', false);
		hideUnhideFbxForSubCategory('front_pocket_no_crease', true);

	} else if(selectedCrease.id == "c503929d-26c0-42ea-b7c7-d98ea2d57c3f") {
		//no crease
		hideUnhideFbxForSubCategory('front_pocket_crease', true);
		hideUnhideFbxForSubCategory('front_pocket_no_crease', false);
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

function selectTrouserCustomizationItemPadiy(item) {
	//if ongoing loading, do nothing or it will overlap
	if(isLoadingFbx) {
		return;
	}

	if(item.is_button_material) {
		var textureLoader = new THREE.TextureLoader();
		var newMaterial = baseMaterial;

		if(item.material != "-1") {
			console.log(baseUrl+item.material);
			newMaterial = textureLoader.load(baseUrl+item.material);
			newMaterial.wrapS = newMaterial.wrapT = THREE.RepeatWrapping;
		} else {
			newMaterial = textureLoader.load(baseUrl+customizationObj.material.button);
			newMaterial.wrapS = newMaterial.wrapT = THREE.RepeatWrapping;
		}

		buttonMaterial = newMaterial;
		buttonHoleMaterial = newMaterial;
		buttonStichMaterial = newMaterial;
		serchAndUpdateMaterialForType("1");
		serchAndUpdateMaterialForType("2");
		serchAndUpdateMaterialForType("3");
	}

	function serchAndUpdateMaterialForType(materialType) {
		//search the loaded fbx for the materialType
		var search = arrLoadedObj.filter(function (el) {
	  		return el.fbx.material_type == materialType;
		});

		for(var i=0;i<search.length;i++) {
			search[i].object.traverse( function( node ) {
				if ( node.isMesh ) {
					node.material.map = newMaterial;
				}
			});
		}
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
		case "crease":
		case "style":
			hideUnhideFrontSelection();
		break;
		default:
		break;
	}
}

function getSelectedValue(id, arrCustomization) {
	var selectedItem;
	function getObject(id, arr) {
	  for(var i=0;i<arr.length;i++) {
	    if(arr[i].id == id && arr[i].child) {
	      var filteredArray = arr[i].child.filter(function(itm){
	        return itm.is_selected;
	      });
	      if(filteredArray.length>0) {
	        selectedItem = filteredArray[0];
	      }

	    } else if(arr[i].child && arr[i].child.length>0) {
	      getObject(id, arr[i].child);
	    }
	  }
	}
	getObject(id, arrCustomization)
	return selectedItem;
}

export function isLoadingTrouserFbxPadiy() {
	return isLoadingFbx;
}


window.isLoadingTrouserFbxPadiy = isLoadingTrouserFbxPadiy;

window.trouserInitPadiy = trouserInitPadiy;
window.selectTrouserCustomizationItemPadiy = selectTrouserCustomizationItemPadiy;
