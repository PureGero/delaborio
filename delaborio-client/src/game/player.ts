import * as THREE from "three";
import Entity from "./entity";
import Game from "./game";

const W_KEY = 87;
const A_KEY = 65;
const S_KEY = 83;
const D_KEY = 68;

export default class Player extends Entity {
  mesh: THREE.Mesh = this.generateMesh();
  position: THREE.Vector3 = new THREE.Vector3();

  generateMesh() {
    const geometry = new THREE.CylinderGeometry( 0.4, 0.4, 1, 32 );
    const material = new THREE.MeshStandardMaterial( { color: 0x0000ff } ); 
    const cube = new THREE.Mesh( geometry, material ); 
    cube.rotation.x = Math.PI / 2;
    return cube;
  }

  tick(game: Game, diff: number) {
    const speed = 0.003 * diff;
    if (game.keysDown.has(W_KEY)) {
      this.position.x -= speed;
      this.position.y += speed;
    }
    if (game.keysDown.has(A_KEY)) {
      this.position.x -= speed;
      this.position.y -= speed;
    }
    if (game.keysDown.has(S_KEY)) {
      this.position.x += speed;
      this.position.y -= speed;
    }
    if (game.keysDown.has(D_KEY)) {
      this.position.x += speed;
      this.position.y += speed;
    }

    let nz = this.position.z - 0.01 * diff;
    let blockStandingOn = game.world.getBlock(this.position.x, this.position.y);
    let blockz = (blockStandingOn?.position.z || 0) + 1;
    if (nz < blockz) {
      nz = blockz;
    }
    this.position.z = nz;

    game.scene.setCameraTarget(this.position.x, this.position.y, this.position.z);
    this.setPosition(this.position);

    game.world.render(this.position);
  }
}