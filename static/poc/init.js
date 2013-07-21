// revolutions per second
//var angularSpeed = 0.2; 
//var lastTime = 0;

var VIEW_ANGLE = 170;
var ASPECT = window.innerWidth / window.innerHeight;
var NEAR = 1;
var FAR = 1000;

// this function is executed on each animation frame
function animate(){
	// update
	//var time = (new Date()).getTime();
	//var timeDiff = time - lastTime;
	//var angleChange = angularSpeed * timeDiff * 2 * Math.PI / 1000;
	//plane.rotation.z += angleChange;
	//lastTime = time;

	// render
	renderer.render(scene, camera);

	// request new frame
	requestAnimationFrame(function(){
		animate();
	});
}

keypress.combo("s", function() {
    camera.position.y--;
});

keypress.combo("shift s", function() {
    camera.position.y -= 10;
});

keypress.combo("w", function() {
    camera.position.y++;
});

keypress.combo("shift w", function() {
    camera.position.y += 10;
});

keypress.combo("d", function() {
    camera.position.x++;
});

keypress.combo("shift d", function() {
    camera.position.x += 10;
});

keypress.combo("a", function() {
    camera.position.x--;
});

keypress.combo("shift a", function() {
    camera.position.x -= 10;
});

// renderer
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// camera
var camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
camera.position.x = 200;
camera.position.y = 200;
camera.position.z = 25;
//camera.rotation.x = 0;// * (Math.PI / 180);

// scene
var scene = new THREE.Scene();

//texture 
var texture = new THREE.ImageUtils.loadTexture( "../tilesets/robots/floor.png" );
texture.wrapS = THREE.RepeatWrapping; 
texture.wrapT = THREE.RepeatWrapping;
var material = new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide });

var sidelength = 48;
var sides_x = 16;
var sides_y = 16;

//planes
for (var i = 0; i < sides_x; i++) {
	for (var j = 0; j < sides_y; j++) {
		// plane
		var plane = new THREE.PlaneGeometry(sidelength, sidelength);
		var planemesh = new THREE.Mesh(plane, material);
		planemesh.position.x = i*sidelength;
		planemesh.position.y = j*sidelength;
		planemesh.overdraw = true;
		scene.add(planemesh);
	}
}


// start animation
animate();