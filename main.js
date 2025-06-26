// sconst { position } = require("html2canvas/dist/types/css/property-descriptors/position");
// const { opacity } = require("html2canvas/dist/types/css/property-descriptors/opacity");

// const { duration } = require("html2canvas/dist/types/css/property-descriptors/duration");
// const { opacity } = require("html2canvas/dist/types/css/property-descriptors/opacity");

const canvas = document.querySelector('canvas');
// "c" stands for "context"
const c = canvas.getContext('2d');


canvas.width = 1024;
canvas.height = 576;

const collisionsMap = [];
for (let i = 0; i < collisions.length; i+= 70) {
    collisionsMap.push(collisions.slice(i, 70 + i));
}

const battleZonesMap = [];
for (let i = 0; i < battleZonesData.length; i+= 70) {
    battleZonesMap.push(battleZonesData.slice(i, 70 + i));
}
console.log(battleZonesMap)

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

const battleZones = []

battleZonesMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1025) {
             battleZones.push(
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

console.log(battleZones)

c.fillStyle = 'white';
c.fillRect(0, 0, canvas.width, canvas.height);

const image = new Image();
image.src = './img/PokemonStyleGameMap1.png';

const foregroundImage = new Image();
foregroundImage.src = './img/foregroundObjects.png';

const playerDownImage = new Image();
playerDownImage.src = './img/playerDown.png';

const playerUpImage = new Image();
playerUpImage.src = './img/playerUp.png';

const playerLeftImage = new Image();
playerLeftImage.src = './img/playerLeft.png';

const playerRightImage = new Image();
playerRightImage.src = './img/playerRight.png';

     // 
     // 

const player = new Sprite({
    position: {
        x: canvas.width / 2 - 192 / 4 / 2,
        y: canvas.height / 2 - 68 / 2,
    },
    image: playerDownImage,
    frames: {
        max: 4,
        hold: 10
    },
    sprites: {
        up: playerUpImage,
        down: playerDownImage,
        left: playerLeftImage,
        right: playerRightImage,
    }
})

const background = new Sprite({ 
    position: {
        x: offset.x,
        y: offset.y
    },
    image: image
});

const foreground = new Sprite({ 
    position: {
        x: offset.x,
        y: offset.y
    },
    image: foregroundImage
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

const movables = [background, ...boundaries, foreground, ...battleZones]

//rectangle 1 = player
function rectangularCollision({rectangle1, rectangle2}) {
    return (
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x && 
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y    
    )
}

const battle = {

}

function animate() {
    const animationId = window.requestAnimationFrame(animate);
    background.draw();
    boundaries.forEach((boundary) => {
         boundary.draw();
    });
    battleZones.forEach(battleZone => {
        battleZone.draw()
    })
    player.draw();
    foreground.draw();

    let moving = true;
    player.animate = false

    if (battle.initiated) return

    // activate battle 
    if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
         for (let i = 0; i < battleZones.length; i++) {
            const battleZone = battleZones[i];
            const overlappingArea = (Math.min(player.position.x + player.width, 
                battleZone.position.x + battleZone.width) - Math.max(player.position.x, 
                battleZone.position.x)) *
                (Math.min(
                    player.position.y + player.height,
                    battleZone.position.y + battleZone.height
                ) - Math.max(player.position.y, battleZone.position.y))
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: battleZone
                }) &&
                overlappingArea > player.width * player.height / 2 &&
                Math.random() < 0.01 // this means there's 1% chance of a battle
            ) {
                console.log('activate battle!')

                // deactivate current animation loop
                window.cancelAnimationFrame(animationId);

                battle.initiated = true
                gsap.to('#overlappingDiv', {
                    opacity: 1, 
                    repeat: 3,
                    yoyo: true,
                    duration: 0.4,
                    onComplete() {
                        gsap.to('#overlappingDiv', {
                            opacity: 1,
                            duration: 0.4,
                            onComplete() {
                                animateBattle()
                                 gsap.to('#overlappingDiv', {
                                    opacity: 0,
                                    duration: 0.4
                            })

                            }
                        })

                        // activate new animaiton loop
                        animateBattle()
                       

                    }
                })
                break
            }
        }
    }
  
    
   if (keys.w.pressed && lastKey === 'w') {
    player.animate = true
    player.image = player.sprites.up

    for (let i = 0; i < boundaries.length; i++) {
        const boundary = boundaries[i];
        if (
            rectangularCollision({
                rectangle1: player,
                rectangle2: {
                    ...boundary, 
                    position: {
                        x: boundary.position.x,
                        y: boundary.position.y + 3
                    }
                }
            })
        ) {
            console.log('colliding!');
            moving = false;
            break
        }
    }

       
    if (moving === true)
    movables.forEach(moveable => {moveable.position.y += 3})
   }

   else if (keys.a.pressed && lastKey === 'a') {
    player.animate = true
    player.image = player.sprites.left

      for (let i = 0; i < boundaries.length; i++) {
        const boundary = boundaries[i];
        if (
            rectangularCollision({
                rectangle1: player,
                rectangle2: {
                    ...boundary, 
                    position: {
                        x: boundary.position.x + 3,
                        y: boundary.position.y
                    }
                }
            })
        ) {
                console.log('colliding!');
                moving = false;
                break
        }
    }
    if (moving === true)
    movables.forEach(moveable => {moveable.position.x += 3})
   }

   else if (keys.s.pressed && lastKey === 's') {
    player.animate = true
    player.image = player.sprites.down

      for (let i = 0; i < boundaries.length; i++) {
        const boundary = boundaries[i];
        if (
            rectangularCollision({
                rectangle1: player,
                rectangle2: {
                    ...boundary, 
                    position: {
                        x: boundary.position.x,
                        y: boundary.position.y -3
                    }
                }
            })
        ) {
                console.log('colliding!');
                moving = false;
                break
        }
    }
    
    if (moving === true)
    movables.forEach(moveable => {moveable.position.y -= 3})
   }

   else if (keys.d.pressed && lastKey === 'd') {
    player.animate = true
    player.image = player.sprites.right

     for (let i = 0; i < boundaries.length; i++) {
        const boundary = boundaries[i];
        if (
            rectangularCollision({
                rectangle1: player,
                rectangle2: {
                    ...boundary, 
                    position: {
                        x: boundary.position.x - 3,
                        y: boundary.position.y
                    }
                }
            })
        ) {
                console.log('colliding!');
                moving = false;
                break
        }
    }
    if (moving === true)
    movables.forEach(moveable => {moveable.position.x -= 3})
   }
}

// animate();


const battleBackgroundImg = new Image;
battleBackgroundImg.src = './img/battleBackground.png'
const battleBackground = new Sprite({
    position: {
        x: 0,
        y:0
    },
    image: battleBackgroundImg
})

const draggleImg = new Image();
draggleImg.src = './img/draggleSprite.png'
const draggle = new Sprite({
    position: {
        x: 800,
        y: 100
    },
    image: draggleImg,
    frames: {
        max: 4,
        hold: 30
    },
    animate: true,
    isEnemy: true
})

const embyImg = new Image();
embyImg.src = './img/embySprite.png'
const emby = new Sprite({
    position: {
        x: 280,
        y: 325
    },
    image: embyImg,
    frames: {
        max: 4,
        hold: 30
    },
    animate: true
})

function animateBattle() {
    window.requestAnimationFrame(animateBattle)
    console.log('animating battle');
    battleBackground.draw();
    draggle.draw();
    emby.draw();
}

animateBattle()

document.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', () => {
    console.log('clicked')
    draggle.attack({ 
    attack: {
        name: 'Tackle',
        damage: 10,
        type: 'Normal'
        },
        recipient: emby
        })
    })
}) 


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