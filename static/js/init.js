var targetList = [];
var projector, mouse = { x: 0, y: 0 };

projector = new THREE.Projector();

var app_focus = 'cartography';
var cartography_tilesets = {};
var active_cartography_tileset_id = null;

var renderer_id = 'cartography_canvas';


function onDocumentMouseDown( event ) 
{
	// the following line would stop any other event handler from firing
	// (such as the mouse's TrackballControls)
	// 
	
	console.log("Click.");
	
	var canvas_width = document.getElementById(renderer_id).width;
	var canvas_height = document.getElementById(renderer_id).height;
	var $the_renderer = $('#'+renderer_id)
	var canvas_offset_x = $the_renderer.offset().left;
	var canvas_offset_y = $the_renderer.offset().top;
	var scroll_offset_x = $(window).scrollLeft();
	var scroll_offset_y = $(window).scrollTop();
	
	// update the mouse variable
	mouse.x = ( (event.clientX + scroll_offset_x - canvas_offset_x) / canvas_width ) * 2 - 1;
	mouse.y = - ( (event.clientY + scroll_offset_y - canvas_offset_y) / canvas_height ) * 2 + 1;
	
	
	var vecOrigin = new THREE.Vector3( mouse.x, mouse.y, - 1 );
	var vecTarget = new THREE.Vector3( mouse.x, mouse.y, 1 );
	
	if (event.target.localName === 'canvas') {
		event.preventDefault();
		app_focus = 'cartography';
	} else {
		app_focus = 'document';
	}
	
	projector.unprojectVector( vecOrigin, camera );
	projector.unprojectVector( vecTarget, camera );
	vecTarget = new THREE.Vector3( vecTarget.x -vecOrigin.x, vecTarget.y -vecOrigin.y, vecTarget.z -vecOrigin.z);
	vecTarget.normalize();

	var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
	var ray = projector.pickingRay(vector, camera);
	ray.origin = vecOrigin;
	ray.direction = vecTarget;
	//var intersect = ray.intersectObjects(targetList);

	// find intersections -- TODO needs testing and work

	// create a Ray with origin at the mouse position
	//   and direction into the scene (camera direction)
	//
	
	//var ray = projector.pickingRay(vector, camera);
	var intersects = ray.intersectObjects(targetList);
	//projector.unprojectVector( vector, camera );
	//var ray = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

	// create an array containing all objects in the scene with which the ray intersects
	//var intersects = ray.intersectObjects( targetList );
	
	// if there is one (or more) intersections
	if ( intersects.length > 0 ) {
		console.log("Hit @ (" + intersects[0].point.x + ',' + intersects[0].point.y + ')');
		// change the color of the closest face.
		//intersects[ 0 ].face.color.setRGB( 0.8 * Math.random() + 0.2, 0, 0 ); 
		//intersects[ 0 ].object.geometry.colorsNeedUpdate = true;
		//TODO: do actual things with mouse click, now that we're properly clicking tiles.
		intersects[0].object.position.z = 10;
		
	}

}



document.addEventListener( 'mousedown', onDocumentMouseDown, false );
//$('canvas').attr('id', 'ztarget');
//document.getElementById('ztarget').addEventListener( 'mousedown', onDocumentMouseDown, false );


// revolutions per second
//var angularSpeed = 0.2; 
//var lastTime = 0;

//var VIEW_ANGLE = 170;
//var ASPECT = window.innerWidth / window.innerHeight;
var NEAR = 1;
var FAR = 1000;


var lastTimeMs = null;

var master = [];

master.push(function() {
	renderer.render(scene, camera);
})

// this function is executed on each animation frame
function animate(nowMs) {
	// update
	//var time = (new Date()).getTime();
	//var timeDiff = time - lastTime;
	//var angleChange = angularSpeed * timeDiff * 2 * Math.PI / 1000;
	//plane.rotation.z += angleChange;
	//lastTime = time
	
	var lastTimeMs = lastTimeMs || nowMs-1000/60;
	var deltaMs = Math.min(200, nowMs - lastTimeMs);
	lastTimeMs = nowMs;
	
	master.forEach(function(gear) {
		gear(deltaMs/1000, nowMs/1000);
	});

	// request new frame
	requestAnimationFrame(animate);
}

keypress.combo("s", function() {
	if (app_focus === 'cartography') {
		camera.position.y--;
	}
});

keypress.combo("shift s", function() {
	if (app_focus === 'cartography') {
		camera.position.y -= 10;
	}
});

keypress.combo("w", function() {
	if (app_focus === 'cartography') {
		camera.position.y++;
	}
});

keypress.combo("shift w", function() {
	if (app_focus === 'cartography') {
		camera.position.y += 10;
	}
});

keypress.combo("d", function() {
	if (app_focus === 'cartography') {
		camera.position.x++;
	}
});

keypress.combo("shift d", function() {
	if (app_focus === 'cartography') {
		camera.position.x += 10;
	}
});

keypress.combo("a", function() {
	if (app_focus === 'cartography') {
		camera.position.x--;
	}
});

keypress.combo("shift a", function() {
	if (app_focus === 'cartography') {
		camera.position.x -= 10;
	}
});

// renderer
var renderer = {};// = new THREE.WebGLRenderer();

// create and start the renderer; choose antialias setting.
if ( Detector.webgl )
	renderer = new THREE.WebGLRenderer( {antialias:true} );
else
	renderer = new THREE.CanvasRenderer(); 

var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;	
renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
renderer.domElement.id = renderer_id;

document.body.appendChild(renderer.domElement);

// camera
const CAMERA_LEFT_PADDING = 50;
const CAMERA_TOP_PADDING = 25

var CAMERA_LEFT = 0-CAMERA_LEFT_PADDING;
var CAMERA_RIGHT = SCREEN_WIDTH;
var CAMERA_TOP = 0-CAMERA_TOP_PADDING;
var CAMERA_BOTTOM = SCREEN_HEIGHT;


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
	complete: function(xhr,status) {
		if (status === 'success') {
			var data = JSON.parse(xhr.responseText);
			if (data.tilesets.length > 0) {
				var default_tileset_id = 1;
				var tilesets = [];
				var active_tileset = null;
				
				for (var i = 0; i < data.tilesets.length; i++) {
					tilesets.push(data.tilesets[i]);
					if (tilesets[i].tileset_id === default_tileset_id) {
						active_tileset = tilesets[i];
						break;
					}
				}
				if (active_tileset) {
					$.ajax({
						dataType: "json",
						url: active_tileset.location,
						data: {},
						complete: function(xhrTileset,statusTileset) {
							if (statusTileset === 'success') {
								var tileset_data = JSON.parse(xhrTileset.responseText);
								console.log('tileset_data: ' + JSON.stringify(tileset_data));
								
								cartography_tilesets[tileset_data.id] = {master: active_tileset.location, tiles: tileset_data.tiles};
								active_cartography_tileset_id = tileset_data.id;
								
								init_cartography();
							}
						}
					});
				} else {
					//TODO: load meta for all tilesets and have user make a decision
				}
			}
		}
	}
});

var init_cartography = function() {
	//texture 
	var texture = new THREE.ImageUtils.loadTexture(normalizePath("/tilesets/robots/floor.png"));
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
			targetList.push(planemesh);
		}
	}

	//toolkit initial conditions
	var toolkit_sides_x = 3;
	var toolkit_sides_y = 16;
	var toolkit_offset_padding_x = sidelength;
	var toolkit_offset_padding_y = 0;
	var toolkit_offset_x = sides_x * sidelength + toolkit_offset_padding_x;
	var toolkit_offset_y = 0;

	//Create toolkit portion of the interface
	var toolkit_tiles = Cartography.createArray(toolkit_sides_x, toolkit_sides_y);

	//planes for toolkit
	
	if (active_cartography_tileset_id != null && cartography_tilesets[active_cartography_tileset_id] !== 'undefined') {
		var active_tileset = cartography_tilesets[active_cartography_tileset_id];
		
		var x = 0;
		var y = 0;
		for (var c = 0; c < active_tileset.tiles.length; c++) {
			var the_tile = active_tileset.tiles[c];
			var plane = new THREE.PlaneGeometry(sidelength, sidelength);

			//texture
			var toolkit_texture = new THREE.ImageUtils.loadTexture(normalizePath(active_tileset.master + '/../' + the_tile.img_url));
			toolkit_texture.wrapS = THREE.RepeatWrapping; 
			toolkit_texture.wrapT = THREE.RepeatWrapping;
			var material = new THREE.MeshBasicMaterial({map: toolkit_texture, side: THREE.DoubleSide });
			
			var planemesh = new THREE.Mesh(plane, material);
			toolkit_tiles[x,y] = { plane: plane, mesh: planemesh };
			planemesh.position.x = x * sidelength + toolkit_offset_x;
			planemesh.position.y = y * sidelength + toolkit_offset_y
			planemesh.overdraw = true;
			scene.add(planemesh);
			targetList.push(planemesh);
			
			x++;
			if (x >= toolkit_sides_x) {
				x = 0;
				y++;
			}
			//TODO: Fix the fact that y can overflow off the page for tilesets larger than toolkit_sides_x * toolkit_sides_y
			//		Paging will be needed.
		}
	}

	// start animation
	animate();
}