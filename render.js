var scene, camera, renderer, controls;
var ambient, spotLight, light;
var cube;

var currentModelName;
var objectFormat = ".obj";
var materialFormat = ".mtl";
var textureFormat = ".jpg";

var highlighted = false;

function init(){
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xffffff );
	renderer = new THREE.WebGLRenderer();

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
	camera.position.set( 0, 0, 5 );

	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	controls = new THREE.OrbitControls( camera );
	controls.enablePan = false;
	controls.target.set( 0, 0, 0 );
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
	var objectsDir = "data/".concat(modelName, "/", modelName);
	var modelDir = objectsDir.concat(objectFormat);
	var materialDir = objectsDir.concat(materialFormat);
	var textureDir = objectsDir.concat(textureFormat);

	var objLoader = new THREE.OBJLoader();
	var texture = new THREE.TextureLoader().load( textureDir );
	var material = new THREE.MeshPhongMaterial( { map: texture, specular: 0xffffff, shininess: 8, flatShading: false }  );
	objLoader.load(modelDir, function (obj) {
		obj.traverse(function (child) {
			if (child instanceof THREE.Mesh) {
			child.material = material;
			}
		});
		scene.add(obj);
	});
}

function clearScene() {
	var numOfElems = scene.children.length;
	for(var i = numOfElems - 1; i > 0; i--){
		if(scene.children [ i ].name != 'camera' &&
			scene.children [ i ].name != 'ambientLight' &&
			scene.children [ i ].name != 'spotLight'){
			scene.remove(scene.children [ i ]);
		}
	}
}

init();
animate();
