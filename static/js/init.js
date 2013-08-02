// revolutions per second
//var angularSpeed = 0.2; 
//var lastTime = 0;

//var VIEW_ANGLE = 170;
//var ASPECT = window.innerWidth / window.innerHeight;
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
const CAMERA_LEFT_PADDING = 50;
const CAMERA_TOP_PADDING = 25

var CAMERA_LEFT = 0-CAMERA_LEFT_PADDING;
var CAMERA_RIGHT = window.innerWidth;
var CAMERA_TOP = 0-CAMERA_TOP_PADDING;
var CAMERA_BOTTOM = window.innerHeight;


var camera = new THREE.OrthographicCamera(CAMERA_LEFT, CAMERA_RIGHT, CAMERA_TOP, CAMERA_BOTTOM, -NEAR, FAR);

camera.position.z = 0;//25;
//camera.rotation.x = 0;// * (Math.PI / 180);

// scene
var scene = new THREE.Scene();

// get data from tilesets
// Two steps, can be done in parallel:
// 1.) Get available local tileset data.
// 2.) Get user's active tileset.

//console.log('test1');
/*
$.getJSON('/tilesets/tilesets.json', function(data) {
	console.log('test');
	console.log(data.toString());
}).done(function(data) {
	console.log('test3');
})*/
$.ajax({
	dataType: "json",
	url: '/tilesets/tilesets.json',
	data: {},
	complete: function(jqXHR,textStatus) {
	console.log({"a" : jqXHR , "b" : textStatus}); 
}
});
//texture 
var texture = new THREE.ImageUtils.loadTexture( "/tilesets/robots/floor.png" );
texture.wrapS = THREE.RepeatWrapping; 
texture.wrapT = THREE.RepeatWrapping;
var material = new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide });


//global initial conditions
var sidelength = 48;

//map initial conditions
var sides_x = 16;
var sides_y = 16;

//Create map potion of the interface
var map_tiles = Cartography.createArray(sides_x, sides_y);

//planes for map
for (var i = 0; i < sides_x; i++) {
	for (var j = 0; j < sides_y; j++) {
		var plane = new THREE.PlaneGeometry(sidelength, sidelength);
		var planemesh = new THREE.Mesh(plane, material);
		map_tiles[i,j] = { plane: plane, mesh: planemesh };
		planemesh.position.x = i*sidelength;
		planemesh.position.y = j*sidelength;
		planemesh.overdraw = true;
		scene.add(planemesh);
	}
}

//toolkit initial conditions
var toolkit_sides_x = 3;
var toolkit_sides_y = 16;
var toolkit_offset_padding_x = sidelength;
var toolkit_offset_padding_y = 0;
var toolkit_offset_x = sides_x * sidelength + toolkit_offset_padding_x;
var toolkit_offset_y = 0;//sides_y * sidelength + toolkit_offset_padding_y;

//Create toolkit portion of the interface
var toolkit_tiles = Cartography.createArray(toolkit_sides_x, toolkit_sides_y);

//planes for toolkit
for (var i = 0; i < toolkit_sides_x; i++) {
	for (var j = 0; j < toolkit_sides_y; j++) {
		var plane = new THREE.PlaneGeometry(sidelength, sidelength);
		var planemesh = new THREE.Mesh(plane, material);
		toolkit_tiles[i,j] = { plane: plane, mesh: planemesh };
		planemesh.position.x =  i * sidelength + toolkit_offset_x;
		planemesh.position.y = j * sidelength + toolkit_offset_y
		planemesh.overdraw = true;
		scene.add(planemesh);
	}
}

// start animation
animate();