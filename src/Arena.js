
// depends on HBObject.js

var MAP_WIDTH;
var MAP_HEIGHT;
var MAP_MAXDIM;

// the distance map stores the distance to the coast for each pixel in it
// (positive in water and negative on land)
// used for collision detection with the coast and to see where objects
// can spawn randomly
var DISTANCE_MAP = {};
var FOG_COLOR = new THREE.Color(0x808080);

var terrainVertexShader = `

	varying vec3 nml;
	varying vec3 pos;
	varying vec3 cam;

	void main() {
		pos = position;
		nml = normal;
		cam = cameraPosition;

		gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
	}`;

// fragment shader using precomputed normal map with specular information in alpha channel
var terrainFragmentShader = `

	uniform vec3 lightvec;
	uniform vec2 terraindims;
	varying vec3 nml;
	varying vec3 pos;
	varying vec3 cam;
	uniform sampler2D diftex;
	uniform sampler2D nmlspectex;
	uniform vec3 fogColor;
	uniform sampler2D heighttex;
	uniform vec3 waterColor;

	void main()	{

		vec3 light = normalize(lightvec); // direction TOWARDS light
		vec3 n = normalize(nml);

		vec2 uv;
		uv.x = pos.x/terraindims.x+0.5;
		uv.y = pos.y/terraindims.y+0.5;

		// fog at terrain edge:
		float wFog = 0.0;
		if( uv.x > 0.8 ){ wFog = (uv.x-0.8)/0.2; }
		if( uv.x < 0.2 ){ wFog = 1.0-uv.x/0.2; }
		if( uv.y > 0.8 ){ wFog+= (uv.y-0.8)/0.2; }
		if( uv.y < 0.2 ){ wFog+= 1.0-uv.y/0.2; }
		if( wFog > 1.0 ){ wFog = 1.0; }
	
		// fog under water:
		vec4 hmap = texture2D(heighttex, uv);
		float h = hmap.x*256.0 + hmap.y + hmap.z/256.0 - 127.5; // from abt. -4.7 to 4.7, water level at 0
		float wTurbid = 0.0;
		if(h<0.0){wTurbid = h/-3.0;}
		if(wTurbid>1.0){wTurbid=1.0;}

		// determine new normal from bump map:

		vec4 nmlspec = texture2D( nmlspectex, uv );
		vec3 texnml = nmlspec.xyz*2.0-1.0;

		// determine specularity:
		vec3 view = pos-cam;
		vec3 reflectedView = normalize(view - 2.0*dot(view, texnml)*texnml);
		float wSpecular = dot(reflectedView, light);
		float specStart = 0.96;
		float specFull = 0.98;
		if(wSpecular<specStart){wSpecular = 0.0;}
		else if(wSpecular>specFull){wSpecular = 1.0;}
		else{wSpecular = 0.5-0.5*cos((wSpecular-specStart)/(specFull-specStart)*3.1416);}
		wSpecular *= nmlspec.w;

		// mix colors:
		float wDif = dot(texnml, light)*0.5+0.5;
		vec4 cDif = texture2D( diftex, uv );
		cDif.xyz *= wDif; // diffuse color
		
		vec4 cDifSpec = wSpecular*vec4(1.0,1.0,1.0,1.0) + (1.0-wSpecular)*cDif;

		vec4 cDifSpecFog = wFog*vec4(fogColor,1.0) + wTurbid*vec4(waterColor,1.0) + (1.0-wFog-wTurbid)*cDifSpec;

		gl_FragColor = cDifSpecFog;

	}`;

var terrainNormalComputationShader = `

	uniform sampler2D heighttex;
	uniform float heighttexdim;
	uniform sampler2D bumptex;
	uniform float bumptexdim;
	uniform sampler2D spectex;
	uniform float terraindim;

	void main() {
		vec2 cellSize = 1.0 / resolution.xy;
		vec2 uv = gl_FragCoord.xy * cellSize;

		float dhm = 8.0/heighttexdim;
		float dbm = 0.01/bumptexdim;

		vec4 buf = texture2D( heighttex, vec2(uv.x+dhm, uv.y) );
		float hE = buf.x*256.0 + buf.y + buf.z/256.0; // east neighbor pixel
		buf = texture2D( heighttex, vec2(uv.x-dhm, uv.y) );
		float hW = buf.x*256.0 + buf.y + buf.z/256.0; // west neighbor pixel
		buf = texture2D( heighttex, vec2(uv.x, uv.y+dhm) );
		float hN = buf.x*256.0 + buf.y + buf.z/256.0; // north neighbor pixel
		buf = texture2D( heighttex, vec2(uv.x, uv.y-dhm) );
		float hS = buf.x*256.0 + buf.y + buf.z/256.0; // south neighbor pixel

		vec3 hnml = normalize(vec3(
			-(hE-hW)/(2.0*dhm*terraindim),
			-(hN-hS)/(2.0*dhm*terraindim), // no minus cause image was flipped somewhere
			1.0));

		vec3 tangx = normalize(cross(vec3(0.0,1.0,0.0), hnml)); // tangent vectors along terrain surface (not orthogonal)
		vec3 tangy = normalize(cross(hnml, vec3(1.0,0.0,0.0)));

		vec3 tangx2 = normalize(cross(tangy, hnml));
		vec3 tangy2 = normalize(cross(hnml, tangx));

		// those should be orthogonal:
		vec3 tangx3 = normalize(tangx + tangx2);
		vec3 tangy3 = normalize(tangy + tangy2);

		buf = texture2D( bumptex, vec2(uv.x+dbm, uv.y) );
		hE = buf.x; // east neighbor pixel
		buf = texture2D( bumptex, vec2(uv.x-dbm, uv.y) );
		hW = buf.x; // west neighbor pixel
		buf = texture2D( bumptex, vec2(uv.x, uv.y+dbm) );
		hN = buf.x; // north neighbor pixel
		buf = texture2D( bumptex, vec2(uv.x, uv.y-dbm) );
		hS = buf.x; // south neighbor pixel

		vec3 bnml = normalize(vec3(
			-(hE-hW)/(2.0*dbm*terraindim),
			-(hN-hS)/(2.0*dbm*terraindim), // no minus cause image was flipped somewhere
			1.0));

		vec3 combinednml = normalize(hnml + bnml.x*tangx3 + bnml.y*tangy3);

		float spec = texture2D( spectex, uv ).x;

		gl_FragColor = vec4(combinednml*0.5+0.5, spec);
	}`;

// returns the distance from the coast (bilinear interpolation on distance map)
function coastDistance(x,y){ // map center at (0,0)
	var xhr = DISTANCE_MAP.w/2 + x*DISTANCE_MAP.f -0.5; // high resolution
	var yhr = DISTANCE_MAP.h/2 - y*DISTANCE_MAP.f -0.5;

	if(xhr<0){xhr = 0;}
	if(xhr>DISTANCE_MAP.w-1.00001){xhr = DISTANCE_MAP.w-1.00001;}
	if(yhr<0){yhr = 0;}
	if(yhr>DISTANCE_MAP.h-1.00001){yhr = DISTANCE_MAP.h-1.00001;}

	var xint = Math.floor(xhr); // round part
	var yint = Math.floor(yhr);
	var xfrc = xhr - xint; // fraction
	var yfrc = yhr - yint;

	var d1 = DISTANCE_MAP.map[ yint   *DISTANCE_MAP.w+xint] * (1-xfrc) + DISTANCE_MAP.map[ yint   *DISTANCE_MAP.w+xint+1] * xfrc;
	var d2 = DISTANCE_MAP.map[(yint+1)*DISTANCE_MAP.w+xint] * (1-xfrc) + DISTANCE_MAP.map[(yint+1)*DISTANCE_MAP.w+xint+1] * xfrc;

	return ((1-yfrc)*d1 + yfrc*d2)/DISTANCE_MAP.f;
}

function findAccessiblePosition(minCoastDistance){

	var x=0;
	var y=0;
	var found = false;

	while(!found){ // could in a very unlikely scenario run forever...
		x = (Math.random()-0.5)*MAP_WIDTH;
		y = (Math.random()-0.5)*MAP_HEIGHT;
		if(coastDistance(x,y) >= minCoastDistance){
			found = true;
		}
	}

	return new THREE.Vector2(x,y);
}

function Arena(filename){
	HBObject.call(this); // inheritance

	this.type = 'arena';

	// load SVG for contour

	LOADING_LIST.addItem('arena');
	var loader = new THREE.FileLoader();

	loader.load(filename, function(text){ // to be executed when the svg is loaded:

		var draw = SVG('arenadrawing');
		var store = draw.svg(text);

		var points = store.get('outline').node.points;
		var arenaPolygons = new Array(1);
		arenaPolygons[0] = new Array(points.length);

		MAP_WIDTH = store.get('acedroidsarena').node.width.baseVal.value;
		MAP_HEIGHT = store.get('acedroidsarena').node.height.baseVal.value;
		
		MAP_MAXDIM = MAP_WIDTH;
		if(MAP_HEIGHT>MAP_WIDTH){MAP_MAXDIM = MAP_HEIGHT;}

		BROADPHASE.xmin = -MAP_WIDTH/2;
		BROADPHASE.xmax = MAP_WIDTH/2;
		BROADPHASE.ymin = -MAP_HEIGHT/2;
		BROADPHASE.ymax = MAP_HEIGHT/2;
		BROADPHASE.nx = 20;
		BROADPHASE.ny = 20;
		BROADPHASE.binsizeX = MAP_WIDTH/20;
		BROADPHASE.binsizeY = MAP_HEIGHT/20;

		var smallestx = MAP_WIDTH;
		var ismallestx = -1;

		for(var ipt=0; ipt<points.length; ipt++){
			arenaPolygons[0][ipt] = [points[ipt].x, points[ipt].y];
			if(points[ipt].x < smallestx){
				smallestx = points[ipt].x;
				ismallestx = ipt;
			}
		}

		var ybefore;
		var yafter;
		if(ismallestx == 0){
			ybefore = arenaPolygons[0][arenaPolygons[0].length-1][1];
			yafter  = arenaPolygons[0][1][1];}
		else if(ismallestx == arenaPolygons[0].length-1){
			ybefore = arenaPolygons[0][ismallestx-1][1];
			yafter  = arenaPolygons[0][0][1];}
		else{
			ybefore = arenaPolygons[0][ismallestx-1][1];
			yafter  = arenaPolygons[0][ismallestx+1][1];}

		var dir = Math.sign(yafter-ybefore)>0;

		arenaPolygons[0].splice(ismallestx+1, 0,
			[0, points[ismallestx].y],
			[0, dir?0:MAP_HEIGHT],
			[MAP_WIDTH, dir?0:MAP_HEIGHT],
			[MAP_WIDTH, dir?MAP_HEIGHT:0],
			[0, dir?MAP_HEIGHT:0],
			[0, points[ismallestx].y+(dir?1:-1)*1e-10],
			[points[ismallestx].x, points[ismallestx].y+(dir?1:-1)*1e-10]);

		for(var i=0; i<arenaPolygons[0].length; i++){
			arenaPolygons[0][i][0] -= MAP_WIDTH/2;
			arenaPolygons[0][i][1] = MAP_HEIGHT/2 - arenaPolygons[0][i][1];
		}

		var iil = 1
		while(true){
			if(('island' + iil) in store._importStore){
				points = store.get('island' + iil).node.points;
				arenaPolygons.push(new Array(points.length));
				for(var ipt=0; ipt<points.length; ipt++){
					arenaPolygons[iil][ipt] = [points[ipt].x-MAP_WIDTH/2, MAP_HEIGHT/2-points[ipt].y];
				}
				iil++;
			}
			else{break;}
		}

		// distance map much bigger so the terrain looks good when the cam zooms out:
		DISTANCE_MAP.f = 5; // resolution factor
		DISTANCE_MAP.w = MAP_MAXDIM*2*DISTANCE_MAP.f;
		DISTANCE_MAP.h = MAP_MAXDIM*2*DISTANCE_MAP.f;

		CANVAS_BUFFER.width = DISTANCE_MAP.w;
		CANVAS_BUFFER.height = DISTANCE_MAP.h;

		BUFFER_CONTEXT.fillStyle="#000000";
		BUFFER_CONTEXT.fillRect(0,0,DISTANCE_MAP.w,DISTANCE_MAP.h);
		BUFFER_CONTEXT.fillStyle="#ffffff";
		BUFFER_CONTEXT.fillRect(DISTANCE_MAP.w/2-MAP_WIDTH*DISTANCE_MAP.f/2,
				DISTANCE_MAP.h/2-MAP_HEIGHT*DISTANCE_MAP.f/2,
				MAP_WIDTH*DISTANCE_MAP.f,
				MAP_HEIGHT*DISTANCE_MAP.f);

		BUFFER_CONTEXT.fillStyle = '#000000';
		for(var iil=0; iil<arenaPolygons.length; iil++){
			BUFFER_CONTEXT.beginPath();
			BUFFER_CONTEXT.moveTo(
					(MAP_MAXDIM +arenaPolygons[iil][0][0])*DISTANCE_MAP.f,
					(MAP_MAXDIM -arenaPolygons[iil][0][1])*DISTANCE_MAP.f);
			for(var ipt=1; ipt<arenaPolygons[iil].length; ipt++){
				BUFFER_CONTEXT.lineTo(
						(MAP_MAXDIM +arenaPolygons[iil][ipt][0])*DISTANCE_MAP.f,
						(MAP_MAXDIM -arenaPolygons[iil][ipt][1])*DISTANCE_MAP.f);
			}
			BUFFER_CONTEXT.closePath();
			BUFFER_CONTEXT.fill();
		}
		var booleanImage = booleanImageFromCanvas(CANVAS_BUFFER, 128, false);
		var mapOutside = distanceFromBooleanImage(booleanImage, DISTANCE_MAP.w, DISTANCE_MAP.h, 'EDT');
		booleanImage = booleanImageFromCanvas(CANVAS_BUFFER, 128, true);
		var mapInside = distanceFromBooleanImage(booleanImage, DISTANCE_MAP.w, DISTANCE_MAP.h, 'EDT');
		DISTANCE_MAP.map = mapOutside;

		for(var ipx=0; ipx<DISTANCE_MAP.w*DISTANCE_MAP.h; ipx++){
			if(mapInside[ipx]>mapOutside[ipx]){
				DISTANCE_MAP.map[ipx] = -mapInside[ipx];
			}
		}

		// draw border lines

		if(DEBUG >= 2){
			for(var iil=0; iil<arenaPolygons.length; iil++){
				var material = new THREE.LineBasicMaterial({color: 0x00ffff});
				var geometry = new THREE.Geometry();

				for(var ipt=0; ipt<arenaPolygons[iil].length; ipt++){
					geometry.vertices.push(new THREE.Vector3(arenaPolygons[iil][ipt][0], arenaPolygons[iil][ipt][1], 0.01));
				}
				geometry.vertices.push(new THREE.Vector3(arenaPolygons[iil][0][0], arenaPolygons[iil][0][1], 0.01));

				var line = new THREE.Line(geometry, material);
				GRAPHICS_SCENE.add(line);
			}
		}

		// phyisics

		for(var iil=0; iil<arenaPolygons.length; iil++){
			var body = new p2.Body({mass:0, position:[0,0]});
			body.fromPolygon(arenaPolygons[iil]);
			for (var i=0; i<body.shapes.length; i++) {
				body.shapes[i].material = MAP_MATERIAL;

				if(DEBUG >= 3){ // draw convex shape decomposition
					var material = new THREE.LineBasicMaterial({color: 0xff8000});
					var geometry = new THREE.Geometry();

					for(var ipt=0; ipt<body.shapes[i].vertices.length; ipt++){
						geometry.vertices.push(new THREE.Vector3(
							body.shapes[i].vertices[ipt][0]+body.shapeOffsets[i][0]+body.position[0],
							body.shapes[i].vertices[ipt][1]+body.shapeOffsets[i][1]+body.position[1],
							0.01));
					}
					geometry.vertices.push(new THREE.Vector3(
						body.shapes[i].vertices[0][0]+body.shapeOffsets[i][0]+body.position[0],
						body.shapes[i].vertices[0][1]+body.shapeOffsets[i][1]+body.position[1],
						0.01));

					var line = new THREE.Line(geometry, material);
					GRAPHICS_SCENE.add(line);
				}
			}
			body.inDistanceMap = true;
			body.HBO = this;
			PHYSICS_WORLD.addBody(body);
		}


		// graphics

		var w = 256;
		var h = 256;
		var geometry = new THREE.PlaneGeometry( MAP_MAXDIM*2, MAP_MAXDIM*2, w, h);

		for(var iv=0; iv<geometry.vertices.length; iv++){
			geometry.vertices[iv].x += (Math.random()-0.5)*MAP_MAXDIM/w*2;
			geometry.vertices[iv].y += (Math.random()-0.5)*MAP_MAXDIM/h*2;
			geometry.vertices[iv].z = -3.0*Math.atan(0.5*coastDistance(geometry.vertices[iv].x, geometry.vertices[iv].y));
		}
		geometry.computeFaceNormals();
		geometry.computeVertexNormals();

		var difblob = store.get('pigmentmap');
		var diftex;
		if(typeof(difblob) == "undefined"){
			diftex = loadTexture('media/textures/rocktex.jpg'); // source: https://jwhigham.files.wordpress.com/2010/05/synthtilingsynthesised.jpg
		}
		else{
			var difimg = new Image();
			difimg.src = difblob.src;
			diftex = new THREE.Texture(difimg);
			diftex.needsUpdate = true;
		}

		var bumpblob = store.get('bumpmap');
		var bumptex;
		if(typeof(bumpblob) == "undefined"){
			bumptex = loadTexture('media/textures/rocktex.jpg'); // TODO: the computation of the normal map must wait for this
		}
		else{
			var bumpimg = new Image();
			bumpimg.src = bumpblob.src;
			bumptex = new THREE.Texture(bumpimg);
			bumptex.needsUpdate = true;
		}

		var specblob = store.get('specularmap');
		var spectex;
		if(typeof(specblob) == "undefined"){
			spectex = loadTexture('media/textures/rocktex.jpg');
		}
		else{
			var specimg = new Image();
			specimg.src = specblob.src;
			spectex = new THREE.Texture(specimg);
			spectex.needsUpdate = true;
		}

		if(typeof(store.get('fog')) != "undefined"){
			FOG_COLOR = new THREE.Color(store.get('fog').node.style.fill);
		}
		WATER_COLOR = new THREE.Color(store.get('outline').node.style.fill);
		WATER_OPACITY = store.get('outline').node.style.fillOpacity;

		var material;
		if(TERRAIN_BUMP_MAPPING){

			// create height map texture
			var heightMapDim = 512;
			CANVAS_BUFFER.width = heightMapDim;
			CANVAS_BUFFER.height = heightMapDim;
			var arrayBuffer = new Uint8ClampedArray(heightMapDim * heightMapDim * 4);
			
			for(var y = 0; y < heightMapDim; y++) {
			    for(var x = 0; x < heightMapDim; x++) {
				var pos = (y * heightMapDim + x) * 4; // position in buffer based on x and y
				var c = coastDistance((x/heightMapDim*2-1)*MAP_MAXDIM,-(y/heightMapDim*2-1)*MAP_MAXDIM);
				var h = -3.0*Math.atan(0.5*c) + 127.5;
				var r = Math.floor(h);
				var g = Math.floor((h-r)*256);
				var b = Math.floor(((h-r)*256-g)*256);
				arrayBuffer[pos  ] = r;
				arrayBuffer[pos+1] = g;
				arrayBuffer[pos+2] = b;
				arrayBuffer[pos+3] = 255;
			    }
			}

			var idata = BUFFER_CONTEXT.createImageData(heightMapDim, heightMapDim);
			idata.data.set(arrayBuffer);
			BUFFER_CONTEXT.putImageData(idata, 0, 0);
			var heighttex = new THREE.Texture(CANVAS_BUFFER);
			heighttex.needsUpdate = true;
			bumptex.needsUpdate = true;

			// convert bumpmap and terrain height map into normal map
			var terrainGPU = new GPUComputationRenderer( 1024, 1024, RENDERER );
			var terrainGPUmat = terrainGPU.createShaderMaterial( terrainNormalComputationShader,{
				heighttex: {type:'t', value: heighttex},
				heighttexdim: {type:'f', value: heightMapDim},
				bumptex: {type:'t', value: bumptex}, // TODO: this must wait until the bump map is loaded (in case the std bumpmap is used)
				bumptexdim: {type:'f', value: bumptex.image.width},
				spectex: {type:'t', value: spectex}, // TODO: this must wait until the spec map is loaded (in case the std bumpmap is used)
				terraindim: {type: 'f', value: 2*MAP_MAXDIM}
				 } );
			
			//( sizeXTexture, sizeYTexture, wrapS, wrapT, minFilter, magFilter, textureType )
			var outputRenderTarget = terrainGPU.createRenderTarget(
				undefined, undefined, undefined, undefined, THREE.LinearMipMapLinearFilter, THREE.LinearFilter, THREE.UnsignedByteType);
			var nmlspectex = outputRenderTarget.texture;
 			terrainGPU.doRenderTarget( terrainGPUmat, outputRenderTarget );

			//use the new texture
			material = new THREE.ShaderMaterial( {
				uniforms: {
					diftex: { type: 't', value: diftex },
					nmlspectex: { type: 't', value: nmlspectex },
					terraindims: { type: 'v2', value: new THREE.Vector2(2*MAP_MAXDIM, 2*MAP_MAXDIM) },
					lightvec: { type: 'v3', value: new THREE.Vector3(-1,1,1) }, // direction TOWARDS light
					fogColor: { type: 'c', value: FOG_COLOR},
					heighttex: {type:'t', value: heighttex},
					waterColor: {type: 'c', value: WATER_COLOR}
				},
				vertexShader: terrainVertexShader,
				fragmentShader: terrainFragmentShader
			} );
		}
		else{
			material = new THREE.MeshLambertMaterial({
				map:diftex,
				wireframe:false
			});
		}

		this.mesh = new THREE.Mesh(geometry, material );
		GRAPHICS_SCENE.add( this.mesh );

		initWater();

		LOADING_LIST.checkItem('arena');
	});

}

Arena.prototype = Object.create(HBObject.prototype);
Arena.prototype.constructor = Arena;
