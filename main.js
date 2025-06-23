// sconst { position } = require("html2canvas/dist/types/css/property-descriptors/position");

const canvas = document.querySelector('canvas');
// "c" stands for "context"
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

const collisionsMap = [];
for (let i = 0; i < collisions.length; i+= 70) {
    collisionsMap.push(collisions.slice(i, 70 + i));
}

class Boundary {
    static width = 48
    static height = 48
    constructor({ position }) {
        this.position = position
        this.width = 48
        this.height = 48
    }
    draw() {
        c.fillStyle = 'red';
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}
const boundaries = [];
const offset = {
    x: -1121,
    y: -900
}

collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1025) {
             boundaries.push(
                new Boundary({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y
                    }
                })
            )
        }
       
    })
})

console.log(boundaries)

c.fillStyle = 'white';
c.fillRect(0, 0, canvas.width, canvas.height);

const image = new Image();
image.src = './img/PokemonStyleGameMap1.png';

const playerImage = new Image();
playerImage.src = './img/playerDown.png';

class Sprite {
    constructor({ position, velocity, image, frames = { max: 1 } }) {
        this.position = position
        this.image = image
        // this.velocity = velocity
        this.frames = frames

        this.image.onload = () => {
            this.width = this.image.width / this.frames.max
            this.height = this.image.height
            console.log(this.height)
            console.log(this.width)
        }
        
    }

    draw() {
        c.drawImage(
        this.image,
        // cropping
        0,
        0,
        this.image.width / this.frames.max,
        this.image.height,
        // actual image rendered
        this.position.x,
        this.position.y,
        this.image.width / this.frames.max,
        this.image.height
        )
    }
}
     // 
     // 

const player = new Sprite({
    position: {
        x: canvas.width / 2 - 192 / 4 / 2,
        y: canvas.height / 2 - 68 / 2,
    },
    image: playerImage,
    frames: {
        max: 4
    }
})

const background = new Sprite({ 
    position: {
        x: offset.x,
        y: offset.y
    },
    image: image
});

const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    }
}

const movables = [background, ...boundaries]

//rectangle 1 = player
function rectangularCollision({rectangle1, rectangle2}) {
    return (
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x && 
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y    
    )
}
function animate() {
    window.requestAnimationFrame(animate);
    background.draw();
    
    player.draw();
    boundaries.forEach((boundary) => {
         boundary.draw();

          if (
            rectangularCollision({
                rectangle1: player,
                rectangle2: boundary
            })
            ) {
                console.log('colliding!');
            }
    });
   

  
    
   if (keys.w.pressed && lastKey === 'w') {
    movables.forEach(moveable => {moveable.position.y += 3})
   }
   else if (keys.a.pressed && lastKey === 'a') {
    movables.forEach(moveable => {moveable.position.x += 3})
   }
   else if (keys.s.pressed && lastKey === 's') {
    movables.forEach(moveable => {moveable.position.y -= 3})
   }
   else if (keys.d.pressed && lastKey === 'd') {
    movables.forEach(moveable => {moveable.position.x -= 3})
   }
}

animate();

let lastKey = '';

// move player 
window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'w':
            keys.w.pressed = true
            lastKey = 'w'
            break 

        case 'a':
            keys.a.pressed = true
            lastKey = 'a'
            break 

        case 's':
            keys.s.pressed = true
            lastKey = 's'
            break 

        case 'd':
            keys.d.pressed = true
            lastKey = 'd'
            break 
    }
});

window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'w':
            keys.w.pressed = false
            break 

        case 'a':
            keys.a.pressed = false
            break 

        case 's':
            keys.s.pressed = false
            break 

        case 'd':
            keys.d.pressed = false
            break 
    }
})