import Scene from './renderer/scene';
import * as THREE from 'three';
import { createNoise2D } from 'simplex-noise';
import alea from 'alea';
import Entity from './entity';

class BlockMap {
  map: Map<number, THREE.Mesh> = new Map();

  get(x: number, y: number): THREE.Mesh | undefined {
    return this.map.get(this.key(x, y));
  }

  set(x: number, y: number, mesh: THREE.Mesh) {
    this.map.set(this.key(x, y), mesh);
  }

  private key(x: number, y: number): number {
    return Math.floor(x) + Math.floor(y) * 256 * 256;
  }
}

export default class World {
  scene: Scene;

  blocks: BlockMap = new BlockMap();
  entities: Entity[] = [];

  noise2D = createNoise2D(alea('delaborious'));

  constructor(scene: Scene) {
    this.scene = scene;

    for (let x = -10; x < 10; x++) {
      for (let y = -10; y < 10; y++) {
        this.createBlock(x, y, this.noise2D(x / 20, y / 20), 0x00ff00 | (Math.random() * 0xffffff));
      }
    }

    this.createBlock(0, 0, this.noise2D(0, 0), 0xffffff);
  }

  createBlock(x: number, y: number, z: number, color: number) {
    const geometry = new THREE.BoxGeometry( 1, 1, 1 ); 
    const material = new THREE.MeshStandardMaterial( {color} ); 
    const cube = new THREE.Mesh( geometry, material ); 
    cube.position.set(x, y, z);
    this.setBlock(x, y, cube);
    return cube;
  }

  setBlock(x: number, y: number, block: THREE.Mesh) {
    const existing = this.blocks.get(x, y);
    if (existing) {
      this.scene.scene.remove(existing);
    }
    
    block.position.set(x, y, block.position.z);
    this.blocks.set(x, y, block);
    this.scene.scene.add(block);
  }

  getBlock(x: number, y: number): THREE.Mesh | undefined {
    return this.blocks.get(x, y);
  }

  createEntity(x: number, y: number, z: number, color: number) {
    const entity = new Entity();
    this.addEntity(entity);
    return entity;
  }

  addEntity(entity: Entity) {
    this.entities.push(entity);
    this.scene.scene.add(entity.mesh);
  }
}

