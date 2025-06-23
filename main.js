const canvas = document.querySelector('canvas');
// "c" stands for "context"
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;
console.log(c);

c.fillStyle = 'white';
c.fillRect(0, 0, canvas.width, canvas.height);

const image = new Image();
image.src = './img/PokemonStyleGameMap.png';

const playerImage = new Image();
playerImage.src = './img/playerDown.png';

function animate() {
    window.requestAnimationFrame(animate);
    console.log('animate');
    c.drawImage(image, -1050, -570);
   c.drawImage(
    playerImage,
    // cropping
    0,
    0,
    playerImage.width / 4,
    playerImage.height,
    // actual image rendered
    canvas.width / 2 - playerImage.width / 4 / 2,
    canvas.height / 2 - playerImage.height / 2,
    playerImage.width / 4,
    playerImage.height
)
}
animate();

// move player down
window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'w':
            console.log('pressed w')
            break 

        case 'a':
            console.log('pressed a')
            break 

        case 's':
            console.log('pressed s')
            break 

        case 'd':
            console.log('pressed d')
            break 
    }
})