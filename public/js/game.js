
var questionBlock1 = document.getElementById("questionBox1");
var questionBlock2 = document.getElementById("questionBox2");
var questionBlock3 = document.getElementById("questionBox3");
var questionBlock4 = document.getElementById("questionBox4");
var questionBlock5 = document.getElementById("questionBox5");
var levelComplete1 = document.getElementById("finishedLevel");
var gameBlock = document.getElementById("threejs");
questionBlock1.style.display = "none";
questionBlock2.style.display = "none";
questionBlock3.style.display = "none";
questionBlock4.style.display = "none";
questionBlock5.style.display = "none";
levelComplete1.style.display = "none";
gameBlock.style.display = "block";
// document.getElementById("exitTest").addEventListener("click", event => {
//     questionBlock.style.display = "none";
//     gameBlock.style.display = "block";
    
// });



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
var takingTest = false;

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
        if(takingTest) {
            return;
        }
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
        if(takingTest) {
            return;
        }
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
    // Load a glTF resource for question 1
    loader.load(
    // resource URL
        modelBaseURL + 'cardboard_box.glb',
        // called when the resource is loaded
        function ( gltf ) {              
     
            gltf.scene.traverse( child => {
            if ( child.material ) child.material.metalness = 0.1;
                child.position.set(0.37,-0.162,0.04);
                util.collidableObjects.push(child);
                domEvent.addEventListener(child,'click', event =>{
                    if (completedTask == 0){
                        takingTest = true;
                        document.exitPointerLock();
                        questionBlock1.style.display = "block";
                        gameBlock.style.display = "none";
                        
                                                    
                    } 
                                
                })
            });
            scene.add( gltf.scene );
        });

    // Load a glTF resource for question 2
    loader.load(
        // resource URL
            modelBaseURL + 'm725_military_ambulance/scene.gltf',
            // called when the resource is loaded
            function ( gltf ) {              
         
                gltf.scene.traverse( child => {
                if ( child.material ) child.material.metalness = 0.1;
                    child.position.set(0.33,-0.155,-0.32);
                    util.collidableObjects.push(child);
                    domEvent.addEventListener(child,'click', event =>{
                        if (completedTask == 1){
                            takingTest = true;
                            document.exitPointerLock();
                            questionBlock2.style.display = "block";
                            gameBlock.style.display = "none";
                        } 
                                    
                    })
                });
                scene.add( gltf.scene );
            });

    // Load a glTF resource for question 3
    loader.load(
        // resource URL
            modelBaseURL + 'crate/scene.gltf',
            // called when the resource is loaded
            function ( gltf ) {              
         
                gltf.scene.traverse( child => {
                if ( child.material ) child.material.metalness = 0.1;
                    child.position.set(0.3,-0.18,0.313);
                    util.collidableObjects.push(child);
                    domEvent.addEventListener(child,'click', event =>{
                        if (completedTask == 2){
                            takingTest = true;
                            document.exitPointerLock();
                            questionBlock3.style.display = "block";
                            gameBlock.style.display = "none";
                         
                                                        
                        } 
                                    
                    })
                });
                scene.add( gltf.scene );
            });

    // Load a glTF resource for question 4
    loader.load(
        // resource URL
            modelBaseURL + 'safe/scene.gltf',
            // called when the resource is loaded
            function ( gltf ) {              
         
                gltf.scene.traverse( child => {
                if ( child.material ) child.material.metalness = 0.1;
                    child.position.set(-0.35,-0.2,-0.011);
                    util.collidableObjects.push(child);
                    domEvent.addEventListener(child,'click', event =>{
                        if (completedTask == 3){
                            takingTest = true;
                            document.exitPointerLock();        
                            questionBlock4.style.display = "block";
                            gameBlock.style.display = "none";
                         
                                                        
                        } 
                                    
                    })
                });
                scene.add( gltf.scene );
            });

    // Load a glTF resource for question 5
    loader.load(
        // resource URL
            modelBaseURL + 'keypad/scene.gltf',
            // called when the resource is loaded
            function ( gltf ) {              
         
                gltf.scene.traverse( child => {
                if ( child.material ) child.material.metalness = 0.1;
                    child.position.set(-0.0835,-0.155,0.464);
                    util.collidableObjects.push(child);
                    domEvent.addEventListener(child,'click', event =>{
                        if (completedTask == 4){
                            takingTest = true;
                            document.exitPointerLock();    
                            questionBlock5.style.display = "block";
                            gameBlock.style.display = "none";
                                                        
                        } 
                                    
                    })
                });
                scene.add( gltf.scene );
            });                                      
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
// ------------------------Question 1 testing --------------------------------
function testResults1(form) {
    try {
        var num1 = 20;
        var num2 = 30;
        var testCode = document.getElementById("enteredCode1").value;
        var value = eval(testCode + "\addNumbers(" + num1 + "," + num2 +");"); 
        var message = "Wrong!"
        if(value == num1 + num2) {
            message = "You are correct! You found a key!"
            completedTask = 1;
        }        
        $("#results1").html(message);
    }
    catch(err) {
            $("#results1").html("Your code threw an exception: " + err);
    }
}

// ------------------------Question 2 testing --------------------------------
function testResults2(form) {
    try {
        var testCode = document.getElementById("enteredCode2").value;
        var findFor = testCode.includes("for");
        var code = "function test(){" + testCode + "return count;}"
        var value = eval(code + "test();"); 
        var message = "Wrong!"
        if(value == 100 && findFor == true) {
            message = "You are correct! You found a crowbar"
            completedTask = 2;
        }        
        $("#results2").html(message);
    }
    catch(err) {
            $("#results2").html("Your code threw an exception: " + err);
    }
}
// ------------------------Question 3 testing --------------------------------
function testResults3(form) {
    try {
        var num1 = 20;
        var num2 = 50;
        var num3 = 80;
        var testCode = document.getElementById("enteredCode3").value;
        var value1 = eval(testCode + "\conditionalIf(" + num1 + ");"); 
        var value2 = eval(testCode + "\conditionalIf(" + num2 + ");"); 
        var value3 = eval(testCode + "\conditionalIf(" + num3 + ");"); 
        var message = "Wrong!"
        if(value1 == false && value2 == true && value3 == true) {
            message = "You are correct! You found a piece of paper the states 'Right 10, Left 30, right 18'!"
            completedTask = 3;
        }        
        $("#results3").html(message);
    }
    catch(err) {
            $("#results3").html("Your code threw an exception: " + err);
    }
}
// ------------------------Question 4 testing --------------------------------
function testResults4(form) {
    try {
        var testCode = document.getElementById("enteredCode4").value;
        var code = "function array(){" + testCode + "return array;}"
        var value = eval(code + "array()"); 
        var message = "Wrong!"
        if(value[0] == 10 && value[1] == 20 && value[2] == 30 && value[3] == 40) {
            message = "You are correct! You found a post-it note with the numbers 2,0,2,0"
            completedTask = 4;
        }        
        $("#results4").html(message);
    }
    catch(err) {
            $("#results4").html("Your code threw an exception: " + err);
    }
}
// ------------------------Question 5 testing --------------------------------
function testResults5(form) {
    try {
        var num1 = 3;
        var num2 = 5;
        var num3 = 7;
        var testCode = document.getElementById("enteredCode5").value;
        var count = (testCode.match(/factorial/g) || []).length;
        var value1 = eval(testCode + "factorial("+ num1 + ");"); 
        var value2 = eval(testCode + "factorial("+ num2 + ");"); 
        var value3 = eval(testCode + "factorial("+ num3 + ");"); 
        var message = "Wrong!"
        if(value1 = 6 && value2 == 120 && value3 ==5040 && count >= 2) {
            completedTask = 0;
            questionBlock1.style.display = "none";
            questionBlock2.style.display = "none";
            questionBlock3.style.display = "none";
            questionBlock4.style.display = "none";
            questionBlock5.style.display = "none";
            gameBlock.style.display = "none";
            levelComplete1.style.display = "block";
        }        
        $("#results5").html(message);
    }
    catch(err) {
            $("#results5").html("Your code threw an exception: " + err);
    }
}

// Exit test
function exit(){
    takingTest = false; 
    questionBlock1.style.display = "none";
    questionBlock2.style.display = "none";
    questionBlock3.style.display = "none";
    questionBlock4.style.display = "none";
    questionBlock5.style.display = "none";
    gameBlock.style.display = "block";
    element.requestPointerLock();
}

// test for correct answers

document.getElementById("submitCode1").onclick = testResults1;
document.getElementById("submitCode2").onclick = testResults2;
document.getElementById("submitCode3").onclick = testResults3;
document.getElementById("submitCode4").onclick = testResults4;
document.getElementById("submitCode5").onclick = testResults5;

document.getElementById("exitTest1").addEventListener("click", event => exit());
document.getElementById("exitTest2").addEventListener("click", event => exit());
document.getElementById("exitTest3").addEventListener("click", event => exit());
document.getElementById("exitTest4").addEventListener("click", event => exit());
document.getElementById("exitTest5").addEventListener("click", event => exit());
   

main();