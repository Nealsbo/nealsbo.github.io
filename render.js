var scene, camera, renderer, controls;
var ambient, spotLight, light;
var cube;

var currentModelName;
var loadedModel;
var objectFormat = ".obj";
var materialFormat = ".mtl";
var textureFormat = ".jpg";

var objectsDir;
var modelDir;
var materialDir;
var textureDir;

var highlight = false;
var transparent = false;

function init(){
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xffffff );
	renderer = new THREE.WebGLRenderer();

	camera = new THREE.PerspectiveCamera( 60, window.innerWidth/window.innerHeight, 0.1, 1000 );
	camera.position.set( 0, 0, 5 );

	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	controls = new THREE.OrbitControls( camera );
	controls.enablePan = false;
	controls.target.set( 0, 0, 0 );
	controls.maxDistance = 8;
	controls.minDistance = 4;
	controls.update();

	ambient = new THREE.AmbientLight( 0xffffff, 0.5 );
	ambient.name = 'ambientLight';

	spotLight = new THREE.SpotLight( 0xffffff, 1 );
	spotLight.name = 'spotLight';
	spotLight.position.set( 0, 30, 0);
	spotLight.angle = Math.PI / 4;
	spotLight.penumbra = 0.05;
	spotLight.decay = 2;
	spotLight.distance = 75;
	spotLight.castShadow = false;
	spotLight.shadow.mapSize.width = 512;
	spotLight.shadow.mapSize.height = 512;
	spotLight.shadow.camera.near = 2;
	spotLight.shadow.camera.far = 20;

	light = new THREE.PointLight( 0xffffaa, 0.2, 0 );
	light.position.set( 10, 0,  0 );
	
	scene.add( ambient );
	scene.add( spotLight );
	scene.add( light );
	scene.add( camera );

	loadModel("cat");

	window.addEventListener( 'resize', onWindowResize, false );
};

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
	requestAnimationFrame( animate );

	renderer.render(scene, camera);
};

function loadModel(modelName){
	clearScene();
	
	currentModelName = modelName;
	objectsDir = "data/".concat(modelName, "/", modelName);
	modelDir = objectsDir.concat(objectFormat);
	materialDir = objectsDir.concat(materialFormat);
	textureDir = objectsDir.concat(textureFormat);

	var objLoader = new THREE.OBJLoader();
	var texture = new THREE.TextureLoader().load( textureDir );
	var material = new THREE.MeshPhongMaterial( { map: texture, specular: 0xffffff, shininess: 8, flatShading: false }  );
	objLoader.load(modelDir, function (obj) {
		obj.traverse(function (child) {
			if (child instanceof THREE.Mesh) {
				child.material = material;
				child.material.transparent = true;
				loadedModel = child;
			}
		});
		scene.add(obj);
	});
}

function clearScene() {
	loadedModel = null;
	var numOfElems = scene.children.length;
	for(var i = numOfElems - 1; i > 0; i--){
		if(scene.children [ i ].name != 'camera' &&
			scene.children [ i ].name != 'ambientLight' &&
			scene.children [ i ].name != 'spotLight'){
			scene.remove(scene.children [ i ]);
		}
	}
}

function transparentModel(){
	if(transparent === false){
		transparent = true;
		loadedModel.material.opacity = 0.5;
	} else {
		transparent = false;
		loadedModel.material.opacity = 1;
	}
	console.log("transparent foo - " + transparent);
}

function highlightModel(){
	if(highlight === false){
		highlight = true;
		loadedModel.material.emissive.setHex(0xFF0000);
	} else {
		highlight = false;
		loadedModel.material.emissive.setHex(0x000000);
	}
	console.log("highlight foo - " + highlight);
}

init();
animate();
