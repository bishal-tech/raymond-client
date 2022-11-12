import * as THREE from './threejs/build/three.module.js';
import { FBXLoader } from './threejs/examples/jsm/loaders/FBXLoader.js';


var baseMaterial;
var stichMaterial;
var buttonMaterial;
var buttonLightMapMaterial;
var monogramLightMapMaterial;
var shirtLightMapMaterialLight;
var shirtLightMapMaterialDark;
var buttonHoleMaterial;
var buttonStichMaterial;
var collarPocketShadowMaterial;
var baseUrl = "";
var customizationObj;
var arrLoadedObj = [];
var objFullBodyNode = {};
var isTuckOut = true;
var scene;
var currentParent;
var isLoadingFbx = false;
var cuffObjcet;
var cuffObjectIndex = -1;
var bottomType = "round"; // round, straight
var monogramMaterialPath = "";
var monogramMaterial;
var monogramPostion;
var arrMonogramPosition;
var selectedStyleMaterial = {};
var rayCasterObjects = [];
var arrFullBodyObj = [];
var arrFullBodyModelObj = [];
var bodyType;
var isDarkLightMap = false;
var buttonLightMapIntensity = 0.6;
var shirtLightMapIntensity = 0.6;
var productWishListCustomization = null;
var isCasual = false;

export function shirtInit(obj, wishListCustomization, threeJsScene, customizationUrl, modelBodyType, isSimilarItem) {
	// console.log(obj.list_item);
	if(customizationUrl.includes("Casual")) {
		isCasual = true;
		obj.monogram_position = obj.monogram_position_casual
	} else {
		isCasual = false;

	}
	if(obj.base_material.light_map_type) {
		isDarkLightMap = obj.base_material.light_map_type == 'dark' ? true : false;	
	}

	if(obj.base_material.button_light_map_intensity) {
		buttonLightMapIntensity = parseFloat(obj.base_material.button_light_map_intensity);	
	}

	if(obj.base_material.light_map_intensity) {
		shirtLightMapIntensity = parseFloat(obj.base_material.light_map_intensity);	
	}
	
	cuffObjcet = null;
	cuffObjectIndex = -1;
	baseUrl = customizationUrl;
	customizationObj = obj;
	bodyType = modelBodyType;
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

	// console.log(customizationObj.list_item);

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

	scene = threeJsScene;

	var textureLoader = new THREE.TextureLoader();

	baseMaterial = textureLoader.load(baseUrl+customizationObj.material.base);
	baseMaterial.wrapS = baseMaterial.wrapT = THREE.RepeatWrapping;
	baseMaterial.offset.set(0,0);
	baseMaterial.repeat.set(20,20);

	stichMaterial = textureLoader.load(baseUrl+customizationObj.material.stich);
	stichMaterial.wrapS = stichMaterial.wrapT = THREE.RepeatWrapping;
	buttonMaterial = textureLoader.load(baseUrl+customizationObj.material.button);
	buttonMaterial.wrapS = buttonMaterial.wrapT = THREE.RepeatWrapping;
	buttonHoleMaterial = textureLoader.load(baseUrl+customizationObj.material.button_hole);
	buttonHoleMaterial.wrapS = buttonHoleMaterial.wrapT = THREE.RepeatWrapping;
	buttonStichMaterial = textureLoader.load(baseUrl+customizationObj.material.button_stich);
	buttonStichMaterial.wrapS = buttonStichMaterial.wrapT = THREE.RepeatWrapping;
	buttonLightMapMaterial = textureLoader.load(baseUrl+'texture/buttonlightmap.jpg');
	monogramLightMapMaterial = textureLoader.load(baseUrl+'texture/buttonlightmap.jpg');
	shirtLightMapMaterialDark = textureLoader.load(baseUrl+'texture/shirtlightmapdark.jpg');
	shirtLightMapMaterialLight = textureLoader.load(baseUrl+'texture/shirtlightmaplight.jpg');
	collarPocketShadowMaterial = textureLoader.load(baseUrl+'texture/collarpocketshadowmap.png');
	collarPocketShadowMaterial.wrapS = collarPocketShadowMaterial.wrapT = THREE.RepeatWrapping;
 
	arrLoadedObj = [];
	var timer;
	var isCommonItemLoaded = false;
	var isListItemLoaded = false;
	if(!bodyType || bodyType == "") {
		loadFBX(1, customizationObj.common_item[0], customizationObj.common_item, function(){
			//Common Item Loaded
			isCommonItemLoaded = true;
			if(isListItemLoaded) {
				hideloader();
			}
		});
		traverseListItem(customizationObj.list_item, function() {
			//list item loaded
			clearInterval(timer);
			timer = setTimeout(x => {
				if(!isLoadingFbx) {
					isListItemLoaded = true;
					if(isCommonItemLoaded) {
						hideloader();
					}
				}
		    }, 3000);
		});
	} else {
		if(!isSimilarItem) {
			loadFullBodyFbx();
			loadFullCustomizationBodyFbx();
		} else {
			hideUnhideNode();
		}
	}

	if(wishListCustomization && (!bodyType || bodyType == "")) {
		//monogram
		if(wishListCustomization.monogram) {
			updateMonogramFromValue({"id": wishListCustomization.monogram.material}, "texture", false);
			updateMonogramFromValue(wishListCustomization.monogram.position, "position", false);
			updateMonogramFromValue(wishListCustomization.monogram.text, "text", false);
			updateMonogramFromValue("", "save");
		}
	}

	// console.log(customizationObj.list_item);
}

function loadFullBodyFbx() {
	for(var i=0;i<arrFullBodyModelObj.length;i++) {
		scene.remove(arrFullBodyModelObj[i]);
	}
	arrFullBodyModelObj = [];
	// if(arrFullBodyModelObj.length>0){
	// 	return;
	// }
	
	var loader = new FBXLoader();
	var urlWithoutFolder = baseUrl.substring(0, baseUrl.lastIndexOf('/'));
	urlWithoutFolder = urlWithoutFolder.substring(0, urlWithoutFolder.lastIndexOf('/'));
	loader.load(  urlWithoutFolder + "/body/" + bodyType + "/body.fbx", function ( object ) {
		object.traverse( function( node ) {
			if ( node.isMesh ) {
				if(node.material) {
					var material = new THREE.MeshPhongMaterial({
                		side: THREE.DoubleSide
            		});
					// console.log(node.name)
					// node.material.color.setStyle("#"+localStorage.getItem('avatar-color'));
					var textureLoader = new THREE.TextureLoader();
					
					if(node.name.includes('face') || node.name.includes('Face')) {
						var faceMaterial = textureLoader.load(urlWithoutFolder + "/body/texture/"+localStorage.getItem('avatar-color')+"_Face.jpg");
						faceMaterial.wrapS = faceMaterial.wrapT = THREE.RepeatWrapping;
						material.map = faceMaterial;
						// console.log("--Face Node Name--"+node.name+"---");

					} else {
						var bodyMaterial = textureLoader.load(urlWithoutFolder + "/body/texture/"+localStorage.getItem('avatar-color')+"_body.jpg");
						bodyMaterial.wrapS = bodyMaterial.wrapT = THREE.RepeatWrapping;
						material.map = bodyMaterial;
						// console.log("--Body Node Name--"+node.name+"---");
					}

					material.shininess = 10;
					material.lightMap = buttonLightMapMaterial;
					material.lightMapIntensity = buttonLightMapIntensity;
					node.material = material;
				}
			}
		});
		scene.add( object );
		arrFullBodyModelObj.push(object);
		hideloaderFullBody();
	}, function ( progress ) {
	}, function ( error ) {
	});
	loader.load(  urlWithoutFolder + "/body/" + bodyType + "/shoe.fbx", function ( object ) {
		object.traverse( function( node ) {
			if ( node.isMesh ) {
				if(node.material) {	
					var textureLoader = new THREE.TextureLoader();
					var material = new THREE.MeshPhongMaterial({
                		side: THREE.DoubleSide
            		});
					material.map = textureLoader.load(urlWithoutFolder + "/body/texture/formal_shoe_texture.jpg");
					material.shininess = 10;
					material.lightMap = buttonLightMapMaterial;
					material.lightMapIntensity = buttonLightMapIntensity;
					node.material = material;
				}
			}
		});
		scene.add( object );
		arrFullBodyModelObj.push(object);
		hideloaderFullBody();
	}, function ( progress ) {
	}, function ( error ) {
	});

	loader.load(  urlWithoutFolder + "/body/Common_light.fbx", function ( object ) {
		object.traverse( function( node ) {
			if ( node.isMesh ) {
				if(node.material) {
					var material = new THREE.MeshPhongMaterial({
                		side: THREE.DoubleSide
            		});
					material.shininess = 10;
					material.lightMap = buttonLightMapMaterial;
					material.lightMapIntensity = buttonLightMapIntensity;
					node.material = material;
				}
			}
		});
		scene.add( object );
		arrFullBodyModelObj.push(object);
		hideloaderFullBody();
	}, function ( progress ) {
	}, function ( error ) {
	});

	//Update Full Body Monogram
	if(productWishListCustomization) {
		//monogram
		if(productWishListCustomization.monogram && productWishListCustomization.monogram.position && productWishListCustomization.monogram.position != "none" && productWishListCustomization.monogram.text && productWishListCustomization.monogram.text != "") {
			// updateMonogramFromValue({"id": wishListCustomization.monogram.material}, "texture", false);
			// updateMonogramFromValue(wishListCustomization.monogram.position, "position", false);
			// updateMonogramFromValue(wishListCustomization.monogram.text, "text", false);
			var fullBodyMonogramMaterail;
			var firstItemName = "";
			var secondItemName = "";
			var thirdItemName = "";

			for (var i = 0; i < productWishListCustomization.monogram.text.length; i++) {
				var char = productWishListCustomization.monogram.text.charAt(i);
				switch(i) {
					case 0:
						firstItemName = char.toUpperCase() + "_first_position_" + productWishListCustomization.monogram.position;
					break;
					case 1:
						secondItemName = char.toUpperCase() + "_second_position_" + productWishListCustomization.monogram.position;	
					break;
					case 2:
						thirdItemName = char.toUpperCase() + "_third_position_" + productWishListCustomization.monogram.position;
					break;
					default:
					break;
				}
				
			}
			console.log(productWishListCustomization.monogram.text);
			console.log(firstItemName);
			console.log(secondItemName);
			console.log(thirdItemName);


			for(var i=0; i<customizationObj.monogram_material.length; i++) {
				var item = customizationObj.monogram_material[i];
				if(item){
					if(item.id == productWishListCustomization.monogram.material) {
						var monogramMaterialLoader = new THREE.TextureLoader();
						monogramMaterialLoader.load(
							// resource URL
							baseUrl+item.path,

							// onLoad callback
							function ( texture ) {
								fullBodyMonogramMaterail = texture;
								fullBodyMonogramMaterail.wrapS = fullBodyMonogramMaterail.wrapT = THREE.RepeatWrapping;
								loader.load(  urlWithoutFolder + "/body/" + bodyType + "/monogram.fbx", function ( object ) {
									object.traverse( function( node ) {
										if ( node.isMesh ) {
											if(node.material) {	
												// console.log(node.name);
												if(node.name == firstItemName || node.name == secondItemName || node.name == thirdItemName) {
													node.visible = true;
												} else {
													node.visible = false;
												}
												node.material = new THREE.MeshPhongMaterial({
													map: fullBodyMonogramMaterail,
													side: THREE.DoubleSide,
													shininess: 10,
													lightMap: buttonLightMapMaterial,
													lightMapIntensity: buttonLightMapIntensity
												});
											}
										}
									});
									scene.add( object );
									arrFullBodyModelObj.push(object);
								}, function ( progress ) {
								}, function ( error ) {
								});
							},
							undefined,
							function ( err ) {
								console.log(err);
								console.error( 'An error happened.' );
							}
						);

					}
				}
				
			}

		}
	}
}



function hideUnhideNode() {
	console.log("Shirt Hide Unhide");
	function loadMaterial(node, item) {
		var textureLoader = new THREE.TextureLoader();
		var newMaterial = baseMaterial;
		if(item.material != "-1") {
			newMaterial = textureLoader.load(baseUrl+item.material);
			newMaterial.wrapS = newMaterial.wrapT = THREE.RepeatWrapping;
			newMaterial.offset.set(0,0);
			newMaterial.repeat.set(20,20);
			
			node.material = new THREE.MeshPhongMaterial({
					map: newMaterial,
					shininess: 10,
					lightMap: isDarkLightMap ? shirtLightMapMaterialDark : shirtLightMapMaterialLight,
					lightMapIntensity: shirtLightMapIntensity,
				});
			node.material.side = THREE.DoubleSide;
		}
	}

	function setupMaterial(node, materialType) {
		var material = new THREE.MeshPhongMaterial({
                side: THREE.DoubleSide
            });
		material.uuid = makeid(10);
		switch(materialType) {
			case "0": //base
				// node.material.map = baseMaterial
				node.material = new THREE.MeshPhongMaterial({
					map: baseMaterial,
					shininess: 10,
					lightMap: isDarkLightMap ? shirtLightMapMaterialDark : shirtLightMapMaterialLight,
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
				node.material = new THREE.MeshPhongMaterial({
					map: collarPocketShadowMaterial,
					transparent: true,
					opacity: 0.5
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

	function getCommonItem(arrItems) {
		for(var i=0;i<arrItems.length;i++) {
			var selectedNode;
			if (typeof arrItems[i].name === 'string' || arrItems[i].name instanceof String) {
				selectedNode = objFullBodyNode[arrItems[i].name];
			} else {
				if(isTuckOut) {
					selectedNode = objFullBodyNode[arrItems[i].name.tuck_out];
				} else {
					selectedNode = objFullBodyNode[arrItems[i].name.tuck_in];
				}
			}

			if(selectedNode) {
				selectedNode.visible = true;
				selectedNode.material.side = THREE.DoubleSide;
				setupMaterial(selectedNode, arrItems[i].material_type);
			}
		}
	}


	function getItem(arrItems) {
		for(var i=0;i<arrItems.length;i++) {
			if(arrItems[i].is_selected && arrItems[i].fbx && arrItems[i].fbx.length>0) {
				if(arrItems[i].fbx && arrItems[i].fbx.length>0) {
					for(var j=0;j<arrItems[i].fbx.length;j++) {
						var selectedNode;
						if (typeof arrItems[i].fbx[j].name === 'string' || arrItems[i].fbx[j].name instanceof String) {
							selectedNode = objFullBodyNode[arrItems[i].fbx[j].name];
						} else {
							if(isTuckOut) {
								if(arrItems[i].fbx[j].name.tuck_out.includes("round")) {
									if(bottomType == "round") {
										selectedNode = objFullBodyNode[arrItems[i].fbx[j].name.tuck_out];
									}
								} else if(arrItems[i].fbx[j].name.tuck_out.includes("straight")) {
									if(bottomType == "straight") {
										selectedNode = objFullBodyNode[arrItems[i].fbx[j].name.tuck_out];
									}
								} else {
									selectedNode = objFullBodyNode[arrItems[i].fbx[j].name.tuck_out];
								}
							} else {
								selectedNode = objFullBodyNode[arrItems[i].fbx[j].name.tuck_in];
							}
						}

						if(selectedNode) {
							selectedNode.visible = true;
							selectedNode.material.side = THREE.DoubleSide;
							setupMaterial(selectedNode, arrItems[i].fbx[j].material_type);
							switch(arrItems[i].fbx[j].sub_category) {
								case "collar_inside":
									if(selectedStyleMaterial["collar_inside"]) {
										loadMaterial(selectedNode, selectedStyleMaterial["collar_inside"])
									}
								break;
								case "cuff_inside":
									if(selectedStyleMaterial["cuff_inside"]) {
										loadMaterial(selectedNode, selectedStyleMaterial["cuff_inside"])
									}
								break;
								case "placket_inside":
									if(selectedStyleMaterial["placket_inside"]) {
										loadMaterial(selectedNode, selectedStyleMaterial["placket_inside"])
									}
								break;
								default:
								break;
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
	console.log("Shirt Hide Unhide End");
	hideloaderFullBody();
}

function loadFullCustomizationBodyFbx() {
	
	for(var i=0;i<arrFullBodyObj.length;i++) {
		scene.remove(arrFullBodyObj[i]);
	}
	arrFullBodyObj = [];

	var loader = new FBXLoader();
	rayCasterObjects = [];
	isTuckOut = true;
	isLoadingFbx = true;
	loader.load( baseUrl +"full/" +bodyType + "/full.fbx", function ( object ) {
		//onload
		isLoadingFbx = false;
		objFullBodyNode = {};
		object.traverse( function( node ) {
			if ( node.isMesh ) {
				node.visible = false;
				rayCasterObjects.push(node);
				// console.log(node.name);
				objFullBodyNode[node.name] = node;
				// console.log(Object.keys(objFullBodyNode).length);
				if(Object.keys(objFullBodyNode).length == 205) {
					hideUnhideNode();
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
	function loadMaterial(node, item) {
		var textureLoader = new THREE.TextureLoader();
		var newMaterial = baseMaterial;
		if(item.material != "-1") {
			newMaterial = textureLoader.load(baseUrl+item.material);
			newMaterial.offset.set(0,0);
			newMaterial.repeat.set(20,20);
			newMaterial.wrapS = newMaterial.wrapT = THREE.RepeatWrapping;
			node.material.map = newMaterial	
		}
	}
	function setupMaterial(node, materialType) {
		switch(materialType) {
			case "0": //base
				// node.material.map = baseMaterial
				node.material = new THREE.MeshPhongMaterial({
					map: baseMaterial,
					shininess: 10,
					lightMap: isDarkLightMap ? shirtLightMapMaterialDark : shirtLightMapMaterialLight,
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
				node.material = new THREE.MeshPhongMaterial({
					map: collarPocketShadowMaterial,
					transparent: true,
					opacity: 0.5
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
	loader.load( baseUrl + customizationObjItem.path, function ( object ) {
		//onload
		isLoadingFbx = false;
		object.traverse( function( node ) {
			if ( node.isMesh ) {
				if( node.material ) {
					node.material.side = THREE.DoubleSide;
					setupMaterial(node, customizationObjItem.material_type);
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
						case "placket_inside":
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
		arrLoadedObj.push({"fbx": customizationObjItem, "object": object});
		scene.add( object );
		if(nextIndex<arrItems.length) {
			loadFBX(nextIndex+1, arrItems[nextIndex], arrItems, callBack);
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

function selectShirtCustomizationItem(item) {
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
			newMaterial.repeat.set(20,20);
			
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


function getMonogramPositonForPath(path, x, y , z) {
	var loader = new FBXLoader();
	loader.load( baseUrl + path, function ( object ) {
		//onload
		object.traverse( function( node ) {
			if ( node.isMesh ) {
				if( node.material ) {
					node.material = new THREE.MeshPhongMaterial({
						map: monogramMaterial,
						side: THREE.DoubleSide,
						shininess: 10,
						lightMap: buttonLightMapMaterial,
						lightMapIntensity: buttonLightMapIntensity
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
		break;
		case "text":
			customizationObj.monogram_text = value;
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

		//create material
		var monogramMaterialLoader = new THREE.TextureLoader();
		monogramMaterialPath = searchTexture[0].path;
		monogramMaterialLoader.load(
			// resource URL
			baseUrl+monogramMaterialPath,

			// onLoad callback
			function ( texture ) {
				monogramMaterial = texture;
				monogramMaterial.wrapS = monogramMaterial.wrapT = THREE.RepeatWrapping;
				//create monogram fbx
				for (var i = 0; i < customizationObj.monogram_text.length; i++) {
					var char = customizationObj.monogram_text.charAt(i);
					var searchedItem = searchPosition[0];
					var strIndex = (i+1).toString();
					getMonogramPositonForPath(searchedItem.path.replace("%monogram_char%", char.toUpperCase()), searchedItem['x'+strIndex], searchedItem['y'+strIndex], searchedItem['z'+strIndex]);
				}
			},
			undefined,
			function ( err ) {
				console.log(err);
				console.error( 'An error happened.' );
			}
		);
	}
		
}

export function tuckInTuckOut() {
	isTuckOut = !isTuckOut;
	Object.keys(objFullBodyNode).forEach(function(key,index) {
		objFullBodyNode[key].visible = false;
	});
	hideUnhideNode();
}


export function isLoadingShirtFbx() {
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


export function getShirtRayCasterObject() {
	return rayCasterObjects;
}
window.getShirtRayCasterObject = getShirtRayCasterObject;
window.isLoadingShirtFbx = isLoadingShirtFbx;
window.updateShirtMonogram = updateShirtMonogram;
window.shirtInit = shirtInit;
window.selectShirtCustomizationItem = selectShirtCustomizationItem;
window.tuckInTuckOut = tuckInTuckOut
