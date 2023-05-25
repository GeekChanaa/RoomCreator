import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
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
    // Scene
    let scene = new THREE.Scene();
    // scene.background = new THREE.Color(0xdddddd);
    
    // // Renderer
    // let renderer = new THREE.WebGLRenderer({ antialias: true });
    // renderer.setSize(window.innerWidth, window.innerHeight);
    // document.body.appendChild(renderer.domElement);

    // // Camera
    // let camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 5000);
    // camera.position.set(0, 0, 100);
    // camera.lookAt(0, 0, 0);

    // // Controls
    // let controls = new OrbitControls(camera, renderer.domElement);

    // // Plane
    // const geometry = new THREE.PlaneGeometry( 1, 1 );
    // const material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
    // const plane = new THREE.Mesh( geometry, material );
    // scene.add( plane );

    // // Light
    // let light = new THREE.PointLight(0xffffff, 1);
    // light.position.set(0, 100, 100);
    // scene.add(light);

    // let animate = function () {
    //     requestAnimationFrame(animate);
    //     renderer.render(scene, camera);
    // };

    // animate();


    // Create a camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Create a renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Resize the canvas when the window size changes
    window.addEventListener('resize', function () {
        const width = window.innerWidth;
        const height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(0, 1, 1).normalize();
    scene.add(directionalLight);

    // Load a GLTF model
    const loader = new GLTFLoader();
    loader.load('/assets/gltf/Anna_FBX.gltf', function (gltf) {
        scene.add(gltf.scene);
    }, undefined, function (error) {
        console.error(error);
    });

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();

}


}
