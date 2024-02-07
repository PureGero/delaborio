import Scene from './renderer/scene';
import * as THREE from 'three';
import { NoiseFunction2D, createNoise2D } from 'simplex-noise';
import alea from 'alea';
import Entity from './entity';
import Maze from './maze';

class BlockMap {
  map: Map<number, THREE.Mesh> = new Map();

  get(x: number, y: number): THREE.Mesh | undefined {
    return this.map.get(this.key(x, y));
  }

  set(x: number, y: number, mesh: THREE.Mesh) {
    this.map.set(this.key(x, y), mesh);
  }

  remove(x: number, y: number) {
    this.map.delete(this.key(x, y));
  }

  private key(x: number, y: number): number {
    return Math.floor(x) + Math.floor(y) * 256 * 256;
  }
}

export default class World {
  renderDistance = 40;

  scene: Scene;

  blocks: BlockMap = new BlockMap();
  entities: Entity[] = [];
  maze: Maze = new Maze(10, 10, alea(0));

  noise2D: NoiseFunction2D[] = new Array(100).fill(0).map((v, i) => createNoise2D(alea(i)));

  lastRenderPosition: THREE.Vector3 | undefined;

  constructor(scene: Scene) {
    this.scene = scene;
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
      this.removeBlock(x, y);
    }
    
    block.position.set(x, y, block.position.z);
    this.blocks.set(x, y, block);
    this.scene.scene.add(block);
  }

  removeBlock(x: number, y: number) {
    const block = this.blocks.get(x, y);
    if (block) {
      this.scene.scene.remove(block);
      this.blocks.remove(x, y);
    }
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

  render(position: THREE.Vector3) {
    if (this.lastRenderPosition !== undefined && Math.floor(this.lastRenderPosition.x) === Math.floor(position.x) && Math.floor(this.lastRenderPosition.y) === Math.floor(position.y)) {
      // Hasn't moved, don't rerender
      return;
    }

    const distanceMoved = this.lastRenderPosition ? Math.ceil(Math.max(Math.abs(this.lastRenderPosition.x - position.x), Math.abs(this.lastRenderPosition.y - position.y))) : 0;

    this.lastRenderPosition = position.clone();

    for (let x = Math.floor(position.x) - this.renderDistance - distanceMoved; x <= Math.floor(position.x) + this.renderDistance + distanceMoved; x++) {
      for (let y = Math.floor(position.y) - this.renderDistance - distanceMoved; y <= Math.floor(position.y) + this.renderDistance + distanceMoved; y++) {
        const insideRenderDistance = Math.abs(x - position.x) < this.renderDistance && Math.abs(y - position.y) < this.renderDistance;
        const blockExists = !!this.blocks.get(x, y);
        if (!blockExists && insideRenderDistance) {
          this.generateBlock(x, y);
        } else if (blockExists && !insideRenderDistance) {
          this.removeBlock(x, y);
        }
      }
    }
  }

  generateBlock(x: number, y: number) {
    let z = 0;
    for (let i = 0; i < 10; i++) {
      const v = Math.pow(2, i) * 0.25;
      z += this.noise2D[i](x / v / 100, y / v / 100) * v;
    }

    let color = 0;
    color |= 0x00ff00;
    color |= alea(x + y * 65536)() * 0xffffff;

    if (x >= 0 && y >= 0 && x < this.maze.width * 2 && y < this.maze.height * 2) {
      if (x % 2 === 0 && y % 2 === 0) {
        color = 0xffffff;
      } else if (x % 2 === 1 && y % 2 === 1) {
        color = 0x000000;
      } else if (x % 2 === 0 && y % 2 === 1) {
        color = this.maze.isConnected(Math.floor(x / 2), Math.floor(y / 2), this.maze.NORTH) ? 0xffffff : 0x000000;
      } else if (x % 2 === 1 && y % 2 === 0) {
        color = this.maze.isConnected(Math.floor(x / 2), Math.floor(y / 2), this.maze.EAST) ? 0xffffff : 0x000000;
      }
    }

    this.createBlock(x, y, z, color);
  }
}

