import {makeAutoObservable} from 'mobx'

class CanvasState  {
    canvas = null
    undolist = []
    redolist = []
    userName = ''
    sessionId = null
    socket = null

    constructor (){
        makeAutoObservable(this)
    }
    
    setSessionId(sessionId){
        this.sessionId = sessionId
    }
    setSocket(socket){
        this.socket = socket
    }
    setUsername(name){
        this.userName = name
    }
    setCanvas(canvas) {
        this.canvas = canvas
    }

    pushToUndo(data){
        this.undolist.push(data)
    }
    pushToRedo(data){
        this.redolist.push(data)
    }
    clearRedo(){
        this.redolist = []
    }
    undo(){
        let ctx = this.canvas.getContext('2d')
        if(this.undolist.length>0){
            this.redolist.push(this.canvas.toDataURL())
            let dataUrl = this.undolist.pop()
            
            let img  = new Image()
            img.src = dataUrl
            img.onload = () => {
                ctx.clearRect(0,0,this.canvas.width, this.canvas.height)
                ctx.drawImage(img ,0,0,this.canvas.width, this.canvas.height)
            }
        } 
    }
    redo(){
        let ctx = this.canvas.getContext('2d')
        if(this.redolist.length>0){
            this.undolist.push(this.canvas.toDataURL())
            let dataUrl = this.redolist.pop()
            let img  = new Image()
            img.src = dataUrl
            img.onload = () => {
                ctx.clearRect(0,0,this.canvas.width, this.canvas.height)
                ctx.drawImage(img ,0,0,this.canvas.width, this.canvas.height)
            }
        } 
    }
}

export default new CanvasState()