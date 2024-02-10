export default class Maze {
  DIRECTIONS = [
    { x: 0, y: 1 },
    { x: 1, y: 0 },
    { x: 0, y: -1 },
    { x: -1, y: 0 },
  ];

  NORTH: number = 0;
  EAST: number = 1;
  SOUTH: number = 2;
  WEST: number = 3;

  width: number;
  height: number;
  centerSize: number;
  maze: boolean[];

  constructor(width: number, height: number, randomNumberGenerator: () => number, centerSize: number = 1) {
    this.width = width;
    this.height = height;
    this.centerSize = centerSize;
    this.maze = new Array(width * height * 2).fill(false);
    this.generateMaze(randomNumberGenerator);
  }

  generateMaze(randomNumberGenerator: () => number) {
    const cantConnectTo = new Set<number>();
    const visitedNodes = new Set<number>();
    const toVisit: number[] = [];

    if (this.centerSize <= 1) {
      toVisit.push(0);
    } else {
      const centerStartX = Math.floor(this.width / 2 - this.centerSize / 2);
      const centerEndX = Math.floor(this.width / 2 + this.centerSize / 2);
      const centerStartY = Math.floor(this.height / 2 - this.centerSize / 2);
      const centerEndY = Math.floor(this.height / 2 + this.centerSize / 2);
      for (let x = centerStartX; x < centerEndX; x++) {
        for (let y = centerStartY; y < centerEndY; y++) {
          if (y < centerEndY - 1) {
            this.connect(x, y, this.NORTH);
          }
          if (x < centerEndX - 1) {
            this.connect(x, y, this.EAST);
          }
          visitedNodes.add(x * this.height + y);
          cantConnectTo.add(x * this.height + y);
        }
      }

      for (let dir = 0; dir < 4; dir++) {
        let x = Math.floor(this.width / 2 - this.DIRECTIONS[dir].x * (this.centerSize + 1) / 2);
        let y = Math.floor(this.height / 2 - this.DIRECTIONS[dir].y * (this.centerSize + 1) / 2);
        toVisit.push(x * this.height + y);
        this.connect(x, y, dir);
      }
    }

    while (toVisit.length) {
      const current = toVisit.pop();

      if (current === undefined) {
        break;
      }

      if (visitedNodes.has(current)) {
        continue;
      }

      visitedNodes.add(current);
      
      const x = Math.floor(current / this.height);
      const y = current % this.height;

      // Find a wall to create a passage through
      for (const dir of this.randomDirectionsList(randomNumberGenerator)) {
        const nx = x + this.DIRECTIONS[dir].x;
        const ny = y + this.DIRECTIONS[dir].y;

        if (nx < 0 || ny < 0 || nx >= this.width || ny >= this.height) {
          continue;
        }

        const next = nx * this.height + ny;
        if (visitedNodes.has(next) && !cantConnectTo.has(next)){
          this.connect(x, y, dir);
          break;
        }
      }

      // Add the neighbors to the stack
      for (const dir of this.randomDirectionsList(randomNumberGenerator)) {
        const nx = x + this.DIRECTIONS[dir].x;
        const ny = y + this.DIRECTIONS[dir].y;

        if (nx < 0 || ny < 0 || nx >= this.width || ny >= this.height) {
          continue;
        }

        const next = nx * this.height + ny;
        if (!visitedNodes.has(next)) {
          toVisit.push(next);
        }
      }
    }
  }

  randomDirectionsList(randomNumberGenerator: () => number) {
    const directions = [0, 1, 2, 3];
    for (let i = 0; i < 4; i++) {
      const j = Math.floor(randomNumberGenerator() * 4);
      const temp = directions[i];
      directions[i] = directions[j];
      directions[j] = temp;
    }
    return directions;
  }

  isConnected(x: number, y: number, direction: number): boolean {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
      return false;
    }
    if (direction === 2) {
      return this.isConnected(x, y - 1, 0);
    }
    if (direction === 3) {
      return this.isConnected(x - 1, y, 1);
    }
    return this.maze[x * this.height * 2 + y * 2 + direction];
  }

  connect(x: number, y: number, direction: number) {
    if (direction === 2) {
      this.connect(x, y - 1, 0);
    } else if (direction === 3) {
      this.connect(x - 1, y, 1);
    } else {
      this.maze[x * this.height * 2 + y * 2 + direction] = true;
    }
  }
}