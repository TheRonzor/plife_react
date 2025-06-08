// ./src/simulation/SimulationEngine.ts
export interface Particle {
  id: number;
  type: number;
  x: number; // in [0,1]
  y: number; // in [0,1]
  vx: number;
  vy: number;
}

export interface ControlPoint {
  id: string;
  x: number;
  y: number;
  fixed?: boolean;
}

export class SimulationEngine {
  particles: Particle[] = [];
  interactionMatrix: number[][] = [];
  controlPoints: ControlPoint[] = [];
  dt: number = 0.01;
  goo: number = 0.1;

  constructor() {}

  setParticles(particles: Particle[]) {
    this.particles = particles;
  }

  setInteractionMatrix(matrix: number[][]) {
    this.interactionMatrix = matrix;
  }

  setControlPoints(points: ControlPoint[]) {
    this.controlPoints = points.slice().sort((a, b) => a.x - b.x);
  }

  setDt(dt: number) {
    this.dt = dt;
  }

  setGoo(goo: number) {
    this.goo = goo;
  }

  getParticles(): Particle[] {
    return this.particles;
  }

  step() {
    const N = this.particles.length;
    const forces: [number, number][] = Array(N).fill([0, 0]).map(() => [0, 0]);

    for (let i = 0; i < N; i++) {
      const pi = this.particles[i];

      for (let j = 0; j < N; j++) {
        if (i === j) continue;

        const pj = this.particles[j];

        const [dx, dy] = this.torusVector(pi.x, pi.y, pj.x, pj.y);
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist === 0) continue;

        const fx = dx / dist;
        const fy = dy / dist;

        const r1 = this.controlPoints[1].x;
        const r3 = this.controlPoints[3].x;

        let interactionScale = 1;
        if (dist > r1 && dist < r3) {
          interactionScale = this.interactionMatrix[pi.type]?.[pj.type] ?? 0;
        }
        
        const baseForce = this.forceFunction(dist);
        const forceMag = baseForce * interactionScale;

        forces[i][0] += forceMag * fx;
        forces[i][1] += forceMag * fy;
      }
    }

    // Apply forces
    for (let i = 0; i < N; i++) {
      const p = this.particles[i];
      const [fx, fy] = forces[i];

      p.vx = (1 - this.goo) * (p.vx + fx * this.dt);
      p.vy = (1 - this.goo) * (p.vy + fy * this.dt);

      p.x = (p.x + p.vx * this.dt + 1) % 1;
      p.y = (p.y + p.vy * this.dt + 1) % 1;
    }
  }

  private torusVector(ax: number, ay: number, bx: number, by: number): [number, number] {
    let dx = bx - ax;
    let dy = by - ay;

    if (dx > 0.5) dx -= 1;
    if (dx < -0.5) dx += 1;
    if (dy > 0.5) dy -= 1;
    if (dy < -0.5) dy += 1;

    return [dx, dy];
  }

  private forceFunction(dist: number): number {
    const points = this.controlPoints;
    if (points.length === 0) return 0;

    if (dist <= points[0].x) return points[0].y;

    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];

      if (dist <= p2.x) {
        const t = (dist - p1.x) / (p2.x - p1.x);
        return p1.y + t * (p2.y - p1.y);
      }
    }

    return 0;
  }
}
