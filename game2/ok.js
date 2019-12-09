//hljod
var audioElem = new Audio('thunderdome.mp3')//þarf að vera stórt A


const refresh = 15;//refreshar á 15 ms
const sOver = 10;//skipstaerd yfirleitt
const spd = 3;//hradi skips
const proj_spd = 9; //skot hradi
const proj_dist = 0.9;//hversu langt skot ferdast eftir skja vidd

const rock_size = 20;
const rock_num = 8; //hversu margar loftsteinar leikurinn byrjar med
const rock_spd = 2;


//skipanir
var right = false;
var left = false;
var up = false;
var down = false;
var fly = false;
var wl = false;
var al = false;
var sl = false;
var dl = false;
var music = false;
var mToggle = false;

/** @type {HTMLCanvasElement} */
var canv = document.getElementById("gameCanvas");
var ctx = canv.getContext("2d");

//object fyrir skipid
var ship = {
	x: canv.width / 2,
    y: canv.height / 2,
    s: sOver,
    r: sOver/2
}

//skot
var proj = [];

//hlustar á alla lyklar
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        right = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        left = true;
    }
    else if(e.key == "Up" || e.key == "ArrowUp") {
        up = true;
    }
    else if(e.key == "Down" || e.key == "ArrowDown") {
        down = true;
    }
    else if(e.key == "Space" || e.key == "Space") {
        fly = true;
    }
    else if(e.key == "w") {
        wl = true;
    }
    else if(e.key == "a") {
        al = true;
    }
    else if(e.key == "s") {
        sl = true;
    }
    else if(e.key == "d") {
        dl = true;
    }
    else if(e.key == "m") {
        music = true;
    }
    else if(e.key == "n") {
        mToggle = true;
    }

}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        right = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        left = false;
    }
    else if(e.key == "Up" || e.key == "ArrowUp") {
        up = false;
    }
    else if(e.key == "Down" || e.key == "ArrowDown") {
        down = false;
    }
    else if(e.key == "Space" || e.key == "Space") {
        fly = false;
    }
    else if(e.key == "w") {
        wl = false;
    }
    else if(e.key == "a") {
        al = false;
    }
    else if(e.key == "s") {
        sl = false;
    }
    else if(e.key == "d") {
        dl = false;
    }
    else if(e.key == "m") {
        music = false;
    }
    else if(e.key == "n") {
        mToggle = false;
    }
}

function drawShip() {
	ctx.beginPath();
    ctx.arc(ship.x, ship.y, ship.s, 0, Math.PI*2);
    ctx.fillStyle = "#B968BA";
    ctx.fill();
    ctx.closePath();
}

function fire(wl, al, sl, dl) {
	//skot hradar
	var nxv = 0;
	var nyv = 0;
	if (wl == true){
		nyv -= proj_spd;
	}
	if (al == true){
		nxv -= proj_spd;
	}
	if (sl == true){
		nyv += proj_spd;
	}
	if (dl == true){
		nxv += proj_spd;
	}
	proj.push({//bua til skot fra midju skipsins
		x: ship.x,
		y: ship.y,
		xv: nxv,
		yv: nyv,
		dist: 0,
		time: 0
	})
}
function newAsteroid(x, y) { //hradi og stadsetningar a loftsteinum
			var rock = {
				x: x,
				y: y,
				xv: Math.random() * rock_spd * (Math.random() < 0.5 ? 1 : -1),//staerdfraedi sem passar það getur farið i margar attir
				yv: Math.random() * rock_spd * (Math.random() < 0.5 ? 1 : -1),
				//Math.random() * rock_spd * lvlMult / FPS * (Math.random() < 0.5 ? 1 : -1),
			};

			return rock;
		}

function distBetweenPoints(x1, y1, x2, y2) {//stjornar fjarlegd af hvar loftsteinar mega byrja
			return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
		};

function create_cluster() {
	rocks = [];
	var x, y;
	for (var i = 0; i < rock_num; i++) {
		//(var i = 0; i < (rock_num * level * 2)+1; i++) {
		do {
		x = Math.floor(Math.random() * canv.width);
		y = Math.floor(Math.random() * canv.height);
		} while (distBetweenPoints(ship.x, ship.y, x, y) < rock_size * 1.2 + ship.r); //callar a function sem stjornar hversu nalegt loftsteinar mega byrjar hja spilaran
		rocks.push(newAsteroid(x, y, Math.ceil(rock_size / 1.2)));//
	
	}
}

function controls() {
	if (right == true) {
		ship.x += spd;
	}
	if (left == true) {
		ship.x -= spd;
	}
	if (up == true) {
		ship.y -= spd;
	}
	if (down == true) {
		ship.y += spd;
	}
	if (wl == true || al == true || sl == true || dl == true) {
		fire(wl, al, sl, dl);
	}
	if (music == true){//svo það er léttara að stjórna tónlistinna
		audioElem.play();
		audioElem.muted = false;
	}
	if (mToggle == true){
		audioElem.muted = true;
	}

}

create_cluster();//byr til loftsteina

function draw() {
	ctx.clearRect(0, 0, canv.width, canv.height);
	// teiknar bakrunnin
	ctx.fillStyle = "black"
	ctx.fillRect(0,0, canv.width, canv.height);


	drawShip();

	

	controls();
	//----------------teikningar---------
	//teikna skot
	for (var i = 0; i < proj.length; i++){
		
            ctx.fillStyle = "#5EE0CB";
            ctx.beginPath();
            ctx.arc(proj[i].x, proj[i].y, ship.s/3, 0, Math.PI*2);
			ctx.fill();
			ctx.closePath();
	}

	//teikna loftsteina
			var x, y, r, a, alt;
			for (var i = 0; i < rocks.length; i++) {
				
				//if(rocks[i].alt == true) {
					rockColor = "#E0AF00";
				//} else {
				//	rockColor = "red";
				//}
				ctx.strokeStyle = rockColor;
				ctx.lineWidth = sOver / 10;

				//teikna leid
				ctx.beginPath();
                ctx.fillStyle = "slategrey";
            	ctx.beginPath();
            	ctx.arc(rocks[i].x, rocks[i].y, rock_size, 0, Math.PI*2);
				ctx.fill();
				ctx.closePath();
				ctx.closePath();
				ctx.stroke();
			}

	//-------------hreyfingar-----

	//hreyfa skotinn
	for (var i = proj.length - 1; i >= 0; i--) {
		//kikja a skot ferdalengd
		if (proj[i].dist > proj_dist * canv.width || proj[i].time > 5) {
		//fjarlegir skot ef það hefur verið til of lengi eða farið of langt
			proj.splice(i, 1);//"splice" fjarlaegir skotid fra leikin
			continue;
		}

		//hreyfir skot
		proj[i].x += proj[i].xv;
		proj[i].y += proj[i].yv;

		//reikna hversu langt skotinn hafa farid
		proj[i].dist += Math.sqrt(Math.pow(proj[i].xv, 2) + Math.pow(proj[i].yv, 2));

		//reikna hversu lengi skotinn hafa verid til
		proj[i].time += 1/refresh;
	
		//hondla skja endanna fyrir skotinn
		if (proj[i].x < 0) {
			proj[i].x = canv.width;
		} else if (proj[i].x > canv.width) {
			proj[i].x = 0
		}
		if (proj[i].y < 0) {
			proj[i].y = canv.height;
		} else if (proj[i].y > canv.height) {
			proj[i].y = 0
		}
	}
	if (ship.x < 0 - ship.r) {
		ship.x = canv.width + ship.r
	} else if (ship.x > canv.width + ship.r){
		ship.x = 0 - ship.r
	}
	if (ship.y < 0 - ship.r) {
		ship.y = canv.height + ship.r
	} else if (ship.y > canv.height + ship.r){
		ship.y = 0 - ship.r
	}

	//hreyfa loftsteinana
	for (var i = 0; i < rocks.length; i++) {
		rocks[i].x += rocks[i].xv; //xv = x velocity átt
		rocks[i].y += rocks[i].yv; //xy er það sama nema fyrir y áttir
	
		//hondla skja bordanna fyrir loftsteinnana
		if (rocks[i].x < 0) {
			rocks[i].x = canv.width
		} else if (rocks[i].x > canv.width) {
			rocks[i].x = 0
		}
		if (rocks[i].y < 0) {
			rocks[i].y = canv.height
		} else if (rocks[i].y > canv.height) {
			rocks[i].y = 0
		}
	}
	
}

setInterval(draw, refresh);