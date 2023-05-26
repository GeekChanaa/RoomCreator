import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
@Component({
  selector: 'app-plan-designer',
  templateUrl: './plan-designer.component.html',
  styleUrls: ['./plan-designer.component.css']
})
export class PlanDesignerComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    this.createScene();
  }

  createScene() {
    // Create the scene
    var scene = new THREE.Scene();

    // Create the camera
    let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 4000);
    camera.position.z = 1000;

    // Create the renderer
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Configuring Controls 
    this.configureControls(camera,renderer);

    // Define your points
    var points = [
      { x: 350, y: 148 },
      { x: 800, y: 148 },
      { x: 800, y: 298 },
      { x: 1002, y: 298 },
      { x: 1002, y: 448 },
      { x: 348, y: 448 },
      { x: 348, y: 147 }
    ];



    // Creating the walls of the room
    var wallsGroup = this.createWalls(points);
    
    wallsGroup.position.y = -300 / 2
    scene.add(wallsGroup);
    scene.background = new THREE.Color(0xFFFFFF);

    // After rotating the group, reposition the camera
    camera.lookAt(wallsGroup.position);

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    animate();
  }




  
  // Configuring controls function
  configureControls(camera : THREE.PerspectiveCamera , renderer : THREE.WebGLRenderer ){
    // Adding controls to the scene
    var controls = new OrbitControls( camera, renderer.domElement );
    // This will prevent panning up and down.
    controls.enablePan = false; 

    // This will restrict zooming in and out.
    controls.enableZoom = false; 

    // This will disable rotation around X and Z axis.
    controls.enableRotate = true; 
    controls.minPolarAngle = Math.PI/2; 
    controls.maxPolarAngle = Math.PI/2;

    // These will ensure that the rotation is only around Y-axis.
    controls.minAzimuthAngle = - Infinity; 
    controls.maxAzimuthAngle = Infinity; 
  }

  // Creatign walls for the room
  createWalls(points : any[]) : THREE.Group{
    // Define the material for the line
    let material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
    let group = new THREE.Group();

    for (let i = 0; i < points.length - 1; i++) {
      let startPoint = points[i];
      let endPoint = points[i + 1];

      let distance = Math.sqrt(
        Math.pow(startPoint.x - endPoint.x, 2) +
        Math.pow(startPoint.y - endPoint.y, 2)
      );

      let midpointX = (startPoint.x + endPoint.x) / 2;
      let midpointY = (startPoint.y + endPoint.y) / 2;

      let wallHeight = 300; // Define the height of the wall

      let wallGeometry = new THREE.BoxGeometry(distance, wallHeight, 1);
      let wall = new THREE.Mesh(wallGeometry, material);

      wall.position.set(midpointX, wallHeight / 2, midpointY);

      let angle = Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x);
      wall.rotation.set(0, -angle, 0);

      group.add(wall);
      
    }
    return group;
  }

}
