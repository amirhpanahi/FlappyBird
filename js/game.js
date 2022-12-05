var cvs = document.querySelector("#mycanvas");
var ctx = cvs.getContext("2d");

var frame=0;

var DEGREE=Math.PI / 180

var sprite = new Image();
sprite.src = "img/sprite.png";

var die = new Audio();
die.src = "music/die.wav";

var flap = new Audio();
flap.src = "music/flap.wav";

var hit = new Audio();
hit.src = "music/hit.wav";

var SCORE = new Audio();
SCORE.src = "music/score.wav";

var start = new Audio();
start.src = "music/start.wav";

var state={
    current : 0,
    getReday : 0,
    game : 1,
    over : 2
}

function clickHandeler(){
    switch (state.current) {
        case state.getReday:
            start.play()
            state.current = state.game
            break;
        case state.game:
            flap.play()
            brid.flap()
            break;
        default:
            score.value=0
            brid.speed=0
            brid.rotation=0
            pipes.position=[]
            state.current = state.getReday
            break;
    }
}

document.addEventListener("click",clickHandeler)
document.addEventListener("keydown",function(e){
    if(e.code == "Space"){
        clickHandeler();
        
    }
})

// المان ها       *********************************
var bg = {
    sx:0,
    sy:0,
    sw:275,
    sh:226,
    dx:0,
    dy:cvs.height - 226,     //برای وسط قرار گرفتن المان
    dw:275,
    dh:226,

    draw :function(){
        ctx.drawImage(sprite,this.sx,this.sy,this.sw,this.sh,this.dx,this.dy,this.dw,this.dh)
        ctx.drawImage(sprite,this.sx,this.sy,this.sw,this.sh,this.dx + this.dw,this.dy,this.dw,this.dh) //برای تکرار عکس
    }
}

var getReady = {
    sx:0,
    sy:228,
    sw:173,
    sh:152,
    dx:cvs.width/2 - 173/2,  //برای وسط قرار گرفتن المان
    dy:80,
    dw:173,
    dh:152,

    draw :function(){
        if(state.current == state.getReday){
        ctx.drawImage(sprite,this.sx,this.sy,this.sw,this.sh,this.dx,this.dy,this.dw,this.dh)
        }
    }
}

var gameOver = {
    sx:175,
    sy:228,
    sw:225,
    sh:202,
    dx:cvs.width/2 - 225/2,    //برای وسط قرار گرفتن المان
    dy:80,
    dw:225,
    dh:202,

    draw :function(){
        if(state.current == state.over){
        ctx.drawImage(sprite,this.sx,this.sy,this.sw,this.sh,this.dx,this.dy,this.dw,this.dh)
        }
    }
}

var fg = {
    sx:276,
    sy:0,
    sw:224,
    sh:112,
    dx:0,
    dy:cvs.height - 112,
    dw:224,
    dh:112,
    deltaX:2,

    draw :function(){
        ctx.drawImage(sprite,this.sx,this.sy,this.sw,this.sh,this.dx,this.dy,this.dw,this.dh)
        ctx.drawImage(sprite,this.sx,this.sy,this.sw,this.sh,this.dx + this.dw,this.dy,this.dw,this.dh) //برای تکرار عکس
    },

    update : function(){
        if(state.current==state.game){
            this.dx = (this.dx - this.deltaX) % (this.dw / 2)
        }
    }


}

var pipes = {
    top:{
        sx:553,
        sy:0
    },
    bottom:{
        sx:502,
        sy:0
    },

    position:[],
    sw:53,
    sh:400,

    dw:53,
    dh:400,

    deltax:2,
    gap:80,

    maxYposition:-150,

    draw:function(){
        for(let i=0;i<this.position.length;i++){
            let p = this.position[i]
            let toppipesYposition=p.dy
            let bottompipesYposition=p.dy + this.dh + this.gap
            ctx.drawImage(sprite,this.top.sx,this.top.sy,this.sw,this.sh,p.dx,toppipesYposition,this.dw,this.dh)
            ctx.drawImage(sprite,this.bottom.sx,this.bottom.sy,this.sw,this.sh,p.dx,bottompipesYposition,this.dw,this.dh)
        }
    },

    update:function(){
        if(state.current != state.game) return

        

        if(frame % 100 ==0){      //ایجاد لوله
            this.position.push({
                dx: cvs.width,
                dy: this.maxYposition * (Math.random() + 1)
            })
        }

        for(let i =0;i<this.position.length;i++){  //حرکت لوله موجود
            let p =this.position[i]
            p.dx -= this.deltax

            let bottemnpipeppos=p.dy + this.dh +this.gap

            if(brid.dx + brid.r > p.dx && brid.dx - brid.r < p.dx + this.dw && brid.dy + brid.r > p.dy && brid.dy - brid.r < p.dy+this.dh){
                hit.play()
                state.current=state.over
            }
            if(brid.dx + brid.r > p.dx && brid.dx - brid.r < p.dx + this.dw && brid.dy + brid.r > bottemnpipeppos && brid.dy - brid.r < bottemnpipeppos+this.dh){
                hit.play()
                state.current=state.over
            }

            if(p.dx+this.dw < 0)
            {
                this.position.shift(this.position[i])
                score.value+=1
                SCORE.play()
                score.best=Math.max(score.value,score.best)
                localStorage.setItem("best",score.best)
            }

        }

        
    }
}

var brid = {
    animation:[
        {sx:276,sy:112},  //بال بالا     animationIndex:0   animation.length 4
        {sx:276,sy:139},  //بال وسط     animationIndex:1   animation.length 4
        {sx:276,sy:164},  //بال پایین   animationIndex:2   animation.length 4
        {sx:276,sy:139}   //بال وسط     animationIndex:3   animation.length 4
    ],
    sw:34,
    sh:26,
    dx:50,
    dy:150,
    dw:34,
    dh:26,

    speed:0,
    gravity:0.25,
    jump:4.6,

    rotation:0,

    r:12,

    animationIndex:0,

    draw :function(){
        let brid = this.animation[this.animationIndex]
        ctx.save()
        ctx.translate(this.dx,this.dy)
        ctx.rotate(this.rotation)
        ctx.drawImage(sprite,brid.sx,brid.sy,this.sw,this.sh,- this.dw/2,- this.dh/2,this.dw,this.dh)
        ctx.restore()
    },
    update :function(){
        let sorat = state.current == state.getReday ?10:5;
        this.animationIndex += frame % sorat ==0 ? 1 :0;
        this.animationIndex=this.animationIndex % this.animation.length
        // if(frame % sorat == 0)
        // {
        //     this.animationIndex++
        //     if(this.animationIndex == 3){
        //         this.animationIndex =0
        //     }
        // }

        if(state.current == state.getReday){
            this.dy = 150;
        }else{                  // هستش state.game یعنی تو 
            this.speed +=this.gravity
            this.dy +=this.speed
            if(this.speed < this.jump){
                this.rotation=-25 * DEGREE              //رو به بالا
            }else{
                this.rotation = 50 * DEGREE             //رو به پایین
            }
        }

        if(this.dy + this.dh/2 >= cvs.height - fg.dh){
            this.animationIndex = 1
            this.dy = cvs.height - fg.dh - this.dh/2
            this.rotation = 90 * DEGREE
            
            if(state.current==state.game){
                state.current=state.over
                die.play()
            }
        }
        
    },
    flap :function(){
        this.speed = -this.jump
    }

}

var score={
    best:parseInt(localStorage.getItem("best")) || 0,
    value:0,

    draw:function(){
        

        if(state.current == state.game){
            ctx.font="35px IMPACT";
            
            ctx.fillStyle="#fff";
            ctx.fillText(this.value,cvs.width/2,50)
            ctx.strokeStyle="#000";
            ctx.strokeText(this.value,cvs.width/2,50)

        }else if(state.current == state.over){
            ctx.font="25px IMPACT";
            
            ctx.fillStyle="#fff";
            ctx.fillText(this.value,225,180)
            ctx.strokeStyle="#000";
            ctx.strokeText(this.value,225,180)

            ctx.fillStyle="#fff";
            ctx.fillText(this.best,225,220)
            ctx.strokeStyle="#000";
            ctx.strokeText(this.best,225,220)
        }
    }

}


// المان ها       *********************************

function update(){
    brid.update()
    fg.update()
    pipes.update()
}

function draw(){
    ctx.fillStyle = "#70c5ce"
    ctx.fillRect(0,0,cvs.clientWidth,cvs.height)
    bg.draw()   //ترتیب صدا زدن مهمه اگه جابه مینوشتیم دیگه پایینی رو نمیدیدم
    pipes.draw()
    fg.draw()
    brid.draw()
    getReady.draw()
    gameOver.draw()
    score.draw()
}

function animate(){
    update()
    draw()

    frame++;
    requestAnimationFrame(animate)
}

animate()