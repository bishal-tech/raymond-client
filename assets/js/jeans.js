import * as THREE from './threejs/build/three.module.js';
import { FBXLoader } from './threejs/examples/jsm/loaders/FBXLoader.js';

var baseMaterial;
var buttonMaterial;
var fadedMaterial;
var leatherPatchMaterial;
var tornMaterial;
var stitchMaterial;
var flyStyleStitchMaterial;
var coinPocketStitchMaterial;
var inSeamMaterial;
var outSeamMaterial;
var backPocketStitchMaterial;
var backStitchMaterial;
var selectedStitchMaterial;
var buttonRivetMaterial;
var dummyLightMapMaterial;
var decoStitchMaterial;

var fbxLocator = "";

var baseUrl = "";
var customizationObj;
var arrLoadedObj = [];
var arrLoadedObjBack = [];
var arrItemsBack = [];

var scene;
var currentParent;
var isLoadingFbx = false;
var coinPocketObjcet;
var coinPocketObjectIndex = -1;
var LightMapIntensity = 0.6;
var buttonLightMapIntensity = 1.1;
var leatherPatchLightMapIntensity = 1;
var tornLightMapIntensity = 1.1;
var activeView = "Front";
var buttonLightMapMaterial;
var textureLoader = new THREE.TextureLoader();
var selectedTornType = "";
var monogramMaterialPath = "";
var monogramMaterial;
var monogramPostion;
var stitchLightMapIntensity = 0.7;
export function jeansInit(obj, wishListCustomization, threeJsScene, customizationUrl, isSimilarItem) {
	baseUrl = customizationUrl;
	customizationObj = obj;
	scene = threeJsScene;
	arrItemsBack = customizationObj.list_item_back;

	if(obj.base_material.light_map_intensity) {
		LightMapIntensity = parseFloat(obj.base_material.light_map_intensity);	
	}

    // if(obj.base_material.button_light_map_intensity) {
	// 	buttonLightMapIntensity = parseFloat(obj.base_material.button_light_map_intensity);	
	// }

	//update main customization object depending on wishlised customization
	//console.log(wishListCustomization);
	
	if(wishListCustomization) {
		function getObject(parentId, arr) {
			var filter = wishListCustomization.selected_items.filter(function(item) {
        		return item.parent_id == parentId;
        	});
	        for (var i = 0; i < arr.length; i++) {
	        	if(filter.length>0) {
					if(arr[i].is_multiple){
						for (var j = 0; j < filter.length; j++) {
							if(filter[j].selected_id == arr[i].id) {
								arr[i].is_selected = true;
								arr[i].selectionType = "final";
							}
						}
					}else{
						if(filter[0].selected_id == arr[i].id) {
							arr[i].is_selected = true;
							arr[i].selectionType = "final";
						} else {
							arr[i].is_selected = false;
						}	
					}
	        	}
	            if (arr[i].child && arr[i].child.length > 0) {
	                getObject(arr[i].id, arr[i].child);
	            }
	        }
	    }
	    getObject("", customizationObj.list_item);

		//Select Torn Placement
		for (var i = 0; i < customizationObj.list_item[6].child[1].child.length; i++) {
			var findSelectedChild = customizationObj.list_item[6].child[1].child[i].child.filter(function(item) {
        		return item.is_selected;
        	});
			
			if(findSelectedChild.length>0) {
				customizationObj.list_item[6].child[1].child[i].is_selected = true;
			}
		}
		
	}
	var searchTornType = customizationObj.list_item[6].child[0].child.filter(function (el) {
		return el.is_selected == true;
	});
	if(searchTornType.length>0){
		selectedTornType = searchTornType[0];
	}
	//console.log(customizationObj.list_item);
	

	var selectedButton = customizationObj.list_item[8].child.filter(function (el) {
		return el.is_selected == true;
	});
	if(selectedButton.length>0){
		buttonRivetMaterial = textureLoader.load(baseUrl+'Front/'+selectedButton[0].fbx[0].bump);
	}
	
	//var textureLoader = new THREE.TextureLoader();

	baseMaterial = textureLoader.load(baseUrl+customizationObj.material.base);
	baseMaterial.wrapS = baseMaterial.wrapT = THREE.RepeatWrapping;

	fadedMaterial = textureLoader.load(baseUrl+customizationObj.material.faded);
	fadedMaterial.wrapS = fadedMaterial.wrapT = THREE.RepeatWrapping;

	//buttonMaterial = textureLoader.load(baseUrl+customizationObj.material.button);
	//buttonMaterial.wrapS = buttonMaterial.wrapT = THREE.RepeatWrapping;

	leatherPatchMaterial = textureLoader.load(baseUrl+customizationObj.material.leather_patch);
	leatherPatchMaterial.wrapS = leatherPatchMaterial.wrapT = THREE.RepeatWrapping;

	tornMaterial = textureLoader.load(baseUrl+'texture/torn_texture-v2.png');
	//tornMaterial.wrapS = tornMaterial.wrapT = THREE.RepeatWrapping;


	

	buttonLightMapMaterial = textureLoader.load(baseUrl+'texture/white-lightmap.jpg');
	dummyLightMapMaterial = textureLoader.load(baseUrl+'texture/white-lightmap.jpg');
	arrLoadedObj = [];
	arrLoadedObjBack = [];
	activeView = "Front";
	
	updateFbxLocator();
	updateStitchMaterial();
	var timer;
	var isCommonItemLoaded = false;
	var isListItemLoaded = false;
	
	console.log(fbxLocator);

	loadFBX(1, customizationObj.common_item[0], customizationObj.common_item, "","Front");
	traverseListItem(customizationObj.list_item);
	loadFBX(1, customizationObj.common_item_back[0], customizationObj.common_item_back, "","Back");

	// traverseListItem(customizationObj.list_item, function() {
	// 	//list item loaded
	// 	clearInterval(timer);
	// 	timer = setTimeout(x => {
	// 		if(!isLoadingFbx) {
	// 			isListItemLoaded = true;
	// 			if(isCommonItemLoaded) {
	// 				hideloader();
	// 			}
	// 		}
	//     }, 3000);
	// });
}

function updateFbxLocator() {

	//get the selected Style
	var search = customizationObj.list_item.filter(function (el) {
	  return el.id == "e5ea6792-29ef-430d-a4f1-d53d7d3cd85c";
	});

	if(search.length>0) {
		var selectedItem = search[0].child.filter(function (el) {
	  		return el.is_selected;
		});

		if(selectedItem.length>0) {
			fbxLocator = selectedItem[0].fbx_locator;
		}
	}

}

function updateStitchMaterial() {
	//var textureLoader = new THREE.TextureLoader();
	//get the selected stitch
	var search = customizationObj.list_item.filter(function (el) {
	  return el.id == "3531ea49-994e-4187-8494-c9ae4fbe6578";
	});
	if(search.length>0) {
		var selectedItem = search[0].child.filter(function (el) {
	  		return el.is_selected;
		});

		var searchFlyStyle = customizationObj.list_item.filter(function (el) {
			return el.id == "478f9d94-ea96-47a2-bfb8-3e0b7785b84d";
		});

		var searchCoinPocket = customizationObj.list_item.filter(function (el) {
			return el.id == "e667ac1a-1612-4b5f-b953-949d1face072";
		});

		var searchInseam = customizationObj.list_item.filter(function (el) {
			return el.id == "d8179487-0adb-46e0-8748-cb1a750463a9";
		});

		var searchOutseam = customizationObj.list_item.filter(function (el) {
			return el.id == "08fe3393-c75b-42d2-b8b3-f8e1e9bf3d22";
		});

		var searchBackPocket = customizationObj.list_item.filter(function (el) {
			return el.id == "dd8dc12a-18b1-41c4-a769-5b586ef0d16d";
		});
		
		var searchDecoStitch = customizationObj.list_item.filter(function (el) {
			return el.id == "dae6a98b-1ab7-4a31-83ec-52371296fe10";
		});

		if(selectedItem.length>0) {
			selectedStitchMaterial = selectedItem[0].material;
			stitchMaterial = textureLoader.load(baseUrl+selectedItem[0].material);
			stitchMaterial.wrapS = stitchMaterial.wrapT = THREE.RepeatWrapping;

			backStitchMaterial = textureLoader.load(baseUrl+"Back/Base Stitch/"+selectedItem[0].material);

			if(searchFlyStyle.length>0) {
				var selectedFlyStyle = searchFlyStyle[0].child.filter(function (el) {
					return el.is_selected;
			  	});
				flyStyleStitchMaterial = textureLoader.load(baseUrl+activeView+"/"+selectedFlyStyle[0].material_path+selectedItem[0].material);
			}

			if(searchCoinPocket.length>0) {
				var selectedCoinPocket = searchCoinPocket[0].child.filter(function (el) {
					return el.is_selected;
			  	});
				  coinPocketStitchMaterial = textureLoader.load(baseUrl+activeView+"/"+selectedCoinPocket[0].material_path+selectedItem[0].material);
			}

			if(searchInseam.length>0) {
				var selectedInseam = searchInseam[0].child.filter(function (el) {
					return el.is_selected;
			  	});
				  var material_path = selectedInseam[0].material_path;
				  material_path = material_path.replaceAll("%fbx_locator%", fbxLocator);
				  inSeamMaterial = textureLoader.load(baseUrl+activeView+"/"+material_path+selectedItem[0].material);
			}

			if(searchOutseam.length>0) {
				var selectedOutseam = searchOutseam[0].child.filter(function (el) {
					return el.is_selected;
			  	});
				  var material_path = selectedOutseam[0].material_path;
				  material_path = material_path.replaceAll("%fbx_locator%", fbxLocator);
				  outSeamMaterial = textureLoader.load(baseUrl+activeView+"/"+material_path+selectedItem[0].material);
			}

			if(searchBackPocket.length>0) {
				var selectedBackPocket = searchBackPocket[0].child.filter(function (el) {
					return el.is_selected;
			  	});
				  backPocketStitchMaterial = textureLoader.load(baseUrl+"Back/"+selectedBackPocket[0].material_path+selectedItem[0].material);
			}

			if(searchDecoStitch.length>0) {
				var selectedDecoStitch = searchDecoStitch[0].child.filter(function (el) {
					return el.is_selected;
			  	});
				decoStitchMaterial = textureLoader.load(baseUrl+"Back/"+selectedDecoStitch[0].material_path+selectedItem[0].material);
			}
			

			

			
		}
	}

	//update fbx
	if(arrLoadedObj && arrLoadedObj.length > 0) {
		for(var i=0; i<arrLoadedObj.length; i++) {
			switch(arrLoadedObj[i].fbx.material_type) {
				case "4":
					arrLoadedObj[i].object.traverse( function( node ) {
						if ( node.isMesh ) {
							node.material = new THREE.MeshPhongMaterial({
								map: stitchMaterial,
								shininess: 10,
								lightMap: dummyLightMapMaterial,
								lightMapIntensity: stitchLightMapIntensity,
								transparent: true,
								opacity:1
							});
							node.material.side = THREE.DoubleSide;
						}
					});
				break;
				case "12": 
					arrLoadedObj[i].object.traverse( function( node ) {
						if ( node.isMesh ) {
							node.material = new THREE.MeshPhongMaterial({
								map: flyStyleStitchMaterial,
								shininess: 10,
								lightMap: dummyLightMapMaterial,
								lightMapIntensity: stitchLightMapIntensity,
								transparent: true,
								opacity:1
							});
							node.material.side = THREE.DoubleSide;
						}
					});
				break;
				case "13":
					arrLoadedObj[i].object.traverse( function( node ) {
						if ( node.isMesh ) {
							node.material = new THREE.MeshPhongMaterial({
								map: coinPocketStitchMaterial,
								shininess: 10,
								lightMap: dummyLightMapMaterial,
								lightMapIntensity: stitchLightMapIntensity,
								transparent: true,
								opacity:1
							});
							node.material.side = THREE.DoubleSide;
						}
					});
				break;
				case "14": 
					arrLoadedObj[i].object.traverse( function( node ) {
						if ( node.isMesh ) {
							node.material = new THREE.MeshPhongMaterial({
								map: inSeamMaterial,
								shininess: 10,
								lightMap: dummyLightMapMaterial,
								lightMapIntensity: stitchLightMapIntensity,
								transparent: true,
								opacity:1
							});
							node.material.side = THREE.DoubleSide;
						}
					});
				break;
				case "15":
					arrLoadedObj[i].object.traverse( function( node ) {
						if ( node.isMesh ) {
							node.material = new THREE.MeshPhongMaterial({
								map: outSeamMaterial,
								shininess: 10,
								lightMap: dummyLightMapMaterial,
								lightMapIntensity: stitchLightMapIntensity,
								transparent: true,
								opacity:1
							});
							node.material.side = THREE.DoubleSide;
						}
					});
				break;
			}
		}
		for(var i=0; i<arrLoadedObjBack.length; i++) {
			switch(arrLoadedObjBack[i].fbx.material_type) {
				case "17":
					arrLoadedObjBack[i].object.traverse( function( node ) {
						if ( node.isMesh ) {
							node.material = new THREE.MeshPhongMaterial({
								map: backPocketStitchMaterial,
								shininess: 10,
								lightMap: dummyLightMapMaterial,
								lightMapIntensity: stitchLightMapIntensity,
								transparent: true,
								opacity:1
							});
							node.material.side = THREE.DoubleSide;
						}
					});
				break;
				case "18":
					arrLoadedObjBack[i].object.traverse( function( node ) {
						if ( node.isMesh ) {
							node.material = new THREE.MeshPhongMaterial({
								map: backStitchMaterial,
								shininess: 10,
								lightMap: dummyLightMapMaterial,
								lightMapIntensity: stitchLightMapIntensity,
								transparent: true,
								opacity:1
							});
							node.material.side = THREE.DoubleSide;
						}
					});
				break;
				case "19":
					arrLoadedObjBack[i].object.traverse( function( node ) {
						if ( node.isMesh ) {
							node.material = new THREE.MeshPhongMaterial({
								map: decoStitchMaterial,
								shininess: 10,
								lightMap: dummyLightMapMaterial,
								lightMapIntensity: stitchLightMapIntensity,
								transparent: true,
								opacity:1
							});
							node.material.side = THREE.DoubleSide;
						}
					});
				break;
			}
			
		}

	}
}

function loadFBX(nextIndex, customizationObjItem, arrItems,callBack,view) {
	var loader = new FBXLoader();
	function setupMaterial(node, materialType,bumpMap) {
		//console.log(node);
		//console.log("Material Type"+materialType);
		switch(materialType) {
			case "0": //base
				node.material = new THREE.MeshPhongMaterial({
					map: baseMaterial,
					shininess: 10,
					lightMap: textureLoader.load(baseUrl+view+'/'+bumpMap),
					lightMapIntensity: LightMapIntensity
				});
				node.material.side = THREE.DoubleSide;
			break;
			case "3": //button
				node.material = new THREE.MeshPhongMaterial({
					map: buttonMaterial,
					shininess: 10,
					lightMap: buttonLightMapMaterial,
					lightMapIntensity: buttonLightMapIntensity
				});
				node.material.side = THREE.DoubleSide;
			break;
			case "4": //stitch
				node.material = new THREE.MeshPhongMaterial({
					map: stitchMaterial,
					shininess: 10,
					lightMap: dummyLightMapMaterial,
					lightMapIntensity: stitchLightMapIntensity,
					transparent: true,
					opacity:1
				});
				node.material.side = THREE.DoubleSide;
			break;
			case "5": //denim torn
				
				if(selectedTornType.id == '1bd6381f-1d3e-4f78-ae58-e042dd4f3f86'){
					tornMaterial = textureLoader.load(baseUrl+view+'/'+fbxLocator+'/Torn/texture/torn_texture/'+bumpMap);
				}else{
					tornMaterial = textureLoader.load(baseUrl+view+'/'+fbxLocator+'/Torn/texture/torn_patch_texture/'+bumpMap);
				}

				node.material = new THREE.MeshPhongMaterial({
					map: tornMaterial,
					shininess: 10,
					lightMap: dummyLightMapMaterial,
					lightMapIntensity: tornLightMapIntensity,
					transparent: true,
					opacity:1
				});
			break;
			case "6": //denim leather patch
					node.material = new THREE.MeshPhongMaterial({
						map: textureLoader.load(baseUrl+view+'/'+bumpMap),
						shininess: 5,
						lightMap: dummyLightMapMaterial,
						lightMapIntensity: leatherPatchLightMapIntensity
					});
					node.material.side = THREE.DoubleSide;
			break;
			case "10": //Denim Fly Opeing
				node.material = new THREE.MeshPhongMaterial({
					map: textureLoader.load(baseUrl+view+'/'+bumpMap),
					shininess: 10,
					lightMap: dummyLightMapMaterial,
					lightMapIntensity: stitchLightMapIntensity,
					transparent: true,
					opacity:1
				});
				node.material.side = THREE.DoubleSide;
			break;
			case "11": //Denim Button & Rivet
				buttonRivetMaterial = textureLoader.load(baseUrl+view+'/'+bumpMap);
				node.material = new THREE.MeshPhongMaterial({
					map: buttonRivetMaterial,
					shininess: 10,
					lightMap: buttonLightMapMaterial,
					lightMapIntensity: buttonLightMapIntensity
				});
				node.material.side = THREE.DoubleSide;
				
			break;
			case "12": //Denim Fly Stitch
				node.material = new THREE.MeshPhongMaterial({
					map: flyStyleStitchMaterial,
					shininess: 10,
					lightMap: dummyLightMapMaterial,
					lightMapIntensity: stitchLightMapIntensity,
					transparent: true,
					opacity:1
				});
				node.material.side = THREE.DoubleSide;
			break;
			case "13": //Denim Coin Pocket Stitch
				node.material = new THREE.MeshPhongMaterial({
					map: coinPocketStitchMaterial,
					shininess: 10,
					lightMap: dummyLightMapMaterial,
					lightMapIntensity: stitchLightMapIntensity,
					transparent: true,
					opacity:1
				});
				node.material.side = THREE.DoubleSide;
			break;
			case "14": //Denim Inseam
				node.material = new THREE.MeshPhongMaterial({
					map: inSeamMaterial,
					shininess: 10,
					lightMap: dummyLightMapMaterial,
					lightMapIntensity: stitchLightMapIntensity,
					transparent: true,
					opacity:1
				});
				node.material.side = THREE.DoubleSide;
			break;
			case "15": //Denim Outseam
				node.material = new THREE.MeshPhongMaterial({
					map: outSeamMaterial,
					shininess: 10,
					lightMap: dummyLightMapMaterial,
					lightMapIntensity: stitchLightMapIntensity,
					transparent: true,
					opacity:1
				});
				node.material.side = THREE.DoubleSide;
			break;
			case "16": //Denim Fly Opeing Button
				node.material = new THREE.MeshPhongMaterial({
					map: buttonRivetMaterial,
					shininess: 10,
					lightMap: buttonLightMapMaterial,
					lightMapIntensity: buttonLightMapIntensity
				});
				node.material.side = THREE.DoubleSide;
			break;
			case "17": //Denim Back Pocket Stitch
				node.material = new THREE.MeshPhongMaterial({
					map: backPocketStitchMaterial,
					shininess: 10,
					lightMap: dummyLightMapMaterial,
					lightMapIntensity: stitchLightMapIntensity,
					transparent: true,
					opacity:1
				});
				node.material.side = THREE.DoubleSide;
			break;
			case "18": //Denim Back Stitch
				node.material = new THREE.MeshPhongMaterial({
					map: backStitchMaterial,
					shininess: 10,
					lightMap: dummyLightMapMaterial,
					lightMapIntensity: stitchLightMapIntensity,
					transparent: true,
					opacity:1
				});
				node.material.side = THREE.DoubleSide;
			break;
			case "19": //Denim Deco Stitch
				node.material = new THREE.MeshPhongMaterial({
					map: decoStitchMaterial,
					shininess: 10,
					lightMap: dummyLightMapMaterial,
					lightMapIntensity: stitchLightMapIntensity,
					transparent: true
				});
				node.material.side = THREE.DoubleSide;
			break;
			default:
				node.material.map = baseMaterial
			break;
		}
		

	}
	isLoadingFbx = true;
	var fbxPath = customizationObjItem.path;

	//Update path if it depends on the fbx locator
	fbxPath = fbxPath.replaceAll("%fbx_locator%", fbxLocator);

	loader.load( baseUrl+view+"/" + fbxPath, function ( object ) {
		//onload
		isLoadingFbx = false;
		object.traverse( function( node ) {
			if ( node.isMesh ) {
				// console.log(node.name);
				if( node.material ) {
					node.material.side = THREE.DoubleSide;
					setupMaterial(node, customizationObjItem.material_type,customizationObjItem.bump);
					
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
			loadFBX(nextIndex+1, arrItems[nextIndex], arrItems, callBack,view);
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
		// console.log(error);
	});
}

function traverseListItem(arrItems) {
	for(var i=0; i<arrItems.length;i++) {
		let item = arrItems[i];
		if(item.is_selected && item.fbx != null && item.fbx.length > 0) {
			loadFBX(1, item.fbx[0], item.fbx, "","Front");
		}
		if(item.is_selected && item.fbxBack != null && item.fbxBack.length > 0 && arrItemsBack.includes(item.category)) {
			//console.log(item.fbxBack);
            loadFBX(1, item.fbxBack[0], item.fbxBack, "","Back");
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

function updateStyleFor(ids, categories) {
	var search = customizationObj.list_item.filter(function (el) {
	  return ids.includes(el.id);
	});

	//Remove previously loaded fbx if any
	for(var i=0;i<categories.length;i++) {

		//search the loaded fbx for the category
		var searchFbx = arrLoadedObj.filter(function (el) {
		  return el.fbx.category == categories[i];
		});

		//remove the found items
		if(searchFbx.length>0) {
			for(var j=0; j<searchFbx.length; j++) {
				scene.remove(searchFbx[j].object)
			}
		}

		//update the array
		arrLoadedObj = arrLoadedObj.filter(function (el) {
		  return el.fbx.category != categories[i];
		});

	}
	
	traverseListItem(search);
}


function selectJeansCustomizationItem(item) {
	console.log("Fremw");
	console.log(item);
	if(item.sub_category != "stitch_color") {
		
		//if ongoing loading, do nothing or it will overlap
		if(isLoadingFbx) {
			return;
		}
		//fbx update

		if(item.is_multiple) {
			//for torn 
			if(item.is_selected) {
				//deselct item
				//search the loaded fbx for the sub_category
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
						if(currentParent.child[i].id == item.id) {
							currentParent.child[i].is_selected = false;
						}
					}
				}
			} else {
				//select item
				//update is_selected
				currentParent = null;
				getParent(item, customizationObj.list_item);
				if(currentParent != null) {
					var selectedIndex = -1;
					for(var i=0;i<currentParent.child.length;i++) {
						if(currentParent.child[i].id == item.id) {
							selectedIndex = i;
							currentParent.child[i].is_selected = true;
						}
					}
					console.log(customizationObj.list_item);
					console.log("selectedIndex"+selectedIndex);
					//insert the new fbx
					if(selectedIndex > -1) {
						traverseListItem([currentParent.child[selectedIndex]]);
					}
					
				}

			}
		} else {
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

			//search the loaded fbx for the category
			var searchBack = arrLoadedObjBack.filter(function (el) {
				return el.fbx.category == item.category;
			  });
  
			  //remove the found Back items
			  if(searchBack.length>0) {
				  for(var i=0; i<searchBack.length; i++) {
					  scene.remove(searchBack[i].object)
				  }
			  }

			//update the array
			arrLoadedObj = arrLoadedObj.filter(function (el) {
			  return el.fbx.category != item.category;
			});

			//update the array
			arrLoadedObjBack = arrLoadedObjBack.filter(function (el) {
				return el.fbx.category != item.category;
			  });
  

			//update is_selected
			currentParent = null;
			getParent(item, customizationObj.list_item);
			if(currentParent != null) {
				console.log(currentParent);

				for(var i=0;i<currentParent.child.length;i++) {
					currentParent.child[i].is_selected = currentParent.child[i].id == item.id;
				}

				
				console.log(item.category);
				switch(item.category) {
					case "style":
						updateFbxLocator();
						updateStyleFor(
							[
								"7a431a27-b7fd-4f26-b02f-5b200c5d5c90", 
								"d8179487-0adb-46e0-8748-cb1a750463a9", 
								"08fe3393-c75b-42d2-b8b3-f8e1e9bf3d22"
							],
							[
								"inseam",
								"outseam",
								"torn_left_lower",
								"torn_left_upper",
								"torn_right_lower",
								"torn_right_upper"
							]
							);
					break;
					case "fly_style":
						flyStyleStitchMaterial = textureLoader.load(baseUrl+activeView+"/"+item.material_path+selectedStitchMaterial);
						break;
					case "coin_pocket":
						coinPocketStitchMaterial = textureLoader.load(baseUrl+activeView+"/"+item.material_path+selectedStitchMaterial);
						break;
					case "inseam":
						var material_path = item.material_path;
				  		material_path = material_path.replaceAll("%fbx_locator%", fbxLocator);
				  		inSeamMaterial = textureLoader.load(baseUrl+activeView+"/"+material_path+selectedStitchMaterial);
						break;
					case "outseam":
						var material_path = item.material_path;
				  		material_path = material_path.replaceAll("%fbx_locator%", fbxLocator);
				  		outSeamMaterial = textureLoader.load(baseUrl+activeView+"/"+material_path+selectedStitchMaterial);
						break;
					case "back_pocket":
						backPocketStitchMaterial = textureLoader.load(baseUrl+"Back/"+item.material_path+selectedStitchMaterial);
						break;
					case "deco_stich":
						decoStitchMaterial = textureLoader.load(baseUrl+"Back/"+item.material_path+selectedStitchMaterial);
						break;
					case "torn_type":
						selectedTornType = item;
						var tornPath = "";
						if(selectedTornType.id == '1bd6381f-1d3e-4f78-ae58-e042dd4f3f86'){
							tornPath = baseUrl+'/Front/'+fbxLocator+'/Torn/texture/torn_texture/';
						}else{
							tornPath = baseUrl+'/Front/'+fbxLocator+'/Torn/texture/torn_patch_texture/';
						}

						
						// if(selectedTornType.id == '1bd6381f-1d3e-4f78-ae58-e042dd4f3f86'){
						// 	tornMaterial = textureLoader.load(baseUrl+'Front/'+fbxLocator+'/Torn/torn.png');
						// }else{
						// 	tornMaterial = textureLoader.load(baseUrl+'Front/'+fbxLocator+'/Torn/torn_patch.png');
						// }
						console.log(arrLoadedObj);

						for(var i=0; i<arrLoadedObj.length; i++) {
							if(arrLoadedObj[i].fbx.category == 'torn_right_upper' || arrLoadedObj[i].fbx.category == 'torn_right_lower'
							|| arrLoadedObj[i].fbx.category == 'torn_left_upper' || arrLoadedObj[i].fbx.category == 'torn_left_lower'){
								arrLoadedObj[i].object.traverse( function( node ) {
									tornMaterial = textureLoader.load(tornPath+arrLoadedObj[i].fbx.bump);
									if ( node.isMesh ) {
										node.material.map = tornMaterial;
									}
								});
							}
						}
						break;
					case "button_rivet":
						var fbxSearch = arrLoadedObj.filter(function (el) {
						return el.fbx.material_type == "16";
						});
						console.log(baseUrl+activeView+'/'+item.bump);
						for(var i=0;i<fbxSearch.length;i++) {
							fbxSearch[i].object.traverse( function( node ) {
								if ( node.isMesh ) {
									node.material = new THREE.MeshPhongMaterial({
										map: textureLoader.load(baseUrl+activeView+'/'+item.fbx[0].bump),
										shininess: 10,
										lightMap: dummyLightMapMaterial,
										lightMapIntensity: buttonLightMapIntensity
									});
									node.material.side = THREE.DoubleSide;
								}
							});
						}
						break;
					default:
					break;
				}

				//insert the new fbx
				traverseListItem(currentParent.child);
			}

		}
	} else {
		//update is_selected
		currentParent = null;
		getParent(item, customizationObj.list_item);
		if(currentParent != null) {
			for(var i=0;i<currentParent.child.length;i++) {
				currentParent.child[i].is_selected = currentParent.child[i].id == item.id;
			}

			//update stitch color
			updateStitchMaterial();
		}
	}
}

export function isLoadingJeansFbx() {
	return isLoadingFbx;
}

function resetSelectionJeans(selectedItem,selectedChildItem){
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
                                selectJeansCustomizationItem(childElm);
                            }
                        }
                    }
                }else{
                    childItem[j].is_selected = false;
                    if(childItem[j].selectionType!=undefined && childItem[j].selectionType == 'final'){
                        childItem[j].is_selected = true;
                        selectJeansCustomizationItem(childItem[j]);
                    }
                }
            }

        }
    }
}

function applySelectionJeans(selectedItem,selectedChildItem){
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
}

function controlVisibilityJeans(visibility){
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

function changebaseFabricJeans(material,base_material){
	baseMaterial = textureLoader.load(baseUrl+material.base);
	LightMapIntensity = parseFloat(base_material.light_map_intensity);
	updateStitchMaterial();
	for(var i=0; i<arrLoadedObj.length; i++) {
		if(arrLoadedObj[i].fbx.material_type == 0){
			arrLoadedObj[i].object.traverse( function( node ) {
				if ( node.isMesh ) {
					node.material.map = baseMaterial;
					node.material.lightMapIntensity = LightMapIntensity;
				}
			});
		}
	}
	
	for(var i=0; i<arrLoadedObjBack.length; i++) {
		if(arrLoadedObjBack[i].fbx.material_type == 0){
			arrLoadedObjBack[i].object.traverse( function( node ) {
				if ( node.isMesh ) {
					node.material.map = baseMaterial;
					node.material.lightMapIntensity = LightMapIntensity;
				}
			});
		}
	}
}

function updateJeansMonogram(value, type) {
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
			applyJeansMonogram();
		break;
		case "text":
			customizationObj.monogram_text = value;
			applyJeansMonogram();
		break;
		case "position":
			for(var i=0; i<customizationObj.monogram_position.length; i++) {
				var item = customizationObj.monogram_position[i];
				if(item){
					if(item.id == value) {
						item.is_selected = true;
						if(shouldAnimate) {
							//selectCategory(item.position.positionX, item.position.positionY, item.position.positionZ, item.position.controlX, item.position.controlY, item.position.controlZ, item.position.zoom);
						}
					} else {
						item.is_selected = false;
					}
				}
			}
			applyJeansMonogram();
		break;
		case "save":
			applyJeansMonogram();
		break;
		default:
		break;
	}
	
}
function applyJeansMonogram() {
	var search = arrLoadedObj.filter(function (el) {
	  return el.fbx.category == "monogram";
	});

	//remove the found items
	if(search.length>0) {
		for(var i=0; i<search.length; i++) {
			scene.remove(search[i].object)
		}
	}

	//update the array
	arrLoadedObj = arrLoadedObj.filter(function (el) {
	  return el.fbx.category != "monogram";
	});


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
			getJeansMonogramPositonForPath(searchedItem.path.replace("%monogram_char%", strIndex),monogramMaterial);
		}
	}
		
}

function getJeansMonogramPositonForPath(path,material) {
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

	}, function ( error ) {
		//on error
	});
}

window.isLoadingJeansFbx = isLoadingJeansFbx;

window.jeansInit = jeansInit;
window.selectJeansCustomizationItem = selectJeansCustomizationItem;
window.resetSelectionJeans = resetSelectionJeans;
window.applySelectionJeans = applySelectionJeans;
window.controlVisibilityJeans = controlVisibilityJeans;
window.changebaseFabricJeans = changebaseFabricJeans;
window.updateJeansMonogram = updateJeansMonogram;

