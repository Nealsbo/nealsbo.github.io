var scene, camera, renderer, controls;
var ambient, spotLight, light;
var cube;

init();
animate();

function init(){
	scene = new THREE.Scene();
	renderer = new THREE.WebGLRenderer();

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
	camera.position.set( 0, 0, 3 );

	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	scene.background = new THREE.Color( 0xffffff );

	controls = new THREE.OrbitControls( camera );
	controls.target.set( 0, 0, 0 );
	controls.update();

	ambient = new THREE.AmbientLight( 0xffffff, 0.5 );

	spotLight = new THREE.SpotLight( 0xffffff, 1 );
	spotLight.position.set( 0, 10, 0);
	spotLight.angle = Math.PI / 4;
	spotLight.penumbra = 0.05;
	spotLight.decay = 2;
	spotLight.distance = 50;
	spotLight.castShadow = false;
	spotLight.shadow.mapSize.width = 512;
	spotLight.shadow.mapSize.height = 512;
	spotLight.shadow.camera.near = 2;
	spotLight.shadow.camera.far = 20;

	light = new THREE.PointLight( 0xff0000, 1, 0 );
	light.position.set( 10, 0,  0 );
	
	scene.add( ambient );
	scene.add( spotLight );
	scene.add( light );
	scene.add( camera );

	var texture = new THREE.TextureLoader().load( 'data/sphere/sphere.jpg' );
	var material = new THREE.MeshPhongMaterial( { map: texture, specular: 0xffffff, shininess: 8, flatShading: false }  );
	var geometry = new THREE.SphereGeometry( 1, 32, 32 );	
	cube = new THREE.Mesh( geometry, material );
	scene.add( cube );
	
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
