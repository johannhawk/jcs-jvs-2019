
/*
hugmyndir til ad gera þetta öðruvísi:
1 Litir á skipið til að telja hversu mörg líf eru eftir
2 Góð blá asteroids sem gefa auka líf ef ekki skotinn
3 þetta er ekki nýtt en "waves" með tölur væri flott
4 láta skipið skjóta sjálfkrafa
skot takkinn mun hafa skipið hlaða skot eins og megaman

tutorial notud:
https://www.youtube.com/watch?v=HWuU5ly0taA
*/

let canvas;
let ctx; //stendur fyrir ordid "context"
let canvasWidth = 1400; //hjalpar med ad stadsetja hluti
let canvasHeight = 1000;
let keys = []; //svo margar lyklar eru notud i einu meira audveldlega
let bullets

document.addEventListener('DOMContentLoaded', SetupCanvas);
//document.addEventListener("load", SetupCanvas);

function SetupCanvas(){
	canvas = document.getElementById('my-canvas');
	ctx = canvas.getContext('2d');
	canvas.width = canvasWidth;
	canvas.height = canvasHeight;
	ctx.fillStyle = 'black';
	ctx.fillRect(0,0,canvas.width, canvas.height);
	document.body.addEventListener("keydown", function(e){
		keys[e.keyCode] = true;
	});
	document.body.addEventListener("keyup", function(e){
		keys[e.keyCode] = false;
	});//tekur eftir hvenær lyklaborðið er notað
	Render();
}

class Ship {
	constructor(){
		this.visible = true;
		this.x = canvasWidth / 2;
		this.y = canvasHeight / 2;
		this.movingForward = false;
		this.speed = 0.1;
		this.velX = 0;
		this.velY = 0;//vel stendur fyrir "velocity", talan er her til ad byggja up hrada
		this.rotateSpeed = 0.001;//hversu hratt það snýr
		this.radius = 15;
		this.angle = 0;
		this.strokeColor = 'white';//mun breyta þetta seinna fyrir hugmynd 1
	}
	Rotate(dir){//snyr skipid
		this.angle += this.rotateSpeed * dir;
	}

	Update(){
		let radians = this.angle / Math.PI * 180;
		// oldX + cos(radians) * distance
		// oldY + sin(radians) * distance
		if(this.movingForward){
			this.velX += Math.cos(radians) * this.speed;
			this.velY += Math.sin(radians) * this.speed;
		}
		if(this.x < this.radius){
			this.x = canvas.width;
		}
		if(this.x > this.radius){
			this.x = this.radius;
		}
		if(this.y < this.radius){
			this.y = canvas.height;
		}
		if(this.y > canvasHeight){
			this.y = this.radius;
		}
		this.velX *= 0.99;
		this.velY *= 0.99;

		this.x -= this.velX;// lækkar hraðan(velocity)
		this.y -= this.velX;
	}
	Draw(){
		ctx.strokeStyle = this.strokeColor;//litur
		ctx.beginPath();//byrjar teikning
		let vertAngle = ((Math.Pi * 2) / 3);
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

function Render(){
	ship.movingForward = (keys[87]);//87 er kodi fyrir "w", þegar w er ýtt þá tekur það eftir fyrir notkun í flug kóðann
	if(keys[68]){
		ship.Rotate(1);
	}//68 er kodi fyrir "d", snyr skipid
	if(keys[65]){
		ship.Rotate(-1);
	}//68 er kodi fyrir "a", snyr skipid í hina áttina

	//hreinsar og endurteiknar skjáinn
	ctx.clearRect(0,0, canvasWidth,canvasHeight);
	ship.Update();
	ship.Draw();
	requestAnimationFrame(Render);
}