class Sprite {
    constructor({ position, velocity, image, frames = { max: 1 } }) {
        this.position = position
        this.image = image
        // this.velocity = velocity
        this.frames = {...frames, val: 0, elapsed: 0}

        this.image.onload = () => {
            this.width = this.image.width / this.frames.max
            this.height = this.image.height
            console.log(this.height)
            console.log(this.width)
        }
        this.moving = false
    }

    draw() {
        c.drawImage(
        this.image,
        // cropping
        this.frames.val * this.width,
        0,
        this.image.width / this.frames.max,
        this.image.height,
        // actual image rendered
        this.position.x,
        this.position.y,
        this.image.width / this.frames.max,
        this.image.height
        )

        if (!this.moving) return
        if (this.frames.max > 1) {
            this.frames.elapsed++
        }
        

        if(this.frames.elapsed % 10 === 0) {
            if (this.frames.val < this.frames.max - 1) this.frames.val++
            else this.frames.val = 0
        }

        
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
