import Scene from './renderer/scene';
import * as THREE from 'three';
import { NoiseFunction2D, createNoise2D } from 'simplex-noise';
import alea from 'alea';
import Entity from './entity';
import Maze from './maze';

class CoordMap<T> {
  map: Map<number, T> = new Map();

  get(x: number, y: number): T | undefined {
    return this.map.get(this.key(x, y));
  }

  getOrGenerate(x: number, y: number, generate: (key: number) => T): T {
    const existing = this.get(x, y);
    if (existing) {
      return existing;
    }

    const generated = generate(this.key(x, y));
    this.set(x, y, generated);
    return generated;
  }

  set(x: number, y: number, value: T) {
    this.map.set(this.key(x, y), value);
  }

  remove(x: number, y: number) {
    this.map.delete(this.key(x, y));
  }

  private key(x: number, y: number): number {
    return Math.floor(x) + Math.floor(y) * 256 * 256 * 7;
  }
}

export default class World {
  renderDistance = 40;

  scene: Scene;

  blocks: CoordMap<THREE.Mesh> = new CoordMap();
  entities: Entity[] = [];
  mazes: CoordMap<Maze> = new CoordMap();
  masterMazes: CoordMap<Maze> = new CoordMap();

  noise2D: NoiseFunction2D[] = new Array(100).fill(0).map((v, i) => createNoise2D(alea(i)));

  lastRenderPosition: THREE.Vector3 | undefined;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  createBlock(x: number, y: number, z: number, color: number) {
    const geometry = new THREE.BoxGeometry( 1, 1, 4 ); 
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
      block.geometry.dispose();
      new Array(0).concat(block.material).forEach(mat => mat.dispose());
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

    if (this.isMazeWall(x, y)) {
      color = 0x101010;
      z += 3;
    } else {
      color |= 0x00ff00;
      color |= alea(x + y * 65536)() * 0xffffff;
    }

    this.createBlock(x, y, z, color);
  }

  isMazeWall(x: number, y: number): boolean {
    const cellSize = 8;
    const mazeSize = 18;
    const masterMazeSize = 51;
    const actualMazeSize = mazeSize - 1;

    x += mazeSize * cellSize / 2 - cellSize / 2;
    y += mazeSize * cellSize / 2 - cellSize / 2;
    x = Math.floor(x);
    y = Math.floor(y);

    const mazeX = Math.floor((x - 1) / cellSize / mazeSize); // The first x in the maze belongs to the wall of the previous maze
    const mazeY = Math.floor((y - 1) / cellSize / mazeSize); // The first y in the maze belongs to the wall of the previous maze
    const cellX = mod(Math.floor(x / cellSize), mazeSize);
    const cellY = mod(Math.floor(y / cellSize), mazeSize);

    x = mod(x, mazeSize * cellSize);
    y = mod(y, mazeSize * cellSize);

    // Master maze
    if (x === 0 || y === 0 || cellX >= actualMazeSize || cellY >= actualMazeSize) {
      const masterMaze = this.masterMazes.getOrGenerate(mazeX, mazeY, key => new Maze(masterMazeSize, masterMazeSize, alea(`mastermaze${key}`), 1));
      const masterCellX = mod(Math.floor(mazeX + masterMaze.width / 2), masterMaze.width);
      const masterCellY = mod(Math.floor(mazeY + masterMaze.height / 2), masterMaze.height);
      if (x > actualMazeSize * cellSize / 2 - cellSize / 3 && x < actualMazeSize * cellSize / 2 + cellSize / 3) {
        if (masterCellY === masterMaze.height - 1) {
          return masterCellX !== Math.floor(masterMaze.width / 2);
        }
        return !masterMaze.isConnected(masterCellX, masterCellY, masterMaze.NORTH);
      } else if (y > actualMazeSize * cellSize / 2 - cellSize / 3 && y < actualMazeSize * cellSize / 2 + cellSize / 3) {
        if (masterCellX === masterMaze.width - 1) {
          return masterCellY !== Math.floor(masterMaze.height / 2);
        }
        return !masterMaze.isConnected(masterCellX, masterCellY, masterMaze.EAST);
      } else {
        return true;
      }
    }

    // Regular maze
    if (x % cellSize !== 0 && y % cellSize !== 0) {
      return false;
    }

    const maze = this.mazes.getOrGenerate(mazeX, mazeY, key => new Maze(actualMazeSize, actualMazeSize, alea(key), 3));

    if (x % cellSize === 0 && y % cellSize === 0) {
      return !(maze.isConnected(cellX, cellY, maze.SOUTH) && maze.isConnected(cellX, cellY, maze.WEST) && maze.isConnected(cellX - 1, cellY, maze.SOUTH) && maze.isConnected(cellX, cellY - 1, maze.WEST));
    } else if (x % cellSize === 0) {
      return !maze.isConnected(cellX, cellY, maze.WEST);
    } else {
      return !maze.isConnected(cellX, cellY, maze.SOUTH);
    }
  }
}

const mod = (n: number, m: number): number => (n % m + m) % m;