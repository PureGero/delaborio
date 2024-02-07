import * as THREE from "three";

export default class Entity {
  mesh: THREE.Mesh = this.generateMesh();
  position: THREE.Vector3 = new THREE.Vector3();

  constructor() {
    this.mesh = this.generateMesh();
  }

  generateMesh() {
    const geometry = new THREE.CylinderGeometry( 0.4, 0.4, 1, 32 );
    const material = new THREE.MeshStandardMaterial( { color: 0xff0000 } ); 
    const cube = new THREE.Mesh( geometry, material ); 
    cube.rotation.x = Math.PI / 2;
    return cube;
  }

  setPosition(position: THREE.Vector3) {
    this.position = position;
    this.mesh.position.x = this.position.x - 0.4;
    this.mesh.position.y = this.position.y - 0.4;
    this.mesh.position.z = this.position.z;
  }
}