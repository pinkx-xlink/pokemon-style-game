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
console.log(image);

image.onload = () => {
  c.drawImage(image, -1100, -490);
}