import Tool from './Tool.js'

export default class Ring extends Tool {
    constructor(canvas, socket, id){
        super(canvas, socket, id)
        this.listen()
    }
    mouseUpHandler(e){
        this.mouseDown = false

        this.socket.send(JSON.stringify({
            method: 'draw',
            id: this.id,
            figure: {
                type: 'ring',
                cx: this.centerX,
                cy: this.centerY,
                r: this.radius
            },
            style:{
                fillColor: this.ctx.fillStyle,
                strokeColor: this.ctx.strokeStyle,
                lineWidth: this.ctx.lineWidth
            }
        }))
    }
    mouseDownHandler(e){
        if(!e.pageX){
            e.pageX = e.touches[0].pageX
            e.pageY = e .touches[0].pageY
        }
        this.mouseDown = true
        this.ctx.beginPath()
        this.startX = (e.pageX - e.target.offsetLeft)/e.target.offsetWidth*this.canvas.width;
        this.startY = (e.pageY - e.target.offsetTop)/e.target.offsetHeight*this.canvas.height;
        this.saved = this.canvas.toDataURL()

        this.socket.send(JSON.stringify({
            method: 'draw',
            id: this.id,
            figure: {
                type: 'start',

            }
        }))
    }
    mouseMoveHandler(e){
        if(this.mouseDown){
            if(!e.pageX){
                e.pageX = e.touches[0].pageX
                e.pageY = e .touches[0].pageY
            }
            let currentX = (e.pageX - e.target.offsetLeft)/e.target.offsetWidth*this.canvas.width;
            let currentY = (e.pageY - e.target.offsetTop)/e.target.offsetHeight*this.canvas.height;
            this.radius = Math.sqrt(Math.pow((currentX-this.startX),2) + Math.pow((currentY-this.startY),2))

            this.draw(this.startX, this.startY, this.radius)

        }
    }
    listen(){
        this.canvas.onmouseup = this.mouseUpHandler.bind(this)
        this.canvas.onmousedown = this.mouseDownHandler.bind(this)
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
        this.canvas.ontouchend = this.mouseUpHandler.bind(this)
        this.canvas.ontouchstart = this.mouseDownHandler.bind(this)
        this.canvas.ontouchmove = this.mouseMoveHandler.bind(this)
    }
    draw(cx, cy, r){
        const img = new Image()
        img.src = this.saved
        img.onload = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
            this.ctx.drawImage(img , 0, 0, this.canvas.width, this.canvas.height)
            this.ctx.beginPath()
            this.ctx.arc(cx, cy, r, 0, 2 * Math.PI, true)
            this.ctx.fill()
            this.ctx.stroke()
        }

    }
    static staticDraw(ctx, cx, cy, r, style){
        const fC = ctx.fillStyle
        const sC = ctx.strokeStyle
        const lW = ctx.lineWidth

        ctx.fillStyle = style.fillColor
        ctx.strokeStyle = style.strokeColor
        ctx.lineWidth = style.lineWidth

        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, 2 * Math.PI, true)
        ctx.fill()
        ctx.stroke()

        ctx.fillStyle = fC
        ctx.strokeStyle = sC
        ctx.lineWidth = lW

    }
}