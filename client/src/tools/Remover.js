import Tool from './Tool.js'

export default class Remover extends Tool {
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
                type: 'finish',

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
        this.ctx.moveTo((e.pageX - e.target.offsetLeft)/e.target.offsetWidth*this.canvas.width, (e.pageY - e.target.offsetTop)/e.target.offsetHeight*this.canvas.height)

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
            this.socket.send(JSON.stringify({
                method: 'draw',
                id: this.id,
                figure: {
                    type: 'brush',
                    x: (e.pageX - e.target.offsetLeft)/e.target.offsetWidth*this.canvas.width,
                    y: (e.pageY - e.target.offsetTop)/e.target.offsetHeight*this.canvas.height
                },
                style: {
                    strokeColor: '#fff',
                    lineWidth: this.ctx.lineWidth
                }
            }))
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
    static draw(ctx, x, y, style){
        const sC = ctx.strokeStyle
        const lW = ctx.lineWidth

        ctx.strokeStyle = style.strokeColor
        ctx.lineWidth = style.lineWidth

        ctx.lineTo(x,y)
        ctx.stroke()
        
        ctx.strokeStyle = sC
        ctx.lineWidth = lW
    }


}