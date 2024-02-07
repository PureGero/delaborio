import * as THREE from 'three';

export default class Scene {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  ambientLight = new THREE.PointLight(0xffffff, 2, 0, 0);

  constructor() {
    this.setCameraTarget(0, 0, 0);

    this.ambientLight.position.set(0, 0, 5);
    this.scene.add(this.ambientLight);
    this.scene.background = new THREE.Color(0xFFFFFF);
  }

  setCameraTarget(x: number, y: number, z: number) {
    const zoom = 10;
    this.camera.position.set(x + zoom / 2, y - zoom / 2, z + zoom);
    this.camera.rotation.x = Math.PI / 8;
    this.camera.rotation.y = Math.PI / 8;
    this.camera.rotation.z = Math.PI / 4;
  }
}