
    import * as THREE from '../build/three.module.js';
        import {GLTFLoader} from '../jsm/loaders/GLTFLoader.js';
        import {OrbitControls} from '../jsm/controls/OrbitControls.js';
        import {FirstPersonControls} from '../jsm/controls/FirstPersonControls.js';
        import {PointerLockControls} from '../jsm/controls/PointerLockControls.js';
        import {FlyControls} from '../jsm/controls/FlyControls.js';
        var collidableObjects = [];
        var loader = new GLTFLoader();

            // Flags to determine which direction the player is moving
            var moveForward = false;
            var moveBackward = false;
            var moveLeft = false;
            var moveRight = false;

            // Velocity vector for the player
            var playerVelocity = new THREE.Vector3();

            // How fast the player will move
            var PLAYERSPEED = 60.0;
            var playerFloor = -1.00;
            var clock;
            var controls;

            clock = new THREE.Clock();

            var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
            if ( havePointerLock ) {
                var element = document.querySelector('#c');//document.body;
                var pointerlockchange = function ( event ) {
                    if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
        //controlsEnabled = true;
        controls.enabled = true;
                        //blocker.style.display = 'none';
                    } else {
        controls.enabled = false;
                    }
                };
                var pointerlockerror = function ( event ) {
        //
    };
                // Hook pointer lock state change events
                document.addEventListener( 'pointerlockchange', pointerlockchange, false );
                document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
                document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );
                document.addEventListener( 'pointerlockerror', pointerlockerror, false );
                document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
                document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );
                document.addEventListener( 'click', function ( event ) {
        // Ask the browser to lock the pointer
        element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
                    if ( /Firefox/i.test( navigator.userAgent ) ) {
                        var fullscreenchange = function ( event ) {
                            if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {
        document.removeEventListener('fullscreenchange', fullscreenchange);
                                document.removeEventListener( 'mozfullscreenchange', fullscreenchange );
                                element.requestPointerLock();
                            }
                        };
                        document.addEventListener( 'fullscreenchange', fullscreenchange, false );
                        document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );
                        element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;
                        element.requestFullscreen();
                    } else {
        element.requestPointerLock();
                    }
                }, false );
            } else {
        document.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
            }

        function dumpObject(obj, lines = [], isLast = true, prefix = '') {
            const localPrefix = isLast ? '??' : '??';
            lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]`);
            const newPrefix = prefix + (isLast ? '  ' : '? ');
            const lastNdx = obj.children.length - 1;
            obj.children.forEach((child, ndx) => {
                const isLast = ndx === lastNdx;
                dumpObject(child, lines, isLast, newPrefix);
            });
            return lines;
        }
function degreesToRadians(degrees) {
  return degrees * Math.PI / 180;
}

function radiansToDegrees(radians) {
  return radians * 180 / Math.PI;
}
        function detectPlayerCollision() {
    // The rotation matrix to apply to our direction vector
    // Undefined by default to indicate ray should coming from front
    var rotationMatrix;
    // Get direction of camera
    var cameraDirection = controls.getDirection(new THREE.Vector3(0, 0, 0)).clone();
    var PLAYERCOLLISIONDISTANCE = .5;
    // Check which direction we're moving (not looking)
    // Flip matrix to that direction so that we can reposition the ray
    if (moveBackward) {
        rotationMatrix = new THREE.Matrix4();
        rotationMatrix.makeRotationY(degreesToRadians(180));
    }
    else if (moveLeft) {
        rotationMatrix = new THREE.Matrix4();
        rotationMatrix.makeRotationY(degreesToRadians(90));
    }
    else if (moveRight) {
        rotationMatrix = new THREE.Matrix4();
        rotationMatrix.makeRotationY(degreesToRadians(270));
    }

    // Player is not moving forward, apply rotation matrix needed
    if (rotationMatrix !== undefined) {
        cameraDirection.applyMatrix4(rotationMatrix);
    }

    // Apply ray to player camera
    var rayCaster = new THREE.Raycaster(controls.getObject().position, cameraDirection);

    // If our ray hit a collidable object, return true
    if (rayIntersect(rayCaster, PLAYERCOLLISIONDISTANCE)) {
        return true;
    } else {
        return false;
    }
}

function rayIntersect(ray, distance) {
    var intersects = ray.intersectObjects(collidableObjects);
    for (var i = 0; i < intersects.length; i++) {
        // Check if there's a collision
        if (intersects[i].distance < distance) {
            return true;
        }
    }
    return false;
}

        function listenForPlayerMovement() {

            // A key has been pressed
            var onKeyDown = function(event) {
            if(detectPlayerCollision() == false) {
                switch (event.keyCode) {

                case 38: // up
                case 87: // w
                    moveForward = true;
                    break;
                case 37: // left
                case 65: // a
                    moveLeft = true;
                    break;
                case 40: // down
                case 83: // s
                    moveBackward = true;
                    break;
                case 39: // right
                case 68: // d
                    moveRight = true;
                    break;
            }}else{
        moveForward = false;
                moveLeft = false;
                moveBackward = false;
                moveRight = false;

            }
        };

        // A key has been released
            var onKeyUp = function(event) {

                switch (event.keyCode) {

                case 38: // up
                case 87: // w
                    moveForward = false;
                    break;

                case 37: // left
                case 65: // a
                    moveLeft = false;
                    break;

                case 40: // down
                case 83: // s
                    moveBackward = false;
                    break;

                case 39: // right
                case 68: // d
                    moveRight = false;
                    break;
                }
            };

            // Add event listeners for when movement keys are pressed and released
            document.addEventListener('keydown', onKeyDown, false);
            document.addEventListener('keyup', onKeyUp, false);
        }


        function main() {

            const canvas = document.querySelector('#c');
            const renderer = new THREE.WebGLRenderer({canvas});

            listenForPlayerMovement();

            const fov = 35;
            const aspect = 2;  // the canvas default
            const near = 0.01;
            const far = 5000;
            const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

            camera.position.set( 0.5, playerFloor, 0.5 );
            camera.lookAt(new THREE.Vector3(0, playerFloor, 0));

            controls = new PointerLockControls(camera, canvas);
            controls.enabled = true;

            function animatePlayer(delta) {
        // Gradual slowdown
        playerVelocity.x -= playerVelocity.x * 10.0 * delta;
                playerVelocity.z -= playerVelocity.z * 10.0 * delta;

                if (moveForward) {
        playerVelocity.z -= PLAYERSPEED * delta;
                }
                if (moveBackward) {
        playerVelocity.z += PLAYERSPEED * delta;
                }
                if (moveLeft) {
        playerVelocity.x -= PLAYERSPEED * delta;
                }
                if (moveRight) {
        playerVelocity.x += PLAYERSPEED * delta;
                }
                if( !( moveForward || moveBackward || moveLeft ||moveRight)) {
        // No movement key being pressed. Stop movememnt
        playerVelocity.x = 0;
                    playerVelocity.z = 0;
                }
                controls.getObject().translateX(playerVelocity.x * delta);
                controls.getObject().translateZ(playerVelocity.z * delta);
                controls.getObject().position.set( controls.getObject().position.x, playerFloor, controls.getObject().position.z );
            }

            const scene = new THREE.Scene();
            scene.add( controls.getObject() );
            {
                const color = 0xFFFFFF;
                const intensity = 1;
                const light = new THREE.DirectionalLight(color, intensity);
                light.position.set(-1, 2, 4);
                //scene.add(light);
            }
            //0,0.25,0
            //var hs_light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
            //scene.add( hs_light );
            var plight = new THREE.PointLight( 0xFFFFFF, 1, 100 );
            plight.position.set( 0, 0.25, 0 );
            //scene.add( plight );
            var ambient = new THREE.AmbientLight( 0xFFFFFF ); // soft white light
            scene.add( ambient );

            // Load a glTF resource
            loader.load(
            // resource URL
            'gltf/barn.glb',
            // called when the resource is loaded
            function ( gltf ) {

        gltf.scene.matrixAutoUpdate = false;

                //..gltf.scene.MATRIX.scale(new THREE.Vector3(1,1,1));

                //console.log(dumpObject(gltf.scene).join('\n'));
                gltf.scene.traverse( child => {
                       if ( child.material ) child.material.metalness = 1;

                       collidableObjects.push(child);
                   });

                   scene.add( gltf.scene );

 // ---------------------------------------------------------------------------






function addCube(height, width, depth, texture){
    var geometry = new THREE.CubeGeometry( 0.3, 0.3, 0.3 );
    var texture = new THREE.TextureLoader().load( './texture/uvgrid.png' );
    var material = new THREE.MeshBasicMaterial( {map: texture } );

   var mesh = new THREE.Mesh( geometry, material );
   mesh.position.set(1,playerFloor,1);
   console.log("adding mesh");
  //scene is global
 scene.add(mesh);
 collidableObjects.push(mesh);
}


addCube();



 // ---------------------------------------------------------------------------
                //scene.add( gltf.scene );

                gltf.animations; // Array<THREE.AnimationClip>
        gltf.scene; // THREE.Group
                gltf.scenes; // Array<THREE.Group>
            gltf.cameras; // Array<THREE.Camera>
                gltf.asset; // Object
                },
                // called while loading is progressing
                    function ( xhr ) {

                    console.log((xhr.loaded / xhr.total * 100) + '% loaded');

                    },
                    // called when loading has errors
                    function ( error ) {
                    console.log('An error happened' + error);
                    }
                    );

                    const boxWidth = 1;
                    const boxHeight = 1;
                    const boxDepth = 1;
                    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);


                    function render(time) {
                    time *= 0.001;  // convert time to seconds

                        renderer.render(scene, camera);
                        requestAnimationFrame(render);

                        var delta = 0.005;
                        animatePlayer(delta);
                    }

                    function onWindowResize() {

                    camera.aspect = (window.innerWidth - 100) / (window.innerHeight - 300  );
                        camera.updateProjectionMatrix();
                        
                        renderer.setSize( window.innerWidth-100, window.innerHeight-300 );
                        
                        render();
                    }

                    window.addEventListener( 'resize', onWindowResize, false );
                    onWindowResize();
                    requestAnimationFrame(render);
                }
                main();
                    
            

            