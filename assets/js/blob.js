let points;
let joints;

function setup() {
	let canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0, 0);
  
	colorMode(HSB, 360, 100, 100, 100);

	points = [];
	joints = [];

	const pointCount = 80;
	const radius = min(width, height) * 0.3;
	for (let i = 0; i < pointCount; i++) {
		const angle = (i / pointCount) * TWO_PI;
		const x = cos(angle) * radius;
		const y = sin(angle) * radius;
		points.push(new Point({ x, y, damping: 0.99 }));
	}

	for (let i = 0, l = points.length; i < l; i++) {
		const pointA = points[i];
		const pointB = points[(i + 1) % l];
		const pointC = points[(i + 2) % l];
		const pointD = points[floor(i + l / 2) % l];
		joints.push(new Joint(pointA, pointB, 10, 0.75));
		joints.push(new Joint(pointA, pointC, 20, 0.5));
		joints.push(new Joint(pointA, pointD, radius * 2, 0.0125));
	}
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
	const hw = width / 2;
	const hh = height / 2;
  clear();
	noStroke();
	fill(0);

	translate(hw, hh);

	for (let i = 0, l = joints.length; i < l; i++) {
		joints[i].update(1);
	}

	const mx = mouseX - hw;
	const my = mouseY - hh;

	for (let i = 0, l = points.length; i < l; i++) {
		const pointA = points[i];
		const gravity = createVector(pointA.x, pointA.y).normalize().mult(0.1);
		pointA.addForce(-gravity.x, -gravity.y);
		pointA.collide(mx, my, 80);
		for (let j = i + 1; j < l; j++) {
			const pointB = points[j];
			const force = pointA.repel(pointB.x, pointB.y, 100, 0.1);
			if (force) {
				pointB.addForce(-force.x, -force.y);
			}
		}
		pointA.update(0.5);
		pointA.constrain(-hw, -hh, hw, hh);
	}

	beginShape();
	for (let i = 0, l = points.length; i < l; i++) {
		curveVertex(points[i].x, points[i].y);
	}
	endShape(CLOSE);
}

class Point {
	constructor({ x, y, radius, damping, friction, parent, color = 0 }) {
		this.x = x;
		this.y = y;
		this.oldx = x;
		this.oldy = y;
		this.nextx = x;
		this.nexty = y;
		this.delayedx = x;
		this.delayedy = y;
		this.radius = radius || 10;
		this.originalRadius = radius;
		this.damping = damping || 0.9;
		this.friction = friction || 0.1;
		this.parent = parent;
		this.maxVelocity = 50;
		this.color = color;
	}

	addForce(x, y, instant = false) {
		this.nextx += x;
		this.nexty += y;
		if (instant) {
			this.delayedx = lerp(this.delayedx, this.nextx, 0.25);
			this.delayedy = lerp(this.delayedy, this.nexty, 0.25);
		}
	}

	attract(otherX, otherY, strength = 1) {
		const diffx = otherX - this.x;
		const diffy = otherY - this.y;
		const mag = diffx * diffx + diffy * diffy;
		if (mag > 0.01) {
			const magSqrt = 1 / sqrt(mag);
			this.addForce(
				diffx * magSqrt * strength, // force x
				diffy * magSqrt * strength // force y
			);
		}
	}

	repel(otherX, otherY, radius = 1, strength = 1) {
		const diffx = this.x - otherX;
		const diffy = this.y - otherY;
		const mag = diffx * diffx + diffy * diffy;
		const combinedRadius = radius + this.radius;
		const minDist = combinedRadius * combinedRadius;
		if (mag > 0 && mag < minDist) {
			const magSqrt = 1 / sqrt(mag);
			const forceX = diffx * magSqrt * strength;
			const forceY = diffy * magSqrt * strength;
			this.addForce(forceX, forceY);
			return { x: forceX, y: forceY };
		}

		return null;
	}

	collide(otherX, otherY, radius) {
		const diffx = otherX - this.x;
		const diffy = otherY - this.y;
		const diffMag = sqrt(diffx * diffx + diffy * diffy);
		const combinedRadius = radius + this.radius;
		if (diffMag < combinedRadius) {
			const forceMag = diffMag - combinedRadius;
			const invMag = 1 / diffMag;
			this.addForce(diffx * invMag * forceMag, diffy * invMag * forceMag, true);
		}
	}

	constrain(left, top, right, bottom) {
		const { x, y, oldx, oldy, friction, radius } = this;
		const vx = (x - oldx) * friction;
		const vy = (y - oldy) * friction;

		left += radius;
		top += radius;
		right -= radius;
		bottom -= radius;

		if (x > right) {
			this.x = right;
			this.oldx = x + vx;
		} else if (x < left) {
			this.x = left;
			this.oldx = x + vx;
		}
		if (y > bottom) {
			this.y = bottom;
			this.oldy = y + vy;
		} else if (y < top) {
			this.y = top;
			this.oldy = y + vy;
		}
	}

	update(dt = 1) {
		let vx = this.x - this.oldx;
		let vy = this.y - this.oldy;
		this.oldx = this.x - vx * this.damping * (1 - dt);
		this.oldy = this.y - vy * this.damping * (1 - dt);
		this.x = this.nextx + vx * this.damping * dt;
		this.y = this.nexty + vy * this.damping * dt;
		this.delayedx = lerp(this.delayedx, this.x, 0.1);
		this.delayedy = lerp(this.delayedy, this.y, 0.1);
		this.nextx = this.x;
		this.nexty = this.y;
	}

	draw(ctx) {
		ctx.point(this.delayedx, this.delayedy);
	}
}

class Joint {
	constructor(pointA, pointB, len, strength) {
		this.pointA = pointA;
		this.pointB = pointB;
		this.originalLen = len;
		this.len = len;
		this.strength = strength;
	}

	update(dt = 1) {
		const diffx = this.pointA.x - this.pointB.x;
		const diffy = this.pointA.y - this.pointB.y;
		const mag = sqrt(diffx * diffx + diffy * diffy);
		const diffMag = this.len - mag;
		if (mag > 0) {
			const invMag = 1 / mag;
			const forceX = diffx * invMag * diffMag * this.strength * 0.5 * dt;
			const forceY = diffy * invMag * diffMag * this.strength * 0.5 * dt;
			this.pointA.addForce(forceX, forceY);
			this.pointB.addForce(-forceX, -forceY);
		}
	}

	draw(ctx) {
		ctx.line(this.pointA.x, this.pointA.y, this.pointB.x, this.pointB.y);
	}
}
