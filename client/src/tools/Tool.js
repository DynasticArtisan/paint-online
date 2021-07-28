export default class Tool {
    constructor(canvas, socket, id){
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')
        this.destroyEvents()
        this.socket = socket
        this.id = id

    }

    set fillColor(color) {
        this.ctx.fillStyle = color
    }
    set strokeColor(color) {
        this.ctx.strokeStyle = color
    }
    set lineWidth(width){
        this.ctx.lineWidth = width
    }

    destroyEvents(){
        this.canvas.onmouseup = null
        this.canvas.onmousedown = null
        this.canvas.onmousemove = null
        this.canvas.ontouchend = null
        this.canvas.ontouchstart = null
        this.canvas.ontouchmove = null
    }
}