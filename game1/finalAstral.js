
const FPS = 30;

var shipColor = 'white';

let canv = document.getElementById("gameCanvas");
var ctx = canv.getContext("2d");
let keys = [];

//skipid
/*var ship = {
	x: canv.width/2,
	y: canv.height/2,
	r: SHIP_S
}*/
document.addEventListener('DOMContentLoaded', SetupCanvas);
function SetupCanvas(){
	canv = document.getElementById('gameCanvas');
	ctx = canv.getContext('2d');
	ctx.fillStyle = "black";
	ctx.fillRect(0,0,canv.width, canv.height);
	document.body.addEventListener("keydown", function(e){
		keys[e.keyCode] = true;//takki er nidri
	});
	document.body.addEventListener("keyup", function(e){
		keys[e.keyCode] = false;//takki er sleppt
	});//tekur eftir hvenær lyklaborðið er notað
	updateRender();
}


//leikja loop
//setInterval(updateRender, 1000 / FPS);

//skipid
class Ship {
	constructor(){
		this.visible = true;
		this.x = canv.width/2;
		this.y = canv.height/2;
		this.movingForward = false;
		this.speed = 0.1;
		this.velX = 0;
		this.velY = 0;
		this.rotateSpeed = 0.001;
		this.radious = 15;
		this.angle = 0;
		this.strokeColor = shipColor;
	}
	Rotate(dir){//snyr skipid
		this.angle += this.rotateSpeed * dir;
	}
	shipUpdate(){
		let radians = this.angle / Math.PI * 180;
		if(this.movingForward){
			this.velX += Math.cos(radians) * this.speed;
			this.velY += Math.sin(radians) * this.speed;
		}
		//passar þad verður innan skjainn
		if(this.x < this.radius){
			this.x = canv.width;
		}
		if(this.x > this.radius){
			this.x = this.radius;
		}
		if(this.y < this.radius){
			this.y = canv.height;
		}
		if(this.y > canv.height){
			this.y = this.radius;
		}
		//haegir a skipid þegar lykill er sleppt
		this.velX *= 0.99;
		this.velY *= 0.99;

		this.x -= this.velX;// lækkar hraðan(velocity)
		this.y -= this.velY;
	}

	Draw(){
		ctx.strokeStyle = this.strokeColor;//litur
		ctx.beginPath();//byrjar teikning
		let vertAngle = ((Math.PI * 2) / 3);
		let radians = this.angle / Math.PI * 180;
		for(let i = 0; i < 3; i++){
			ctx.lineTo(this.x - this.radius * Math.cos(vertAngle * i + radians),
			this.y - this.radius * Math.sin(vertAngle * i + radians));
		}

		ctx.closePath();//lokar teikninga ferlid
		ctx.stroke();
	}
}
let ship = new Ship();

function updateRender() {
	/*
	//teikna geymin
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canv.width, canv.height);*/
	//ekki missi 2 og halfa klukkitima med ad setja in = milli fillRect og () aftur
	console.log("ping");
	ship.movingForward = (keys[87]);//87 er kodi fyrir "w", þegar w er ýtt þá tekur það eftir fyrir notkun í flug kóðann
	if(keys[68]){
		ship.Rotate(1);
	}//68 er kodi fyrir "d", snyr skipid
	if(keys[65]){
		ship.Rotate(-1);
	}//68 er kodi fyrir "a", snyr skipid í hina áttina

	//hreinsar og endurteiknar skjáinn
	ctx.clearRect(0,0, canv.width,canv.height);
	
	ship.shipUpdate();
	ship.Draw();
	requestAnimationFrame(updateRender);
	
}