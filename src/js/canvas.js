import utils, { randomIntFromRange, randomColor, distance, rotate, resolveCollision } from './utils'

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

document.body.style.overflow = 'hidden';

const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2
}

const colors = ['#2185C5', '#7ECEFD', '#FF7F66']

// Event Listeners
addEventListener('mousemove', (event) => {
  mouse.x = event.clientX
  mouse.y = event.clientY
})

addEventListener('resize', () => {
  canvas.width = innerWidth
  canvas.height = innerHeight

  init()
})

// Objects
class Particle {
  constructor(x, y, radius, color) {
    this.x = x
    this.y = y
    this.velocity = {
      x: (Math.random() - 0.5) * 2,
      y: (Math.random() - 0.5) * 2,
    }
    this.radius = radius;
    this.color = color;
    this.mass = 1;
    this.opacity = 0;
  }

  draw() {
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.save();
    c.globalAlpha = this.opacity;
    c.fillStyle = this.color;
    c.fill();
    c.restore();
    c.strokeStyle = this.color
    c.stroke()
    c.closePath()
  }

  update(particles) {
    this.draw();

    /* for (let i = 0; i < particles.length; i++) {
      if(this === particles[i]) continue;
      if (distance(this.x, this.y, particles[i].x, particles[i].y) - this.radius * 2 < 0) {
        console.log("has collided");
      }
    } */

    for (let particle of particles) {
      if (this === particle) continue;
      if (distance(this.x, this.y, particle.x, particle.y) - this.radius * 2 < 0) {
        resolveCollision(this, particle)
      }
    }

    if (this.x - this.radius <= 0 || this.x + this.radius >= innerWidth ) {
      this.velocity.x = -this.velocity.x;
    }

    if (this.y - this.radius <= 0 || this.y + this.radius >= innerHeight ) {
      this.velocity.y = -this.velocity.y;
    }

    // Mouse collision detection

    if (distance(mouse.x, mouse.y, this.x, this.y) < 120 && this.opacity < 0.2) {
      this.opacity += 0.02
    }
    else if (this.opacity > 0) {
      this.opacity -= 0.02
      this.opacity = Math.max(0, this.opacity)
    }

    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}

// Implementation
let particles;

function init() {
  particles = [];

  for (let i = 0; i < 100; i++) {
    let radius = 15;
    let x = randomIntFromRange(radius, canvas.width - radius);
    let y = randomIntFromRange(radius, canvas.height - radius);
    let color = randomColor(colors);
    if(i !== 0){
      for (let j = 0;  j < particles.length; j++){
        if (distance(x, y, particles[j].x, particles[j].y) - radius * 2 < 0){
          x = randomIntFromRange(radius, canvas.width - radius);
          y = randomIntFromRange(radius, canvas.height - radius);
          j = -1;
        }
      }
    }
    particles.push(new Particle(x, y, radius, color))
  }
  console.log(particles);
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate)
  c.clearRect(0, 0, canvas.width, canvas.height)

  for(const particle of particles) {
    particle.update(particles)
  }
}

init()
animate()
