import * as THREE from '../build/three.module.js';
import {GLTFLoader} from '../jsm/loaders/GLTFLoader.js';
import {OrbitControls} from '../jsm/controls/OrbitControls.js';
import {FirstPersonControls} from '../jsm/controls/FirstPersonControls.js';
import {PointerLockControls} from '../jsm/controls/PointerLockControls.js';
import {FlyControls} from '../jsm/controls/FlyControls.js';


export var moveForward = false;
export var moveBackward = false;
export var moveLeft = false;
export var moveRight = false;
export var collidableObjects = [];




export function loadgltfModel(modelURL,scene,posX,posY,posZ) {
    var loader = new GLTFLoader();
      

    loader.load(
        // resource URL
        modelURL,
        
        // called when the resource is loaded
        function ( gltf ) {

            gltf.scene.traverse( child => {
                if ( child.material ) child.material.metalness = 0.1;
                child.position.set(posX,posY,posZ);
                collidableObjects.push(child);
                
                
            } );
            scene.add( gltf.scene );
            }
    );
}

    // A key has been pressed
export function onKeyDown(event) {

    // if(detectPlayerCollision() == false) {
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
    //}}else{
    //    moveForward = false;
    //    moveLeft = false;
    //    moveBackward = false;
    //    moveRight = false;

    }
}


// A key has been released
export function onKeyUp(event) {

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
    }

export function dumpObject(obj, lines = [], isLast = true, prefix = '') {
    const localPrefix = isLast ? '└─' : '├─';
    lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]`);
    const newPrefix = prefix + (isLast ? '  ' : '│ ');
    const lastNdx = obj.children.length - 1;
    obj.children.forEach((child, ndx) => {
        const isLast = ndx === lastNdx;
        dumpObject(child, lines, isLast, newPrefix);
    });
    return lines;
}

export function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
  }
  
export function radiansToDegrees(radians) {
    return radians * 180 / Math.PI;
  }
  
  export function rayIntersect(ray, distance) {
      var intersects = ray.intersectObjects(collidableObjects);
      for (var i = 0; i < intersects.length; i++) {
          // Check if there's a collision
          if (intersects[i].distance < distance) {
              return true;
          }
      }
      return false;
  }

export function addCube(H,W,D, texture, p1,p2,p3, scene){
    var geometry = new THREE.CubeGeometry(H,W,D);
    var texture = new THREE.TextureLoader().load( texture );
    var material = new THREE.MeshBasicMaterial( {map: texture } );

   var mesh = new THREE.Mesh( geometry, material );
   mesh.position.set(p1,p2,p3);
   console.log("adding mesh");
  //scene is global
 scene.add(mesh);
 collidableObjects.push(mesh);
return mesh;
}