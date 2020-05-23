var questionBlock = document.getElementById("question");
var gameBlock = document.getElementById("threejs");
questionBlock.style.display = "none";
gameBlock.style.display = "block";
document.getElementById("exit").addEventListener("click", event => {
    questionBlock.style.display = "none";
    gameBlock.style.display = "block";
    
});

import * as THREE from '../build/three.module.js';
import {GLTFLoader} from '../jsm/loaders/GLTFLoader.js';
import {OrbitControls} from '../jsm/controls/OrbitControls.js';
import {FirstPersonControls} from '../jsm/controls/FirstPersonControls.js';
import {PointerLockControls} from '../jsm/controls/PointerLockControls.js';
import {FlyControls} from '../jsm/controls/FlyControls.js';
import {THREEx} from  "../build/threex.domevents.js"; 
import * as util from "./util.js";

var loader = new GLTFLoader();
// Add event listeners for when movement keys are pressed and released
document.addEventListener('keydown', util.onKeyDown, false);
document.addEventListener('keyup', util.onKeyUp, false);
//var modelBaseURL = "http://34.106.223.239/gltf/";
var modelBaseURL = "http://localhost:3000/gltf/";
// game flow control
var completedTask = 0;
// Velocity vector for the player
var playerVelocity = new THREE.Vector3();

// How fast the player will move
var PLAYERSPEED = 15.0;
var playerFloor = -0.25;
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
                    document.removeEventListener( 'fullscreenchange', fullscreenchange );
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


// How fast the player will move
var PLAYERSPEED = 10.0;
var playerFloor = -0.3;
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
                    document.removeEventListener( 'fullscreenchange', fullscreenchange );
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

function detectPlayerCollision() {
    // The rotation matrix to apply to our direction vector
    // Undefined by default to indicate ray should coming from front
    var rotationMatrix;
    // Get direction of camera
    var cameraDirection = controls.getDirection(new THREE.Vector3(0, 0, 0)).clone();
    var PLAYERCOLLISIONDISTANCE = .125;
    // Check which direction we're moving (not looking)
    // Flip matrix to that direction so that we can reposition the ray
    if (util.moveBackward) {
        rotationMatrix = new THREE.Matrix4();
        rotationMatrix.makeRotationY(util.degreesToRadians(180));
    }
    else if (util.moveLeft) {
        rotationMatrix = new THREE.Matrix4();
        rotationMatrix.makeRotationY(util.degreesToRadians(90));
    }
    else if (util.moveRight) {
        rotationMatrix = new THREE.Matrix4();
        rotationMatrix.makeRotationY(util.degreesToRadians(270));
    }

    // Player is not moving forward, apply rotation matrix needed
    if (rotationMatrix !== undefined) {
        cameraDirection.applyMatrix4(rotationMatrix);
    }

    // Apply ray to player camera
    var rayCaster = new THREE.Raycaster(controls.getObject().position, cameraDirection);

    // If our ray hit a collidable object, return true
    if (util.rayIntersect(rayCaster, PLAYERCOLLISIONDISTANCE)) {
        return true;
    } else {
        return false;
    }
}

function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({canvas});
    var onKeyDown = util.onKeyDown;
    var onKeyUp = util.onKeyUp;
    
    const fov = 35;
    const aspect = 2;  // the canvas default
    const near = 0.01;
    const far = 5000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    const domEvent = new THREEx.DomEvents(camera,renderer.domElement);
    
    camera.position.set( 0, playerFloor, 0.5 );
    camera.lookAt(new THREE.Vector3(0, playerFloor, 0));
    
    controls = new PointerLockControls(camera, canvas);
    controls.enabled = true;
    
    function animatePlayer(delta) {
        // Gradual slowdown
        playerVelocity.x -= playerVelocity.x * 10.0 * delta;
        playerVelocity.z -= playerVelocity.z * 10.0 * delta;
        
        if (util.moveForward && detectPlayerCollision() == false) {
            playerVelocity.z -= PLAYERSPEED * delta;
        } 
        if (util.moveBackward && detectPlayerCollision() == false) {
            playerVelocity.z += PLAYERSPEED * delta;
        } 
        if (util.moveLeft && detectPlayerCollision() == false) {
            playerVelocity.x -= PLAYERSPEED * delta;
        } 
        if (util.moveRight && detectPlayerCollision() == false) {
            playerVelocity.x += PLAYERSPEED * delta;
        }
        if( !( util.moveForward || util.moveBackward || util.moveLeft || util.moveRight)) {
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
            
    // ------------------------Game Control --------------------------------
        // Puzzle objects
        // var vehicle = util.loadgltfModel(modelBaseURL + 'm725_military_ambulance/scene.gltf',scene,0.33,-0.155,-0.32);
        // var crate = util.loadgltfModel(modelBaseURL + 'crate/scene.gltf',scene,0.3,-0.175,0.315);
        // var safe = util.loadgltfModel(modelBaseURL + 'safe/scene.gltf',scene,-0.35,-0.2,-0.011);
        // var keypad = util.loadgltfModel(modelBaseURL + 'keypad/scene.gltf',scene,-0.0835,-0.155,0.464);
    // Load a glTF resource for question 1
    loader.load(
    // resource URL
        modelBaseURL + 'cardboard_box.glb',
        // called when the resource is loaded
        function ( gltf ) {              
     
            gltf.scene.traverse( child => {
            if ( child.material ) child.material.metalness = 0.1;
                child.position.set(0.37,-0.165,0.04);
                util.collidableObjects.push(child);
                domEvent.addEventListener(child,'click', event =>{
                    if (completedTask == 0){
                        document.exitPointerLock();
                        questionBlock.style.display = "block";
                        gameBlock.style.display = "none";
                        
                                                    
                    } 
                                
                })
            });
            scene.add( gltf.scene );
        });

    // // Load a glTF resource for question 2
    // loader.load(
    //     // resource URL
    //         modelBaseURL + 'm725_military_ambulance/scene.gltf',
    //         // called when the resource is loaded
    //         function ( gltf ) {              
         
    //             gltf.scene.traverse( child => {
    //             if ( child.material ) child.material.metalness = 0.1;
    //                 child.position.set(0.33,-0.155,-0.32);
    //                 util.collidableObjects.push(child);
    //                 domEvent.addEventListener(child,'click', event =>{
    //                     if (completedTask == 1){
    //                         questionBlock.style.display = "block";
    //                         gameBlock.style.display = "none";
                                                        
    //                     } 
                                    
    //                 })
    //             });
    //             scene.add( gltf.scene );
    //         });

    // // Load a glTF resource for question 3
    // loader.load(
    //     // resource URL
    //         modelBaseURL + 'crate/scene.gltf',
    //         // called when the resource is loaded
    //         function ( gltf ) {              
         
    //             gltf.scene.traverse( child => {
    //             if ( child.material ) child.material.metalness = 0.1;
    //                 child.position.set(0.3,-0.18,0.313);
    //                 util.collidableObjects.push(child);
    //                 domEvent.addEventListener(child,'click', event =>{
    //                     if (completedTask == 2){
    //                         questionBlock.style.display = "block";
    //                         gameBlock.style.display = "none";
                                                        
    //                     } 
                                    
    //                 })
    //             });
    //             scene.add( gltf.scene );
    //         });

    // // Load a glTF resource for question 4
    // loader.load(
    //     // resource URL
    //         modelBaseURL + 'safe/scene.gltf',
    //         // called when the resource is loaded
    //         function ( gltf ) {              
         
    //             gltf.scene.traverse( child => {
    //             if ( child.material ) child.material.metalness = 0.1;
    //                 child.position.set(-0.35,-0.2,-0.011);
    //                 util.collidableObjects.push(child);
    //                 domEvent.addEventListener(child,'click', event =>{
    //                     if (completedTask == 3){
    //                         questionBlock.style.display = "block";
    //                         gameBlock.style.display = "none";
                                                        
    //                     } 
                                    
    //                 })
    //             });
    //             scene.add( gltf.scene );
    //         });

    // // Load a glTF resource for question 5
    // loader.load(
    //     // resource URL
    //         modelBaseURL + 'keypad/scene.gltf',
    //         // called when the resource is loaded
    //         function ( gltf ) {              
         
    //             gltf.scene.traverse( child => {
    //             if ( child.material ) child.material.metalness = 0.1;
    //                 child.position.set(-0.0835,-0.155,0.464);
    //                 util.collidableObjects.push(child);
    //                 domEvent.addEventListener(child,'click', event =>{
    //                     if (completedTask == 4){
    //                         questionBlock.style.display = "block";
    //                         gameBlock.style.display = "none";
                                                        
    //                     } 
                                    
    //                 })
    //             });
    //             scene.add( gltf.scene );
    //         });                                      
// ----------------------- End Game Control --------------------------------
    {
        //THREE.ImageUtils.crossOrigin = '';

        var textureLoader = new THREE.TextureLoader().load(
            modelBaseURL + "concrete.jpg",
            // Function when resource is loaded
            function ( groundTex ) {
                // do something with the texture
                groundTex.wrapS = THREE.RepeatWrapping;
                groundTex.wrapT = THREE.RepeatWrapping;
                groundTex.repeat.set( 1000, 1000); 
                var floorMat = new THREE.MeshStandardMaterial({ map : groundTex, side: THREE.DoubleSide });
                floorMat.name = "floor_material";
                floorMat.side = THREE.DoubleSide;
                floorMat.map = groundTex; 

                var floorGeom = new THREE.PlaneBufferGeometry(100,100,1,1);

                //the face normals and vertex normals can be calculated automatically if not supplied above
                floorGeom.computeFaceNormals();
                floorGeom.computeVertexNormals();
                var rotMat = new THREE.Matrix4().makeRotationX(90*Math.PI/180);
                var transMat = new THREE.Matrix4().makeTranslation(0, 0, 0.4);
                var newMat = rotMat.multiply(transMat);
                floorGeom.applyMatrix(newMat);
                var floorMesh = new THREE.Mesh( floorGeom, floorMat );
                floorMesh.name = "Floor";
                floorMesh.material = floorMat;
                floorMesh.material.needsUpdate = true;
                scene.add( floorMesh );
            },
            // Function called when download progresses
            function ( xhr ) {
                console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
            },
            // Function called when download errors
            function ( xhr ) {
                console.log( 'An error happened' );
            }
        );



        loader.load(
            // resource URL
            modelBaseURL + 'sky/scene.gltf',
            // called when the resource is loaded
            function ( gltf ) {
                
                gltf.scene.matrixAutoUpdate = false;
                gltf.scene.matrix.scale(new THREE.Vector3(10,10,10));

                scene.add( gltf.scene );

                },
                    // called while loading is progressing
                    function ( xhr ) {
                        
                        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
                        
                    },
                    // called when loading has errors
                    function ( error ) {
                        console.log( 'An error happened' + error);
                    }
        );
    
    }


    // Load a glTF resource
    loader.load(
    // resource URL
    modelBaseURL + 'scene.gltf',
    // called when the resource is loaded
    function ( gltf ) {
        
        //gltf.scene.matrixAutoUpdate = false;
        //gltf.scene.matrix.scale(new THREE.Vector3(0.01,0.01,0.01));
        
        //console.log(util.dumpObject(gltf.scene).join('\n'));
        gltf.scene.traverse( child => {
            if ( child.material ) child.material.metalness = 0.1;
                util.collidableObjects.push(child);
        } );
        scene.add( gltf.scene );
        },
        // called while loading is progressing
        function ( xhr ) {
            
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
            
        },
        // called when loading has errors
        function ( error ) {
            console.log( 'An error happened' + error);
        }
    );

    // ======== Main common area =====================
    // util.loadgltfModel(modelBaseURL + 'world_map_color_3d_scan/scene.gltf',scene,-0.145,-0.155,-0.465);
    // util.loadgltfModel(modelBaseURL + 'the_matrix_red_chesterfield_chair/scene.gltf',scene,0.16,-0.185,0.41);
    // util.loadgltfModel(modelBaseURL + 'messy_tack_board/scene.gltf',scene,0.225,-0.15,0.055);

    // ============= Room #1 ==========================
    // util.loadgltfModel(modelBaseURL + 'caroline_harrison_piano_-_preview/scene.gltf',scene,-0.43,-0.2,-0.325);

    // // ============= Room #3 ==========================
    // util.loadgltfModel(modelBaseURL + 'cardboard_box.glb',scene,-0.433,-0.2,-0.265);
    // util.loadgltfModel(modelBaseURL + 'cardboard_box.glb',scene,-0.403,-0.2,-0.265);
    // util.loadgltfModel(modelBaseURL + 'cardboard_box.glb',scene,-0.373,-0.2,-0.265);
    // util.loadgltfModel(modelBaseURL + 'cardboard_box.glb',scene,-0.343,-0.2,-0.265);
    // util.loadgltfModel(modelBaseURL + 'cardboard_box.glb',scene,-0.313,-0.2,-0.265);
    // util.loadgltfModel(modelBaseURL + 'cardboard_box.glb',scene,-0.433,-0.17,-0.265);
    // util.loadgltfModel(modelBaseURL + 'cardboard_box.glb',scene,-0.403,-0.17,-0.265);
    // util.loadgltfModel(modelBaseURL + 'cardboard_box.glb',scene,-0.373,-0.17,-0.265);
    // util.loadgltfModel(modelBaseURL + 'cardboard_box.glb',scene,-0.343,-0.17,-0.265);
    // util.loadgltfModel(modelBaseURL + 'cardboard_box.glb',scene,-0.433,-0.14,-0.265);
    // util.loadgltfModel(modelBaseURL + 'cardboard_box.glb',scene,-0.403,-0.14,-0.265);
    // util.loadgltfModel(modelBaseURL + 'cardboard_box.glb',scene,-0.373,-0.14,-0.265);
    // util.loadgltfModel(modelBaseURL + 'metal_barrel/scene.gltf',scene,-0.39,-0.165,-0.03);
    // util.loadgltfModel(modelBaseURL + 'metal_barrel/scene.gltf',scene,-0.361,-0.165,-0.03);
    // util.loadgltfModel(modelBaseURL + 'metal_barrel/scene.gltf',scene,-0.39,-0.1635,-0.059);
    // util.loadgltfModel(modelBaseURL + 'crate/scene.gltf',scene,-0.3,-0.18,-0.030);
    // util.loadgltfModel(modelBaseURL + 'old_tires_-_dirt_low_poly/scene.gltf',scene,-0.28,-0.149,-0.15);

    // // ============= Room #4 ==========================
    // util.loadgltfModel(modelBaseURL + 'old_hutch/scene.gltf',scene,0.27,-0.198,-0.0012);
    
    // // ============= Room #5 ==========================
    // util.loadgltfModel(modelBaseURL + 'crate/scene.gltf',scene,-0.425,-0.18,0.018); // crate#1
    // util.loadgltfModel(modelBaseURL + 'crate/scene.gltf',scene,-0.38,-0.18,0.018); // crate#2
    // util.loadgltfModel(modelBaseURL + 'fridge/scene.gltf',scene,-0.4,-0.205,0.06); // refridgerator

    // // ============= Room #6 ==========================
    // util.loadgltfModel(modelBaseURL + 'table.glb',scene,0.37,-0.2,0.04);

    // // ============= Room #8 ==========================
    // util.loadgltfModel(modelBaseURL + 'cardboard_box.glb',scene, 0.373, -0.2, 0.3082);
    // util.loadgltfModel(modelBaseURL + 'cardboard_box.glb',scene, 0.343, -0.2, 0.3082);
    // util.loadgltfModel(modelBaseURL + 'cardboard_box.glb',scene, 0.433, -0.2, 0.338);
    // util.loadgltfModel(modelBaseURL + 'cardboard_box.glb',scene, 0.403, -0.2, 0.338);
    // util.loadgltfModel(modelBaseURL + 'cardboard_box.glb',scene, 0.403, -0.17, 0.3082);
    // util.loadgltfModel(modelBaseURL + 'cardboard_box.glb',scene, 0.373, -0.17, 0.3082);
    // util.loadgltfModel(modelBaseURL + 'cardboard_box.glb',scene, 0.433, -0.17, 0.338);
    // util.loadgltfModel(modelBaseURL + 'fiberglass_step_ladder_6_new/scene.gltf',scene, 0.248, -0.20, 0.311);
    
    //util.loadgltfModel(modelBaseURL + 'toolbox.glb',scene, new THREE.Matrix4());
// --------------------------------------------------------------
    var box1 = util.addCube(0.1,0.15,0.08,modelBaseURL + 'textures/Wood.png',0.5,-0.35,0.535,scene)
    var box2 = util.addCube(0.1,0.6,0.1,modelBaseURL + 'textures/Wood.png',0.5,-0.35,0.45,scene)
    var box3 = util.addCube(0.1,0.6,0.1,modelBaseURL + 'textures/Wood.png',0.5,-0.35,0.35,scene)
    var box4 = util.addCube(0.1,0.275,0.08,modelBaseURL + 'textures/Wood.png',0.5,-0.1375,0.535,scene)
    var box5 = util.addCube(0.1,0.6,0.1,modelBaseURL + 'textures/Wood.png',0.5,-0.35,0.25,scene)
    var box6 = util.addCube(0.1,0.6,0.1,modelBaseURL + 'textures/Wood.png',0.5,-0.35,0.15,scene)
    var box7 = util.addCube(0.1,0.6,0.1,modelBaseURL + 'textures/Wood.png',0.5,-0.35,0.05,scene)
    domEvent.addEventListener(box1, 'click', event =>{
        if(box1.position.x < 0.78 ){
            box1.position.set(box1.position.x + 0.05,box1.position.y,box1.position.z);
            
        }
    });
// --------------------------------------------------------------
    
    function render(time) {
        time *= 0.001;  // convert time to seconds
        
        renderer.render(scene, camera);
        requestAnimationFrame(render);
        
        var delta = clock.getDelta();
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