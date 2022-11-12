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
var cuffObjcet;
var cuffObjectIndex = -1;
var elbowPatchObject;
var elbowPatchObjectIndex = -1;
var bottomType = "round"; // round, straight
var monogramMaterialPath = "";
var monogramMaterial;
var monogramPostion;
var arrMonogramPosition;
var selectedSleeve = 'full';
var shirtLightMapIntensity = 0.6;
var buttonLightMapIntensity = 0.6;
var arrItemsBack = [];
var arrLoadedObjBack = [];
var textureLoader = new THREE.TextureLoader();
var buttonLightMapMaterial;
var isDarkLightMap = false;
var shirtLightMapMaterialDark;
var shirtLightMapMaterialLight;
var activeView = "Front";
var selectedSleeveID = "e4c7a9d8-9378-49a5-9701-04f46fb5dc74";
var selectedStyleMaterial = {};

export function shirtInitPadiy(obj, threeJsScene, customizationUrl) {
	arrLoadedObj = [];
	arrLoadedObjBack = [];
	currentParent = null;
	isLoadingFbx = false;
	cuffObjcet = null;
	cuffObjectIndex = -1;
	elbowPatchObject = null;
	elbowPatchObjectIndex = -1;
	bottomType = "round";
	monogramMaterialPath = "";
	monogramMaterial = null;
	monogramPostion = null;
	arrMonogramPosition = null;

	selectedSleeve = 'full';
	activeView = "Front";
	selectedSleeveID = "e4c7a9d8-9378-49a5-9701-04f46fb5dc74";


	baseUrl = customizationUrl;
	customizationObj = obj;
	scene = threeJsScene;

	arrItemsBack = obj.list_item_back;
	selectedStyleMaterial = {};
	if(obj.base_material.light_map_intensity) {
		shirtLightMapIntensity = parseFloat(obj.base_material.light_map_intensity);	
        //shirtLightMapIntensity = 1.4;	
	}

    if(obj.base_material.button_light_map_intensity) {
		buttonLightMapIntensity = parseFloat(obj.base_material.button_light_map_intensity);	
	}

	var textureLoader = new THREE.TextureLoader();

	baseMaterial = textureLoader.load(baseUrl+customizationObj.material.base);
	baseMaterial.wrapS = baseMaterial.wrapT = THREE.RepeatWrapping;
	baseMaterial.offset.set(0,0);
	baseMaterial.repeat.set(15,15);
	stichMaterial = textureLoader.load(baseUrl+customizationObj.material.stich);
	stichMaterial.wrapS = stichMaterial.wrapT = THREE.RepeatWrapping;
	buttonMaterial = textureLoader.load(baseUrl+customizationObj.material.button);
	buttonMaterial.wrapS = buttonMaterial.wrapT = THREE.RepeatWrapping;
	buttonHoleMaterial = textureLoader.load(baseUrl+customizationObj.material.button);
	buttonHoleMaterial.wrapS = buttonHoleMaterial.wrapT = THREE.RepeatWrapping;
	buttonStichMaterial = textureLoader.load(baseUrl+customizationObj.material.button);
	buttonStichMaterial.wrapS = buttonStichMaterial.wrapT = THREE.RepeatWrapping;
	buttonLightMapMaterial = textureLoader.load(baseUrl+'texture/buttonlightmap.jpg');
	//shirtLightMapMaterialDark = textureLoader.load(baseUrl+'texture/shirtlightmapdark.jpg');
	//shirtLightMapMaterialLight = textureLoader.load(baseUrl+'texture/shirtlightmaplight.jpg');

//for sleeve, with full default
	var search = customizationObj.list_item.filter(function (el) {
	  return el.id == "01a9d20f-fec4-421e-9b10-caeee857cee9";
	});
	if(search.length>0) {
		hideUnhideCuff("e4c7a9d8-9378-49a5-9701-04f46fb5dc74");
	}

	arrLoadedObj = [];
	loadFBX(1, customizationObj.common_item[0], customizationObj.common_item,"Front");

	loadFBX(1, customizationObj.common_item_back[0], customizationObj.common_item_back,"Back");

	traverseListItem(customizationObj.list_item);

	

	arrMonogramPosition = JSON.parse(JSON.stringify(customizationObj.monogram_position));
}

function loadFBX(nextIndex, customizationObjItem, arrItems, view) {
	var loader = new FBXLoader();
	function loadMaterial(node, item) {
		var newMaterial = baseMaterial;
		if(item.material != "-1") {
			newMaterial = textureLoader.load(baseUrl+item.material);
			newMaterial.offset.set(0,0);
			newMaterial.repeat.set(15,15);
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
	isLoadingFbx = true;
	// console.log(baseUrl + customizationObjItem.path);
	
	loader.load( baseUrl + view +"/"+ customizationObjItem.path, function ( object ) {
		//onload
		isLoadingFbx = false;
		object.traverse( function( node ) {
			if ( node.isMesh ) {
				// console.log(node.name);
				if( node.material ) {
					node.material.side = THREE.DoubleSide;
					setupMaterial(node, customizationObjItem.material_type,customizationObjItem.bump);

					switch(customizationObjItem.sub_category) {
						case "collar_inside":
							if(selectedStyleMaterial["collar_inside"]) {
								loadMaterial(node, selectedStyleMaterial["collar_inside"])
							}
						break;
						case "collar_outside":
							if(selectedStyleMaterial["collar_outside"]) {
								loadMaterial(node, selectedStyleMaterial["collar_outside"])
							}
						break;
						case "collar":
							if(selectedStyleMaterial["collar"]) {
								loadMaterial(node, selectedStyleMaterial["collar"])
							}
						break;
						case "cuff_inside":
							if(selectedStyleMaterial["cuff_inside"]) {
								loadMaterial(node, selectedStyleMaterial["cuff_inside"])
							}
						break;
						case "cuff_outside":
							if(selectedStyleMaterial["cuff_outside"]) {
								loadMaterial(node, selectedStyleMaterial["cuff_outside"])
							}
						break;
						case "cuff_piping":
							if(selectedStyleMaterial["cuff_piping"]) {
								loadMaterial(node, selectedStyleMaterial["cuff_piping"])
							}
						break;
						case "placket_inside":
							if(selectedStyleMaterial["placket_inside"]) {
								loadMaterial(node, selectedStyleMaterial["placket_inside"])
							}
						break;
						case "placket_outside":
							if(selectedStyleMaterial["placket_outside"]) {
								loadMaterial(node, selectedStyleMaterial["placket_outside"])
							}
						break;
						case "placket_edge":
							if(selectedStyleMaterial["placket_edge"]) {
								loadMaterial(node, selectedStyleMaterial["placket_edge"])
							}
						break;
						case "placket_piping_inside":
							if(selectedStyleMaterial["placket_piping_inside"]) {
								loadMaterial(node, selectedStyleMaterial["placket_piping_inside"])
							}
						break;
						case "placket_piping_outside":
							if(selectedStyleMaterial["placket_piping_outside"]) {
								loadMaterial(node, selectedStyleMaterial["placket_piping_outside"])
							}
						break;
						case "elbowpatch":
							if(selectedStyleMaterial["elbowpatch"]) {
								loadMaterial(node, selectedStyleMaterial["elbowpatch"])
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
			loadFBX(nextIndex+1, arrItems[nextIndex], arrItems,view);
		}

		switch(customizationObjItem.category) {
			case "placket":
				// renamePlacketPath();
			break;
			case "back_style":
				// renameBackPleatPath();
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

function traverseListItem(arrItems) {
	for(var i=0; i<arrItems.length;i++) {
		let item = arrItems[i];
		if(item.is_selected && item.fbx != null && item.fbx.length > 0) {
			loadFBX(1, item.fbx[0], item.fbx,"Front");
		}
		if(item.is_selected && item.fbxBack != null && item.fbxBack.length > 0 && arrItemsBack.includes(item.category)) {
			console.log(item.fbxBack);
            loadFBX(1, item.fbxBack[0], item.fbxBack,"Back");
        }

		if(item.child != null && item.child.length>0) {
			traverseListItem(item.child);
		}
	}
}

function hideUnhideFbxForCategeory(category, shouldHide) {

	var search = arrLoadedObj.filter(function (el) {
  		return el.fbx.category == category;
	});

	for(var i=0;i<search.length;i++) {
		search[i].object.traverse( function( node ) {
			if ( node.isMesh ) {
				node.visible = !shouldHide;
			}
		});
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
	if(sleeveId == 'e4c7a9d8-9378-49a5-9701-04f46fb5dc74' || sleeveId == 'b3150be2-80d4-4645-bb54-86977d1a895f') {
		//full sleeve
		hideUnhideCuffForID("bec1041e-dd39-4403-8632-6b1b323e3550");
		cuffIdToLoad = "747e1560-a5db-4c45-a37f-6b49c1200b19";
		
	} else if(sleeveId == '2a2bf549-87d7-4d0a-a1ca-6a6b1e2c1f08' || sleeveId == '5b4dd1f4-f319-4337-8dc4-3b48c0e29cc5') {
		//half seleeve
		hideUnhideCuffForID("747e1560-a5db-4c45-a37f-6b49c1200b19");
		cuffIdToLoad = "bec1041e-dd39-4403-8632-6b1b323e3550";
	}

	//Update path
	if(sleeveId == 'e4c7a9d8-9378-49a5-9701-04f46fb5dc74') {
		//full sleeve
		updatePath('747e1560-a5db-4c45-a37f-6b49c1200b19', ['Full Sleeve Rollups/'], ['Full Sleeve/']);
		//updatePath('8c65265d-0444-49e3-ab1f-1d6df4b9d22d', ['elbow_patch_for_roll_ups'], ['elbow_patch']);
	} else if(sleeveId == 'b3150be2-80d4-4645-bb54-86977d1a895f') {
		//full sleeve roll up
		updatePath('747e1560-a5db-4c45-a37f-6b49c1200b19', ['Full Sleeve/'], ['Full Sleeve Rollups/']);
		//updatePath('8c65265d-0444-49e3-ab1f-1d6df4b9d22d', ['elbow_patch'], ['elbow_patch_for_roll_ups']);
	
	} else if(sleeveId == '2a2bf549-87d7-4d0a-a1ca-6a6b1e2c1f08') {
		//half seleeve
		updatePath('bec1041e-dd39-4403-8632-6b1b323e3550', ['Muscle', 'muscle_sleeve'], ['Half Sleeve', 'half_sleeve']);

	} else if(sleeveId == '5b4dd1f4-f319-4337-8dc4-3b48c0e29cc5') {
		//muscle sleeve
		updatePath('bec1041e-dd39-4403-8632-6b1b323e3550', ['Half Sleeve', 'half_sleeve'], ['Muscle', 'muscle_sleeve']);
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
		traverseListItem([cuffToLoad]);
	}
}

function hideUnhideElbowPatch(sleeveId) {
	function hideUnhideElbowPatchID(elbowPatchId, shouldHide) {
		if(!shouldHide) {
			if(elbowPatchObjectIndex>-1 && elbowPatchObject) {
				customizationObj.list_item.splice(elbowPatchObjectIndex, 0, elbowPatchObjectIndex);
			}
		} else {
			for(var i=0;i<customizationObj.list_item.length;i++) {
				if(customizationObj.list_item[i].id == elbowPatchId) {
					elbowPatchObject = customizationObj.list_item[i];
					elbowPatchObjectIndex = i;
					break;
				}
			}
			if(elbowPatchObjectIndex >= 0) {
				customizationObj.list_item.splice(elbowPatchObjectIndex, 1);
			}
		}
	}
	var elbowPatchToLoad = "";
	if(sleeveId == 'e4c7a9d8-9378-49a5-9701-04f46fb5dc74' || sleeveId == 'b3150be2-80d4-4645-bb54-86977d1a895f') {
		//full sleeve
		//hideUnhideElbowPatchID("8c65265d-0444-49e3-ab1f-1d6df4b9d22d", false);
		elbowPatchToLoad = "8c65265d-0444-49e3-ab1f-1d6df4b9d22d";
		
	} else if(sleeveId == '2a2bf549-87d7-4d0a-a1ca-6a6b1e2c1f08' || sleeveId == '5b4dd1f4-f319-4337-8dc4-3b48c0e29cc5') {
		//half seleeve
		//hideUnhideElbowPatchID("8c65265d-0444-49e3-ab1f-1d6df4b9d22d", true);
	}

	//Remove elbowpatch fbx
	removeFBX("elbowpatch")

	//load the current cuff 
	var elbowToLoad;
	if(elbowPatchToLoad != "") {
		for(var i=0;i<customizationObj.list_item.length;i++) {
			if(customizationObj.list_item[i].id == elbowPatchToLoad) {
				elbowToLoad = customizationObj.list_item[i];
				break;
			}
		}
		if(elbowToLoad != null) {
			traverseListItem([elbowToLoad]);
		}
	}
	
}

function hideUnhiderRoundStraightPlacket() {
	
	if(bottomType == "round" || bottomType == "tail") {
		updatePath('088000a1-380d-4ca4-923f-7cb55bb158d1', ['Straight'], ['Round']);

	} else if(bottomType == "straight") {
		updatePath('088000a1-380d-4ca4-923f-7cb55bb158d1', ['Round'], ['Straight']);
	} 
}

function renameBackPleatPath() {
	if(bottomType == "round") {
		updatePath('72e87961-471c-48c7-9f47-70b6d6c6274d', ['/Straight', '_straight_', 'straight.fbx'], ['/Rounded', '_rounded_', 'rounded.fbx']);
		updatePath('72e87961-471c-48c7-9f47-70b6d6c6274d', ['/Tail', '_tail_', 'tail.fbx'], ['/Rounded', '_rounded_', 'rounded.fbx']);
	} else if(bottomType == "straight") {
		updatePath('72e87961-471c-48c7-9f47-70b6d6c6274d', ['/Rounded', '_rounded_', 'rounded.fbx'], ['/Straight', '_straight_', 'straight.fbx']);
		updatePath('72e87961-471c-48c7-9f47-70b6d6c6274d', ['/Tail', '_tail_', 'tail.fbx'], ['/Straight', '_straight_', 'straight.fbx']);
	} else if(bottomType == "tail") {
		updatePath('72e87961-471c-48c7-9f47-70b6d6c6274d', ['/Rounded', '_rounded_', 'rounded.fbx'], ['/Tail', '_tail_', 'tail.fbx']);
		updatePath('72e87961-471c-48c7-9f47-70b6d6c6274d', ['/Straight', '_straight_', 'straight.fbx'], ['/Tail', '_tail_', 'tail.fbx']);
	}
}

function getParent(item, arrItems) {
	for(var i=0;i<arrItems.length;i++) {
		var parent = arrItems[i];
		if(parent.child != null) {
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

}

function deSelectMaterialItem(arrItems, subCategory) {
	for(var i=0;i<arrItems.length;i++) {
		let item = arrItems[i];
		if(item.material != null && item.material != "" && item.sub_category != null && subCategory.includes(item.sub_category) ) {
			arrItems[i].is_selected = false;
		} else if(item.child != null && item.child.length > 0) {
			deSelectMaterialItem(item.child, subCategory);
			if(item.show_material && subCategory.includes(item.category)){
				item.is_selected = false;
			}
		}
	}
}

function selectMaterialItemToBase(arrItems, subCategory) {
	for(var i=0;i<arrItems.length;i++) {
		let item = arrItems[i];
		if(item.material != null && item.material == "-1"  && item.sub_category != null && subCategory.includes(item.sub_category) ) {
			arrItems[i].is_selected = true;
		} else if(item.child != null && item.child.length > 0) {
			selectMaterialItemToBase(item.child, subCategory);
		}
	}
}

function selectShirtCustomizationItemPadiy(item) {
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
			console.log(baseUrl+item.material);
			newMaterial = textureLoader.load(baseUrl+item.material);
			newMaterial.wrapS = newMaterial.wrapT = THREE.RepeatWrapping;
			newMaterial.offset.set(0,0);
			newMaterial.repeat.set(15,15);
		}

		if(item.is_button_material) {
			if(item.material == "-1") {
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


		//update is_selected
		currentParent = null;
		getParent(item, customizationObj.list_item);
		if(currentParent != null) {
			for(var i=0;i<currentParent.child.length;i++) {
				if(currentParent.child[i].id == item.id){
					currentParent.child[i].is_selected = true;
					currentParent.is_selected = true;
				}else{
					currentParent.child[i].is_selected = false;
				}
			}
		}


		function serchAndUpdateMaterial(subCategory) {
			console.log(arrLoadedObj);
			//search the loaded fbx for the sub-category
			var search = arrLoadedObj.filter(function (el) {
		  		return el.fbx.sub_category == subCategory;
			});

			if(search.length == 0){
				search = arrLoadedObjBack.filter(function (el) {
					  return el.fbx.sub_category == subCategory;
				});
			  }

			for(var i=0;i<search.length;i++) {
				search[i].object.traverse( function( node ) {
					if ( node.isMesh ) {
						//newMaterial.offset.set(0,0);
						//newMaterial.repeat.set(15,15);
						//newMaterial.wrapS = newMaterial.wrapT = THREE.RepeatWrapping;
						node.material.map = newMaterial	
					}
				});
			}
		}

		function serchAndUpdateToBaseMaterial(subCategory) {
			selectedStyleMaterial[subCategory] = null;
			//search the loaded fbx for the sub-category
			var search = arrLoadedObj.filter(function (el) {
		  		return el.fbx.sub_category == subCategory;
			});

			for(var i=0;i<search.length;i++) {
				search[i].object.traverse( function( node ) {
					if ( node.isMesh ) {
						node.material.map = baseMaterial;
					}
				});
			}
		}

		function serchAndUpdateMaterialForType(materialType) {
			//search the loaded fbx for the materialType
			var search = arrLoadedObj.filter(function (el) {
		  		return el.fbx.material_type == materialType;
			});

			for(var i=0;i<search.length;i++) {
				search[i].object.traverse( function( node ) {
					if ( node.isMesh ) {
						newMaterial.offset.set(0,0);
						newMaterial.repeat.set(15,15);
						newMaterial.wrapS = newMaterial.wrapT = THREE.RepeatWrapping;
						node.material.map = newMaterial	
					}
				});
			}
		}

		switch(item.sub_category) {
			case "elbow_patch":
				serchAndUpdateMaterial("elbowpatch");
				serchAndUpdateMaterial("elbowpatch_rollup");
				//serchAndUpdateMaterial("elbow_patch");
				selectedStyleMaterial["elbowpatch"] = item;
			break;
			case "collar_inside":
				deSelectMaterialItem(customizationObj.list_item, ["collar_full", "collar_outside"]);
				serchAndUpdateToBaseMaterial("collar_outside");
				serchAndUpdateToBaseMaterial("collar");
				serchAndUpdateToBaseMaterial("collar_upper");
				serchAndUpdateMaterial("collar_inside");
				selectedStyleMaterial["collar_inside"] = item;
			break;
			case "collar_outside":
				deSelectMaterialItem(customizationObj.list_item, ["collar_full", "collar_inside"]);
				serchAndUpdateToBaseMaterial("collar_inside");
				serchAndUpdateToBaseMaterial("collar");
				serchAndUpdateToBaseMaterial("collar_upper");
				serchAndUpdateMaterial("collar_outside");
				selectedStyleMaterial["collar_outside"] = item;
			break;
			case "collar_full":
				deSelectMaterialItem(customizationObj.list_item, ["collar_inside", "collar_outside"]);
				serchAndUpdateMaterial("collar");
				serchAndUpdateMaterial("collar_outside");
				serchAndUpdateMaterial("collar_inside");
				serchAndUpdateMaterial("collar_upper");
				selectedStyleMaterial["collar"] = item;
				selectedStyleMaterial["collar_outside"] = item;
				selectedStyleMaterial["collar_inside"] = item;
			break;
			case "cuff_inside":
				serchAndUpdateToBaseMaterial("cuff_outside");
				serchAndUpdateToBaseMaterial("cuff");
				deSelectMaterialItem(customizationObj.list_item, ["cuff_outside", "cuff_full"]);
				serchAndUpdateMaterial("cuff_inside");
				selectedStyleMaterial["cuff_inside"] = item;
			break;
			case "cuff_piping":
				serchAndUpdateMaterial("cuff_piping");
				selectedStyleMaterial["cuff_piping"] = item;
			break;
			case "cuff_outside":
				serchAndUpdateToBaseMaterial("cuff_inside");
				serchAndUpdateToBaseMaterial("cuff");
				deSelectMaterialItem(customizationObj.list_item, ["cuff_inside", "cuff_full"]);
				serchAndUpdateMaterial("cuff_outside");
				selectedStyleMaterial["cuff_outside"] = item;
			break;
			case "cuff_full":
				deSelectMaterialItem(customizationObj.list_item, ["cuff_inside", "cuff_outside"]);
				serchAndUpdateMaterial("cuff");
				serchAndUpdateMaterial("cuff_outside");
				serchAndUpdateMaterial("cuff_inside");
				selectedStyleMaterial["cuff_outside"] = item;
				selectedStyleMaterial["cuff_inside"] = item;
			break;

			case "placket_inside":
				serchAndUpdateToBaseMaterial("placket_outside");
				serchAndUpdateToBaseMaterial("placket_piping_outside");
				serchAndUpdateToBaseMaterial("placket_piping_inside");
				serchAndUpdateToBaseMaterial("placket_edge");
				deSelectMaterialItem(customizationObj.list_item, ["placket_outside","placket_full","placket_piping_outside","placket_piping_inside","placket_edge"]);
				serchAndUpdateMaterial("placket_inside");
				selectedStyleMaterial["placket_inside"] = item;
			break;
			case "placket_outside":
				serchAndUpdateToBaseMaterial("placket_inside");
				serchAndUpdateToBaseMaterial("placket_piping_outside");
				serchAndUpdateToBaseMaterial("placket_piping_inside");
				serchAndUpdateToBaseMaterial("placket_edge");
				deSelectMaterialItem(customizationObj.list_item, ["placket_inside","placket_full","placket_piping_outside","placket_piping_inside","placket_edge"]);
				serchAndUpdateMaterial("placket_outside");
				selectedStyleMaterial["placket_outside"] = item;
			break;
			case "placket_full":
				serchAndUpdateToBaseMaterial("placket_outside");
				serchAndUpdateToBaseMaterial("placket_inside");
				serchAndUpdateToBaseMaterial("placket_piping_outside");
				serchAndUpdateToBaseMaterial("placket_piping_inside");
				serchAndUpdateToBaseMaterial("placket_edge");
				deSelectMaterialItem(customizationObj.list_item, ["placket_inside","placket_outside","placket_full","placket_piping_outside","placket_piping_inside","placket_edge"]);
				serchAndUpdateMaterial("placket_inside");
				serchAndUpdateMaterial("placket_outside");
				selectedStyleMaterial["placket_inside"] = item;
				selectedStyleMaterial["placket_outside"] = item;
			break;
			case "placket_edge":
				serchAndUpdateToBaseMaterial("placket_outside");
				serchAndUpdateToBaseMaterial("placket_inside");
				serchAndUpdateToBaseMaterial("placket_piping_outside");
				serchAndUpdateToBaseMaterial("placket_piping_inside");
				serchAndUpdateToBaseMaterial("placket_edge");
				deSelectMaterialItem(customizationObj.list_item, ["placket_inside","placket_outside","placket_full","placket_piping_outside","placket_piping_inside"]);
				serchAndUpdateMaterial("placket_edge");
				selectedStyleMaterial["placket_edge"] = item;
			break;
			case "placket_piping_inside":
				serchAndUpdateToBaseMaterial("placket_outside");
				serchAndUpdateToBaseMaterial("placket_inside");
				serchAndUpdateToBaseMaterial("placket_piping_outside");
				serchAndUpdateToBaseMaterial("placket_piping_inside");
				serchAndUpdateToBaseMaterial("placket_edge");
				deSelectMaterialItem(customizationObj.list_item, ["placket_inside","placket_outside","placket_full","placket_piping_outside","placket_edge"]);
				serchAndUpdateMaterial("placket_piping_inside");
				selectedStyleMaterial["placket_piping_inside"] = item;
			break;
			case "placket_piping_outside":
				serchAndUpdateToBaseMaterial("placket_outside");
				serchAndUpdateToBaseMaterial("placket_inside");
				serchAndUpdateToBaseMaterial("placket_piping_outside");
				serchAndUpdateToBaseMaterial("placket_piping_inside");
				serchAndUpdateToBaseMaterial("placket_edge");
				deSelectMaterialItem(customizationObj.list_item, ["placket_inside","placket_outside","placket_full","placket_piping_inside","placket_edge"]);
				serchAndUpdateMaterial("placket_piping_outside");
				selectedStyleMaterial["placket_piping_outside"] = item;
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
		console.log(item.category);

		//renaming path on selection
		switch(item.category) {
			case "no_pocket":
				if(item.id == 'ca85fa52-3038-4733-8a89-4402636e5a69') {
					//single pocket
					updatePath('987370c8-3e7f-46bc-99c8-2aac06e39266', ['/Double'], ['/Single']);
				} else if(item.id == 'cc056777-6ea2-46e2-acd8-c585bdb46a01') {
					//double pocket
					updatePath('987370c8-3e7f-46bc-99c8-2aac06e39266', ['/Single'], ['/Double']);
				} else if(item.id == '43dc775c-8b3c-46d4-afc5-ae452d9baf3d') {
					//no pocket
				}
			
			break;
			case "collar":
			break;
			case "cuff":
			break;
			case "placket":
			break;
			case "bottom":

				if(item.id == "438d455b-469a-42bf-a7f5-8146d85258c6") {
					//round cut
					bottomType = "round";
				} else if(item.id == "69c53e60-194f-4aea-aea2-81b2c1471f3c") {
					//tail
					bottomType = "tail";
				} else if(item.id == "b3ea63ed-135f-4733-97a2-cd0c342f2d14") {
					//Straight
					bottomType = "straight";
				}
				//renameBackPleatPath();
				hideUnhiderRoundStraightPlacket();
			break;
			case "sleeve":
				if(item.id == 'e4c7a9d8-9378-49a5-9701-04f46fb5dc74') {
					//full sleeve
					//updatePath('747e1560-a5db-4c45-a37f-6b49c1200b19', ['Full Sleeve Rollups/'], ['Full Sleeve/']);
					updatePath('8c65265d-0444-49e3-ab1f-1d6df4b9d22d', ['elbow_patch_for_roll_ups'], ['elbow_patch']);
				} else if(item.id == 'b3150be2-80d4-4645-bb54-86977d1a895f') {
					//full sleeve roll up
					//updatePath('747e1560-a5db-4c45-a37f-6b49c1200b19', ['Full Sleeve/'], ['Full Sleeve Rollups/']);
					updatePath('8c65265d-0444-49e3-ab1f-1d6df4b9d22d', ['elbow_patch'], ['elbow_patch_for_roll_ups']);
				
				} else if(item.id == '2a2bf549-87d7-4d0a-a1ca-6a6b1e2c1f08') {
					//half seleeve
					//updatePath('bec1041e-dd39-4403-8632-6b1b323e3550', ['Muscle', 'muscle_sleeve'], ['Half Sleeve', 'half_sleeve']);

				} else if(item.id == '5b4dd1f4-f319-4337-8dc4-3b48c0e29cc5') {
					//muscle sleeve
					//updatePath('bec1041e-dd39-4403-8632-6b1b323e3550', ['Half Sleeve', 'half_sleeve'], ['Muscle', 'muscle_sleeve']);
				}

			break;
			case "pocket":
			break;
			default:
			break;
		}
		
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
		//console.log(arrLoadedObj);
		//de-select material if any
		switch(item.category) {
			case "no_pocket":
				if(item.id == 'ca85fa52-3038-4733-8a89-4402636e5a69') {
					//single pocket
					showHideMonogram("pocket", true);
					removeFBX('pocket');
					var pocketToLoad;
					for(var i=0;i<customizationObj.list_item.length;i++) {
						if(customizationObj.list_item[i].id == '987370c8-3e7f-46bc-99c8-2aac06e39266') {
							pocketToLoad = customizationObj.list_item[i];
							break;
						}
					}

					if(pocketToLoad != null) {
						traverseListItem([pocketToLoad]);
					}
				} else if(item.id == 'cc056777-6ea2-46e2-acd8-c585bdb46a01') {
					//double pocket
					showHideMonogram("pocket", true);
					removeFBX('pocket');
					var pocketToLoad;
					for(var i=0;i<customizationObj.list_item.length;i++) {
						if(customizationObj.list_item[i].id == '987370c8-3e7f-46bc-99c8-2aac06e39266') {
							pocketToLoad = customizationObj.list_item[i];
							break;
						}
					}

					if(pocketToLoad != null) {
						traverseListItem([pocketToLoad]);
					}

				} else if(item.id == '43dc775c-8b3c-46d4-afc5-ae452d9baf3d') {
					//no pocket
					showHideMonogram("pocket", false);
					removeFBX('pocket');
				}

				
			break;
			case "collar":
				//deSelectMaterialItem(customizationObj.list_item, ["collar_full", "collar_inside", "collar_outside"]);
			break;
			case "cuff":
				//deSelectMaterialItem(customizationObj.list_item, ["cuff_inside", "cuff_full", "cuff_outside", "cuff_piping"]);
			break;
			case "placket":
				//deSelectMaterialItem(customizationObj.list_item, ["placket_inside", "placket_outside"]);
			break;
			case "bottom":

				removeFBX('back_style');
				removeFBX('placket');

				var backToLoad;
				for(var i=0;i<customizationObj.list_item.length;i++) {
					if(customizationObj.list_item[i].id == '72e87961-471c-48c7-9f47-70b6d6c6274d') {
						backToLoad = customizationObj.list_item[i];
						break;
					}
				}
				if(backToLoad != null) {
					traverseListItem([backToLoad]);
				}

				var placketToLoad;
				for(var i=0;i<customizationObj.list_item.length;i++) {
					if(customizationObj.list_item[i].id == '088000a1-380d-4ca4-923f-7cb55bb158d1') {
						placketToLoad = customizationObj.list_item[i];
						break;
					}
				}
				if(placketToLoad != null) {
					traverseListItem([placketToLoad]);
				}

			break;
			case "sleeve":
				hideUnhideCuff(item.id);
				hideUnhideElbowPatch(item.id);

				if(item.id == 'e4c7a9d8-9378-49a5-9701-04f46fb5dc74') {
					//full sleeve
					selectedSleeve = 'full';
					showHideMonogram("sleeve_placket", true);
					showHideMonogram("cuff", true);
					updateMonogram();
				}else if(item.id == 'b3150be2-80d4-4645-bb54-86977d1a895f') {
					//full sleeve roll up
					selectedSleeve = 'roll';
					showHideMonogram("sleeve_placket", true);
					showHideMonogram("cuff", true);
					updateMonogram();
				} else if(item.id == '2a2bf549-87d7-4d0a-a1ca-6a6b1e2c1f08') {
					//half seleeve
					selectedSleeve = 'half';
					showHideMonogram("sleeve_placket", false);
					showHideMonogram("cuff", true);
					updateMonogram();
				} else if(item.id == '5b4dd1f4-f319-4337-8dc4-3b48c0e29cc5') {
					//muscle sleeve
					selectedSleeve = 'muscle';
					showHideMonogram("sleeve_placket", false);
					showHideMonogram("cuff", true);
					updateMonogram();
				}

			break;
			case "pocket":
				break;
			default:
			break;
		}
		//console.log(arrLoadedObj);
	}
}


function serachAndUpdatePath(arrItem, toBeReplaced, replaceText) {
	for(var i=0; i<arrItem.length;i++) {
		if(arrItem[i].fbx && arrItem[i].fbx.length>0) {
			for(var y=0;y<arrItem[i].fbx.length; y++) {
				for(var z=0; z<toBeReplaced.length ;z++) {
					arrItem[i].fbx[y].path = arrItem[i].fbx[y].path.replace(toBeReplaced[z], replaceText[z]);
					if(arrItem[i].fbx[y].bump){
						arrItem[i].fbx[y].bump = arrItem[i].fbx[y].bump.replace(toBeReplaced[z], replaceText[z]);
					}
				}
			}
		}
		if(arrItem[i].fbxBack && arrItem[i].fbxBack.length>0) {
			for(var y=0;y<arrItem[i].fbxBack.length; y++) {
				for(var z=0; z<toBeReplaced.length ;z++) {
					arrItem[i].fbxBack[y].path = arrItem[i].fbxBack[y].path.replace(toBeReplaced[z], replaceText[z]);
					if(arrItem[i].fbxBack[y].bump){
						arrItem[i].fbxBack[y].bump = arrItem[i].fbxBack[y].bump.replace(toBeReplaced[z], replaceText[z]);
					}
				}
			}
		}

		if(arrItem[i].child && arrItem[i].child.length>0) {
			serachAndUpdatePath(arrItem[i].child, toBeReplaced, replaceText)

		}
	}
}

function updatePath(itemId, toBeReplaced, replaceText) {
	var search = customizationObj.list_item.filter(function (el) {
	  return el.id == itemId;
	});
	serachAndUpdatePath(search, toBeReplaced, replaceText);
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
}


/*--------Monogram--------*/


function showHideMonogram(positionId, shouldShow) {
	if(shouldShow) {
		let pocketPostion = arrMonogramPosition.filter(function (el) {
			return el.id == positionId;
		});

		let isAlreadyAdded = customizationObj.monogram_position.filter(function (el) {
			return el.id == positionId;
		});

		// if(isAlreadyAdded.length == 0 && pocketPostion.length>0) {
		// 	customizationObj.monogram_position.push(JSON.parse(JSON.stringify(pocketPostion[0])))
		// }
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

		// customizationObj.monogram_position = customizationObj.monogram_position.filter(function (el) {
		// 	return el.id != positionId;
		// });


	}
	
}


function getMonogramPositonForPath(path, material) {
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
				}	
			}
		});
		arrLoadedObj.push({"fbx": {"category": "monogram"}, "object": object});
		scene.add( object );
		object.position.x = x;
		object.position.y = y;
		object.position.z = z;
	}, function ( progress ) {
		//on progress
	}, function ( error ) {
		//on error
	});
}

function updateShirtMonogramPadiy(value, type) {
	switch(type) {
		case "texture":
			for(var i=0; i<customizationObj.monogram_material.length; i++) {
				var item = customizationObj.monogram_material[i];
				if(item.id == value.id) {
					item.is_selected = true;
					monogramMaterialPath = item.path;
				} else {
					item.is_selected = false;
				}
			}
			updateMonogram();
		break;
		case "text":
			customizationObj.monogram_text = value;
			updateMonogram();
		break;
		case "position":
			for(var i=0; i<customizationObj.monogram_position.length; i++) {
				var item = customizationObj.monogram_position[i];
				if(item.id == value) {
					item.is_selected = true;
					if(value == 'cuff') {
						switch(selectedSleeve) {
							case 'full':
							case 'roll':
							selectCategoryPadiy(item.position.positionX, item.position.positionY, item.position.positionZ, item.position.controlX, item.position.controlY, item.position.controlZ,item.position.zoom ? item.position.zoom : 1);
				
							break;
							case 'half':
							case 'muscle':
							selectCategoryPadiy(item.hposition.positionX, item.hposition.positionY, item.hposition.positionZ, item.hposition.controlX, item.hposition.controlY, item.hposition.controlZ,item.position.zoom ? item.position.zoom : 1);			
							break;

						}

					} else {
						selectCategoryPadiy(item.position.positionX, item.position.positionY, item.position.positionZ, item.position.controlX, item.position.controlY, item.position.controlZ,item.position.zoom ? item.position.zoom : 1);
					}
					
				} else {
					item.is_selected = false;
				}
			}
			updateMonogram();
		break;
		case "save":
			updateMonogram();
		break;
		default:
		break;
	}
	
}

function updateMonogram() {
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
		for (var i = 0; i < customizationObj.monogram_text.length; i++) {
			var char = customizationObj.monogram_text.charAt(i).toUpperCase();
			var monogramMaterialLoader = new THREE.TextureLoader();
			monogramMaterial = monogramMaterialLoader.load(baseUrl+monogramMaterialPath+"/"+char+".png");

			var searchedItem = searchPosition[0];
			var strIndex = (i+1).toString();
			if(monogramPostion == 'cuff'){
				switch(selectedSleeve) {
					case 'full':
					case 'roll':
					break;
					case 'half':
						strIndex = strIndex+"_half_sleeve"
						break;
					case 'muscle':
						strIndex = strIndex+"_muscle_sleeve"
						break;
	
				}
			}
			

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
		// 			var char = customizationObj.monogram_text.charAt(i).toUpperCase();
		// 			var searchedItem = searchPosition[0];
		// 			var strIndex = (i+1).toString();
		// 			if(monogramPostion == 'cuff') {
		// 				switch(selectedSleeve) {
		// 					case 'full':
		// 					getMonogramPositonForPath(searchedItem.path.replace("%monogram_char%", char.toUpperCase()), searchedItem['x'+strIndex], searchedItem['y'+strIndex], searchedItem['z'+strIndex]);
		// 					break;
		// 					case 'roll':
		// 					//getMonogramPositonForPath(searchedItem.path.replace("%monogram_char%", char.toUpperCase()), searchedItem['x'+strIndex], searchedItem['y'+strIndex], searchedItem['z'+strIndex]);
		// 					break;
		// 					case 'half':
		// 					getMonogramPositonForPath(searchedItem.path.replace("%monogram_char%", char.toUpperCase()).replace('/Cuff', '/Half_sleeve_cuff').replace('first_position_cuff.fbx', 'first_position_half_sleeve_cuff.fbx'), searchedItem['hx'+strIndex], searchedItem['hy'+strIndex], searchedItem['hz'+strIndex]);
		// 					break;

		// 					case 'muscle':
		// 					getMonogramPositonForPath(searchedItem.path.replace("%monogram_char%", char.toUpperCase()).replace('/Cuff', '/Muscle_sleeve_cuff').replace('first_position_cuff.fbx', 'first_position_muscle_sleeve_cuff.fbx'), searchedItem['mx'+strIndex], searchedItem['my'+strIndex], searchedItem['mz'+strIndex]);
							
		// 					break;

		// 				}

		// 			} else if(monogramPostion == 'sleeve_placket') {
		// 				switch(selectedSleeve) {
		// 					case 'full':
		// 					getMonogramPositonForPath(searchedItem.path.replace("%monogram_char%", char.toUpperCase()), searchedItem['x'+strIndex], searchedItem['y'+strIndex], searchedItem['z'+strIndex]);		
		// 					break;
		// 				}

		// 			} else {
		// 				getMonogramPositonForPath(searchedItem.path.replace("%monogram_char%", char.toUpperCase()), searchedItem['x'+strIndex], searchedItem['y'+strIndex], searchedItem['z'+strIndex]);
		// 			}
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

export function isLoadingShirtFbxPadiy() {
	return isLoadingFbx;
}

export function changeView(visibility) {
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
export function applySelection(selectedItem,selectedChildItem,selectedSecendItem,selectedSecondChildItem){
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
        if((item.id==selectedItem) || (item.id==selectedSecendItem)) {
            let childItem = item.child;
            for(var j=0; j<childItem.length;j++) {
                if(childItem[j].child!= null && childItem[j].child.length>0){
                    if((childItem[j].id == selectedChildItem) || (childItem[j].id == selectedSecondChildItem)){
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
	//console.log(customizationObj);
}
export function resetSelection(selectedItem,selectedChildItem,selectedSecendItem,selectedSecondChildItem){
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
        if((item.id==selectedItem) || (item.id==selectedSecendItem)) {
            let childItem = item.child;
            for(var j=0; j<childItem.length;j++) {
                if(childItem[j].child!= null && childItem[j].child.length>0){
                    if((childItem[j].id == selectedChildItem) || (childItem[j].id == selectedSecondChildItem)){
                        for(var k=0; k<childItem[j].child.length;k++) {
                            let childElm = childItem[j].child[k];
                            childElm.is_selected = false;
                            if(childElm.selectionType!=undefined && childElm.selectionType == 'final'){
                                childElm.is_selected = true;
                                selectShirtCustomizationItemPadiy(childElm);
                            }
                        }
                    }
                }else{
                    childItem[j].is_selected = false;
                    if(childItem[j].selectionType!=undefined && childItem[j].selectionType == 'final'){
                        childItem[j].is_selected = true;
                        selectShirtCustomizationItemPadiy(childItem[j]);
                    }
                }
            }

        }
    }
	

}
export function changeBaseTexture(material,base_material){
	console.log(material.base);


	baseMaterial = textureLoader.load(baseUrl+material.base);
	baseMaterial.wrapS = baseMaterial.wrapT = THREE.RepeatWrapping;
	baseMaterial.offset.set(0,0);
	baseMaterial.repeat.set(15,15);
	shirtLightMapIntensity = parseFloat(base_material.light_map_intensity);	
	
	

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
				case "collar_outside":
					if(!selectedStyleMaterial["collar_outside"]) {
						arrLoadedObj[i].object.traverse( function( node ) {
							if ( node.isMesh ) {
								node.material.map = baseMaterial;
								node.material.lightMapIntensity = shirtLightMapIntensity;
							}
						});
					}
				break;
				case "collar":
					if(!selectedStyleMaterial["collar"]) {
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
				case "cuff_outside":
					if(!selectedStyleMaterial["cuff_outside"]) {
						arrLoadedObj[i].object.traverse( function( node ) {
							if ( node.isMesh ) {
								node.material.map = baseMaterial;
								node.material.lightMapIntensity = shirtLightMapIntensity;
							}
						});
					}
				break;
				case "cuff_piping":
					if(!selectedStyleMaterial["cuff_piping"]) {
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
				case "placket_outside":
					if(!selectedStyleMaterial["placket_outside"]) {
						arrLoadedObj[i].object.traverse( function( node ) {
							if ( node.isMesh ) {
								node.material.map = baseMaterial;
								node.material.lightMapIntensity = shirtLightMapIntensity;
							}
						});
					}
				break;
				case "placket_edge":
					if(!selectedStyleMaterial["placket_edge"]) {
						arrLoadedObj[i].object.traverse( function( node ) {
							if ( node.isMesh ) {
								node.material.map = baseMaterial;
								node.material.lightMapIntensity = shirtLightMapIntensity;
							}
						});
					}
				break;
				case "placket_piping_inside":
					if(!selectedStyleMaterial["placket_piping_inside"]) {
						arrLoadedObj[i].object.traverse( function( node ) {
							if ( node.isMesh ) {
								node.material.map = baseMaterial;
								node.material.lightMapIntensity = shirtLightMapIntensity;
							}
						});
					}
				break;
				case "placket_piping_outside":
					if(!selectedStyleMaterial["placket_piping_outside"]) {
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

			// if(selectedStyleMaterial["collar_inside"]) {
			// 	loadMaterial(node, selectedStyleMaterial["collar_inside"])
			// }
			
		}
	}
	for(var i=0; i<arrLoadedObjBack.length; i++) {
		if(arrLoadedObjBack[i].fbx.material_type == 0){
			switch(arrLoadedObjBack[i].fbx.sub_category) {
				case "elbowpatch":
					if(!selectedStyleMaterial["elbowpatch"]) {
						arrLoadedObjBack[i].object.traverse( function( node ) {
							if ( node.isMesh ) {
								node.material.map = baseMaterial;
								node.material.lightMapIntensity = shirtLightMapIntensity;
							}
						});
					}
				break;
				default:
					arrLoadedObjBack[i].object.traverse( function( node ) {
						if ( node.isMesh ) {
							node.material.map = baseMaterial;
							node.material.lightMapIntensity = shirtLightMapIntensity;
						}
					});
				break;
			}
		}
	}

	
	//console.log(arrLoadedObj);
	
	// console.log(baseUrl+object.material.base);

	// stichMaterial = textureLoader.load(baseUrl+object.material.stich);
	// stichMaterial.wrapS = stichMaterial.wrapT = THREE.RepeatWrapping;
	// buttonMaterial = textureLoader.load(baseUrl+object.material.button);
	// buttonMaterial.wrapS = buttonMaterial.wrapT = THREE.RepeatWrapping;
	// buttonHoleMaterial = textureLoader.load(baseUrl+object.material.button);
	// buttonHoleMaterial.wrapS = buttonHoleMaterial.wrapT = THREE.RepeatWrapping;
	// buttonStichMaterial = textureLoader.load(baseUrl+object.material.button);
	// buttonStichMaterial.wrapS = buttonStichMaterial.wrapT = THREE.RepeatWrapping;
}


window.resetSelection = resetSelection;
window.applySelection = applySelection;
window.isLoadingShirtFbxPadiy = isLoadingShirtFbxPadiy;
window.updateShirtMonogramPadiy = updateShirtMonogramPadiy;
window.shirtInitPadiy = shirtInitPadiy;
window.changeBaseTexture = changeBaseTexture;
window.selectShirtCustomizationItemPadiy = selectShirtCustomizationItemPadiy;
window.changeView = changeView;
