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


class Boundary {
    static width = 48
    static height = 48
    constructor({ position }) {
        this.position = position
        this.width = 48
        this.height = 48
    }
    draw() {
        c.fillStyle = 'rgba(255, 0, 0, 0)';
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}
