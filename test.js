import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {VRButton} from 'three/addons/webxr/VRButton.js';

let ready = false; //state of the software; do we have all textures/resources ready to render?

let main = async (view) => {
	
	//set up the canvas for THREE.js
	const canvas = document.getElementById("c");
	const renderer = new THREE.WebGLRenderer({antialias: true, canvas});
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(canvas.clientWidth, canvas.clientHeight);
	renderer.xr.enabled = true;
	renderer.xr.setReferenceSpaceType('local');
	renderer.xr.setFoveation(1.0);
	document.body.appendChild(VRButton.createButton(renderer));
	
	//set the camera up
	const fov = 45;
	const aspect = canvas.clientWidth/canvas.clientHeight;
	const near = 0.1;
	const far = 128;
	const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
	camera.position.set(0, 1.6, 0);
	
	//orbital camera controls
	const controls = new OrbitControls(camera, renderer.domElement);
	controls.enableDamping = true;
	controls.minDistance = 0.001;
	controls.maxDistance = 0.001;
	controls.maxPolarAngle = 2;
	controls.minPolarAngle = 0.86;
	controls.update();
	
	//here we go!
	const scene = new THREE.Scene();
	scene.background = new THREE.Color(0x010101);
	
	const pickableObjs = new THREE.Object3D();
	
	//setting the view
	let newView;
	
	//button linking to PIC_1
	let button1Material = new THREE.MeshPhongMaterial({emissive: 0xFFFFFF, opacity: 0.4, transparent: true});
	const button1Geometry = new THREE.SphereGeometry(1, 64, 16);
	let button1Mesh = new THREE.Mesh(button1Geometry, button1Material);
	button1Mesh.name = "PIC_1";
	pickableObjs.add(button1Mesh);
	
	//button linking to PIC_2
	let button2Material = new THREE.MeshPhongMaterial({emissive: 0xFFFFFF, opacity: 0.4, transparent: true});
	const button2Geometry = new THREE.SphereGeometry(1, 64, 16);
	let button2Mesh = new THREE.Mesh(button2Geometry, button2Material);
	button2Mesh.name = "PIC_2";
	pickableObjs.add(button2Mesh);
	
	//button linking to PIC_3
	let button3Material = new THREE.MeshPhongMaterial({emissive: 0xFFFFFF, opacity: 0.4, transparent: true});
	const button3Geometry = new THREE.SphereGeometry(1, 64, 16);
	let button3Mesh = new THREE.Mesh(button3Geometry, button3Material);
	button3Mesh.name = "PIC_3";
	pickableObjs.add(button3Mesh);
	
	scene.add(pickableObjs);
	
	//THE SPHERE
	const radius = 100;
	const widthSegments = 64;
	const heightSegments = 32;
	const sphereGeometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
	
	//loading textures
	const loadingElem = document.querySelector('#loading');
	const progressBarElem = loadingElem.querySelector('.progressbar');
	const loadManager = new THREE.LoadingManager();
	const loader = new THREE.ImageBitmapLoader(loadManager);
	loader.setOptions( { imageOrientation: 'flipY' } );
	
	const sT1 = await loader.loadAsync(view.PIC_1.img);
	const sphereTexture1 = new THREE.CanvasTexture(sT1);
	sphereTexture1.colorSpace = THREE.SRGBColorSpace;
	const sT2 = await loader.loadAsync(view.PIC_2.img);
	const sphereTexture2 = new THREE.CanvasTexture(sT2);
	sphereTexture2.colorSpace = THREE.SRGBColorSpace;
	const sT3 = await loader.loadAsync(view.PIC_3.img);
	const sphereTexture3 = new THREE.CanvasTexture(sT3);
	sphereTexture3.colorSpace = THREE.SRGBColorSpace;
	const sphereMaterial = new THREE.MeshBasicMaterial({side: THREE.BackSide, color: 0xFFFFFF, map: sphereTexture1});
	let sphereMesh;
	renderer.initTexture(sphereTexture1);
	renderer.initTexture(sphereTexture2);
	renderer.initTexture(sphereTexture3);
	loadingElem.style.display = 'none';
	sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
	sphereMesh.name = "sphere";
	sphereMesh.position.set(0,1.6,0);
	sphereMesh.scale.x = -1;//flipping the material back because THREE.Backside means we're looking from behind which means it's flipped
	scene.add(sphereMesh);
	ready = true;
	
	loadManager.onProgress = (urlOfLastItemLoaded, itemsLoaded, itemsTotal) => {
		const progress = itemsLoaded / itemsTotal;
		progressBarElem.style.transform = `scaleX(${progress})`;
	};
	
	//switch to the view of the button selected
	const teleport = (pic) => {
		switch (pic){
			case 'PIC_1':
				//if pic1 link was clicked on
				sphereMaterial.map = sphereTexture1;
				newView = view.PIC_1;
				button1Mesh.position.set(newView.PIC_1.x, newView.PIC_1.y, newView.PIC_1.z);
				button1Mesh.scale.set(newView.PIC_1.s, newView.PIC_1.s/2, newView.PIC_1.s);
				button1Mesh.visible = false;
				button2Mesh.position.set(newView.PIC_2.x, newView.PIC_2.y, newView.PIC_2.z);
				button2Mesh.scale.set(newView.PIC_2.s, newView.PIC_2.s/2, newView.PIC_2.s);
				button2Mesh.visible = true;
				button3Mesh.position.set(newView.PIC_3.x, newView.PIC_3.y, newView.PIC_3.z);
				button3Mesh.scale.set(newView.PIC_3.s, newView.PIC_3.s/2, newView.PIC_3.s);
				button3Mesh.visible = true;
				break;
			case 'PIC_2':
				//if pic2 link was clicked on
				sphereMaterial.map = sphereTexture2;
				newView = view.PIC_2;
				button1Mesh.position.set(newView.PIC_1.x, newView.PIC_1.y, newView.PIC_1.z);
				button1Mesh.scale.set(newView.PIC_1.s, newView.PIC_1.s/2, newView.PIC_1.s);
				button1Mesh.visible = true;
				button2Mesh.position.set(newView.PIC_2.x, newView.PIC_2.y, newView.PIC_2.z);
				button2Mesh.scale.set(newView.PIC_2.s, newView.PIC_2.s/2, newView.PIC_2.s);
				button2Mesh.visible = false;
				button3Mesh.position.set(newView.PIC_3.x, newView.PIC_3.y, newView.PIC_3.z);
				button3Mesh.scale.set(newView.PIC_3.s, newView.PIC_3.s/2, newView.PIC_3.s);
				button3Mesh.visible = true;
				break;
			case 'PIC_3':
				//if pic3 link was clicked on
				sphereMaterial.map = sphereTexture3;
				newView = view.PIC_3;
				button1Mesh.position.set(newView.PIC_1.x, newView.PIC_1.y, newView.PIC_1.z);
				button1Mesh.scale.set(newView.PIC_1.s, newView.PIC_1.s/2, newView.PIC_1.s);
				button1Mesh.visible = true;
				button2Mesh.position.set(newView.PIC_2.x, newView.PIC_2.y, newView.PIC_2.z);
				button2Mesh.scale.set(newView.PIC_2.s, newView.PIC_2.s/2, newView.PIC_2.s);
				button2Mesh.visible = true;
				button3Mesh.position.set(newView.PIC_3.x, newView.PIC_3.y, newView.PIC_3.z);
				button3Mesh.scale.set(newView.PIC_3.s, newView.PIC_3.s/2, newView.PIC_3.s);
				button3Mesh.visible = false;
				break;
			case 'sphere':
				//
				break;
			default:
				//
		}
	}
	
	//desktop raycaster
	class MousePickHelper extends THREE.EventDispatcher {
		constructor(scene) {
			super();
			this.raycaster = new THREE.Raycaster();
			this.selectedObject = new THREE.Object3D();
			this.pointer = new THREE.Vector2();
			
			const onPointerUp = (event) => {
				if (this.selectedObject) { 
					this.dispatchEvent({type: event.type, object: this.selectedObject});
				}
			}
			
			//window.addEventListener('pointerdown', onPointerDown);
			window.addEventListener('pointerup', onPointerUp);
		}
		reset(){
			this.selectedObject = new THREE.Object3D;
		}
		update(pickablesParent, time){
			this.reset();
			
			this.raycaster.setFromCamera(this.pointer, camera);
			
			//objects intersecting the Desktop Raycaster
			const intersections = this.raycaster.intersectObjects(pickablesParent.children);
			
			for ( let i = 0; i < intersections.length; i++ ) {
				switch (intersections[ i ].object.name){
					case 'PIC_1':
						this.selectedObject = intersections[i].object;
						intersections[i].object.material.opacity = 1;
						break;
					case 'PIC_2':
						this.selectedObject = intersections[i].object;
						intersections[i].object.material.opacity = 1;
						break;
					case 'PIC_3':
						this.selectedObject = intersections[i].object;
						intersections[i].object.material.opacity = 1;
						break;
				}
			}
		}
	}
	
	//vr raycaster
	class ControllerPickHelper extends THREE.EventDispatcher {
		constructor(scene) {
			super();
			this.raycaster = new THREE.Raycaster();
			this.controllerToObjectMap = new Map();
			this.tempMatrix = new THREE.Matrix4();
			
			const pointerGeometry = new THREE.BufferGeometry().setFromPoints([
				new THREE.Vector3(0, 0, 0),
				new THREE.Vector3(0, 0, -1),
			]);
			
			this.controllers = [];
			
			const selectListener = (event) => {
				const controller = event.target;
				const selectedObject = this.controllerToObjectMap.get(event.target);
				if (selectedObject) {
					this.dispatchEvent({type: event.type, controller, object: selectedObject});
				}
			};
			
			for ( let i = 0; i < 2; ++ i ) {
				const controller = renderer.xr.getController( i );
				controller.addEventListener('select', selectListener);
				//controller.addEventListener('selectstart', startListener);
				//controller.addEventListener('selectend', endListener);
				scene.add(controller);
				
				const line = new THREE.Line(pointerGeometry);
				line.scale.z = 100;
				controller.add(line);
				this.controllers.push({ controller, line });
				
			}
		}
		reset() {
			this.controllerToObjectMap.clear();
		}
		update(pickablesParent, time) {
			this.reset();
			
			for (const {controller, line} of this.controllers) {
				//cast a ray through the from the controller
				this.tempMatrix.identity().extractRotation(controller.matrixWorld);
				this.raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
				this.raycaster.ray.direction.set(0, 0, -1).applyMatrix4(this.tempMatrix);
				//objects intersecting the VR Raycaster
				const vrintersections = this.raycaster.intersectObjects(pickablesParent.children);
				
				for ( let i = 0; i < vrintersections.length; i++) {
					switch (vrintersections[i].object.name){
						case 'PIC_1':
							this.controllerToObjectMap.set(controller, vrintersections[i].object);
							vrintersections[i].object.material.opacity = 1;
							break;
						case 'PIC_2':
							this.controllerToObjectMap.set(controller, vrintersections[i].object);
							vrintersections[i].object.material.opacity = 1;
							break;
						case 'PIC_3':
							this.controllerToObjectMap.set(controller, vrintersections[i].object);
							vrintersections[i].object.material.opacity = 1;
							break;
					}
				}
			}
		}
	}
	
	//On Desktop click
	const DesktopPicker = new MousePickHelper(scene);
	DesktopPicker.addEventListener('pointerup', (event) => {
		//switch to the view of the button selected
		teleport(event.object.name);
	});
	
	//On VR click
	const VRPicker = new ControllerPickHelper(scene);
	VRPicker.addEventListener('select', (event) => {
		//switch to the view of the button selected
		teleport(event.object.name);
	});
	
	const onPointerMove = (event) => {
		//calculate pointer position in normalized device coordinates
		//(-1 to +1) for both components
		DesktopPicker.pointer.x = (event.clientX/canvas.clientWidth) * 2 - 1;
		DesktopPicker.pointer.y = - (event.clientY/canvas.clientHeight) * 2 + 1;
	}
	
	const onWindowResize = () => {
		camera.aspect = canvas.clientWidth/canvas.clientHeight;
		camera.updateProjectionMatrix();
		
		renderer.setSize(canvas.clientWidth, canvas.clientHeight);
	}
	
	let render = (time) => {
		time *= 0.001; //milliseconds to seconds
		
		if (ready){
			button1Mesh.material.opacity = 0.4;
			button2Mesh.material.opacity = 0.4;
			button3Mesh.material.opacity = 0.4;
			
			//update the vr raycaster and calculate objects intersecting it
			VRPicker.update(pickableObjs, time);
			
			//update the desktop raycaster and calculate the objects intersecting it
			DesktopPicker.update(pickableObjs, time);
		}
		
		renderer.render(scene, camera);
		
	}
	
	renderer.setAnimationLoop(render);
	window.addEventListener('pointermove', onPointerMove);
	window.addEventListener('resize', onWindowResize);
	teleport("PIC_1"); //teleport to the root
}

//texture view/link properties
const links = {
	"lite": {
		"PIC_1": {
			"img": "https://raw.githubusercontent.com/LearningMike/360images/main/PIC_1-min.jpg",
			"stereo": false,
			"PIC_1": {"s": 0, "x": 0, "y": -1.6, "z": 0},
			"PIC_2": {"s": 4, "x": 16.55099055399931, "y": -74.61338152995376, "z": 47.527970799803576},
			"PIC_3": {"s": 2, "x": -7.500365624785212, "y": -44.45476799258078, "z": 77.894275259613}
		},
		"PIC_2": {
			"img": "https://raw.githubusercontent.com/LearningMike/360images/main/PIC_2-min.jpg",
			"stereo": false,
			"PIC_1": {"s": 4, "x": -3.337599303613126, "y": -72.62642809294218, "z": -53.04962180213184},
			"PIC_2": {"s": 0, "x": 0, "y": -1.6, "z": 0},
			"PIC_3": {"s": 4, "x": -38.36253246210393, "y": -60.22175457229724, "z": 54.78737426933343}
		},
		"PIC_3": {
			"img": "https://raw.githubusercontent.com/LearningMike/360images/main/PIC_3-min.jpg",
			"stereo": false,
			"PIC_1": {"s": 2, "x": -32.01658952848355, "y": -43.63286582217034, "z": -71.91043745597072},
			"PIC_2": {"s": 4, "x": -7.067563684490447, "y": -59.4001501164843, "z": -67.2433766976704},
			"PIC_3": {"s": 0, "x": 0, "y": -1.6, "z": 0}
		}
	},
	"full": {
		"PIC_1": {
			"img": "https://raw.githubusercontent.com/LearningMike/360images/main/PIC_1.jpg",
			"stereo": false,
			"PIC_1": {"s": 0, "x": 0, "y": -1.6, "z": 0},
			"PIC_2": {"s": 4, "x": 16.55099055399931, "y": -74.61338152995376, "z": 47.527970799803576},
			"PIC_3": {"s": 2, "x": -7.500365624785212, "y": -44.45476799258078, "z": 77.894275259613}
		},
		"PIC_2": {
			"img": "https://raw.githubusercontent.com/LearningMike/360images/main/PIC_2.jpg",
			"stereo": false,
			"PIC_1": {"s": 4, "x": -3.337599303613126, "y": -72.62642809294218, "z": -53.04962180213184},
			"PIC_2": {"s": 0, "x": 0, "y": -1.6, "z": 0},
			"PIC_3": {"s": 4, "x": -38.36253246210393, "y": -60.22175457229724, "z": 54.78737426933343}
		},
		"PIC_3": {
			"img": "https://raw.githubusercontent.com/LearningMike/360images/main/PIC_3.jpg",
			"stereo": false,
			"PIC_1": {"s": 2, "x": -32.01658952848355, "y": -43.63286582217034, "z": -71.91043745597072},
			"PIC_2": {"s": 4, "x": -7.067563684490447, "y": -59.4001501164843, "z": -67.2433766976704},
			"PIC_3": {"s": 0, "x": 0, "y": -1.6, "z": 0}
		}
	}
};

let version = links.full;
navigator.xr.isSessionSupported('immersive-vr').then((supported) => {
	if (!supported){
		version = links.lite;
	}
}).finally(() => {
	main(version);
});