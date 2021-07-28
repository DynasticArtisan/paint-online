import Tool from './Tool.js'

export default class Line extends Tool {
    constructor(canvas, socket, id){
        super(canvas, socket, id)
        this.listen()
    }
    mouseUpHandler(e){
        this.mouseDown = false
        const img = new Image()
        img.src = this.saved
        img.onload = () => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.ctx.drawImage(img , 0, 0, this.canvas.width, this.canvas.height)
        }

        this.socket.send(JSON.stringify({
            method: 'draw',
            id: this.id,
            figure: {
                type: 'line',
                fromX: this.startX,
                toX: this.currentX,
                fromY: this.startY,
                toY: this.currentY
            },
            style:{
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
            this.currentX = (e.pageX - e.target.offsetLeft)/e.target.offsetWidth*this.canvas.width;
            this.currentY = (e.pageY - e.target.offsetTop)/e.target.offsetHeight*this.canvas.height;
            this.draw(this.currentX, this.currentY)

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
    draw(x, y){
        const img = new Image()
        img.src = this.saved
        img.onload = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
            this.ctx.drawImage(img , 0, 0, this.canvas.width, this.canvas.height)
            this.ctx.beginPath()
            this.ctx.moveTo(this.startX, this.startY)
            this.ctx.lineTo(x, y)
            this.ctx.stroke()
        }

    }
    static staticDraw(ctx, fromX, toX, fromY, toY, style){

        const sC = ctx.strokeStyle
        const lW = ctx.lineWidth


        ctx.strokeStyle = style.strokeColor
        ctx.lineWidth = style.lineWidth

        ctx.beginPath()
        ctx.moveTo(fromX, fromY)
        ctx.lineTo(toX, toY)
        ctx.stroke()

 
        ctx.strokeStyle = sC
        ctx.lineWidth = lW
    }
}