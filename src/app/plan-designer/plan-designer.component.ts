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
    camera.position.z = 100;

    // Create the renderer
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Configuring Controls 
    this.configureControls(camera,renderer);

    // Define your points
    var points = [
      { x: -580, y: -580 },
      { x: 620, y: -580 },
      { x: 620, y: 620 },
      { x: -580, y: 620 },
      { x: -580, y: -580 }
    ];




    // Creating the walls of the room
    var wallsGroup = this.createWalls(points);
    
    wallsGroup.position.y = -300 / 2
    scene.add(wallsGroup);

    const axesHelper = new THREE.AxesHelper( 5 );
    scene.add( axesHelper );
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
    controls.enableZoom = true; 

    // This will disable rotation around X and Z axis.
    controls.enableRotate = true; 
    controls.minPolarAngle = 0; 
    controls.maxPolarAngle = Math.PI;

    // These will ensure that the rotation is only around Y-axis.
    controls.minAzimuthAngle = - Infinity; 
    controls.maxAzimuthAngle = Infinity; 
  }

  // Creatign walls for the room
  createWalls(points : any[]) : THREE.Group{
    // Define the material for the line
    let material = new THREE.MeshStandardMaterial({ color: 0x0000ff });
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

      let wallHeight = 600; // Define the height of the wall

      let wallGeometry = new THREE.BoxGeometry(distance, wallHeight, 40);
      let wall = new THREE.Mesh(wallGeometry, material);

      wall.position.set(-midpointX, wallHeight / 2, midpointY);

      let angle = Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x);
      wall.rotation.set(0, -angle, 0);

      group.add(wall);
      
    }
    const box = new THREE.Box3().setFromObject(group);
    const center = new THREE.Vector3();
    box.getCenter(center);
    let pointLight = new THREE.PointLight(0xffffff, 1); 

    // Assuming 'points' is your array of 2D points
    let shape = new THREE.Shape();

    // Start from the first point
    shape.moveTo(points[0].x-200, points[0].y+200);

    // Then go through each point
    for (let i = 1; i < points.length; i++) {
      shape.lineTo(points[i].x-200, points[i].y+200);
    }

    // Calculate the center point
    let centerX = points.reduce((sum, p) => sum + p.x, 0) / points.length;
    let centerY = points.reduce((sum, p) => sum + p.y, 0) / points.length;

    // Define extrude settings
    let extrudeSettings = {
      depth: 10,  // The amount of extrusion, i.e., the height of the plane
      bevelEnabled: false  // No bevel for the edges
    };

    // Create geometry
    let geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

    // Create material
    let materialss = new THREE.MeshBasicMaterial({ color: 0xffff00 });

    // Create mesh
    let plane = new THREE.Mesh(geometry, materialss);

    // Create mesh roof
    let roof = new THREE.Mesh(geometry, materialss);
    roof.position.set(-centerX, -extrudeSettings.depth / 2, -centerY);


    // Rotate the plane 90 degrees around the X-axis
    plane.rotation.x = -Math.PI / 2;
    roof.rotation.x = -Math.PI / 2;

    // Translate the plane to the center
    plane.position.set(-centerX, -extrudeSettings.depth / 2, -centerY);

    // Add to your scene or group
    group.add(plane);
    group.add(roof);

    // Add to your scene or group
    const boxx = new THREE.Box3().setFromObject(plane);
    const centerr = new THREE.Vector3();
    boxx.getCenter(center);

    const boxxx = new THREE.Box3().setFromObject(roof);
    const centerrr = new THREE.Vector3();
    boxxx.getCenter(center);

    roof.position.sub(center);
    roof.position.y =+ 600
    plane.position.sub(center);
    group.add(plane);

    
    group.add(pointLight);

    group.position.sub(center);
    return group;
  }

}
