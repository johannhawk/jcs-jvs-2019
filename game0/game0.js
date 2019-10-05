//https://www.youtube.com/watch?v=H9CSWMxJx84

//js lint, js hint
		const FPS = 30; //frames per second

		const FRICTION = 0.7; // loft motkraftur coefficient, 0 = no friction, 1 = lots of friction
		const SHIP_SIZE = 30; // haed skip i pixels
		const SHIP_THRUST = 5; //hrodum skipins i pixels hverja sekundur
		const TURN_SPEED = 360; // beygju hradi i gradur a sekundu

		const SHOW_BOUNDING = true; //syna/fela arekstrar
		const SHOW_CENTRE_DOT = true; //syna/fela punktinn i midju skipinnu

		const ROIDS_NUM = 7; //hversu margar loftsteinar leikurinn byrjar med
		const ROIDS_SIZE = 100; //byrjunar staerd i pixlum
		const ROIDS_SPEED = 50; //hamarks byrjunar hradi i pixla hverja sekundur
		const ROIDS_VERT = 10; //medallag tala af vertices i hverja loftsteinn
		const ROIDS_JAG = 0.4; //hversu hvassir loftsteinar eru, 0 til 1

		
		var canv = document.getElementById("gameCanvas");
		var ctx = canv.getContext("2d");

		var ship = { //hvar skipid er og onnur properties
			x: canv.width / 2,
			y: canv.height /2,
			r: SHIP_SIZE / 2,
			a: 90 / 180*Math.PI,  //convert to radians
			rot: 0,
			thrusting: false,
			thrust: {//heldur hreyfiorku
				x: 0,
				y: 0
			}
		}

		var roids = [];
		createAsteroidBelt();//byr til loftsteina

		//event handlers
		document.addEventListener("keydown", keyDown);
		document.addEventListener("keyup", keyUp);

		//set up game loop
		setInterval(update, 1000 / FPS);

		function createAsteroidBelt() {
			roids = [];
			var x, y;
			for (var i = 0; i < ROIDS_NUM; i++) {
				do {
				x = Math.floor(Math.random() * canv.width);
				y = Math.floor(Math.random() * canv.height);
				} while (distBetweenPoints(ship.x, ship.y, x, y) < ROIDS_SIZE * 2 + ship.r); //callar a function sem stjornar hversu nalegt loftsteinar mega byrjar hja spilaran
				roids.push(newAsteroid(x, y));
			
			}
		}

		function distBetweenPoints(x1, y1, x2, y2) {//stjornar fjarlegd af hvar loftsteinar mega byrja
			return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
		};

		function keyDown(ev){
			switch(ev.keyCode){
				case 37: //vinstri orvi, snyr til vinstri
					ship.rot = TURN_SPEED / 180 * Math.PI / FPS;
					break;
				case 38: //upp orvi, afram
					ship.thrusting = true;
					break; //haegri orvi, snyr til haegri
				case 39:
					ship.rot = -TURN_SPEED / 180 * Math.PI / FPS;
					break;
			}
		}

		function keyUp(ev) {
			switch(ev.keyCode){
				case 37: //vinstri orvi, haettir snuning til vinstri
					//ship.rot * 0.25;
					ship.rot = 0;
					break;
				case 38: //upp orvi
					ship.thrusting = false;
					break; //haegri orvi, haettir snuning til haegri
				case 39:
					//ship.rot * 0.25;
					ship.rot = 0;
					break;
			}
		}

		function newAsteroid(x, y) { //hradi og stadsetningar a loftsteinum
			var roid = {
				x: x,
				y: y,
				xv: Math.random() * ROIDS_SPEED / FPS * (Math.random() < 0.5 ? 1 : -1),
				yv: Math.random() * ROIDS_SPEED / FPS * (Math.random() < 0.5 ? 1 : -1),//var med vandamal þar sem eg var med tvo xv enn eg loksins tok eftir og breytti einn yfir i yv eftir ad bera saman grunnskrainn vid mina utgafu
				r: ROIDS_SIZE / 2, //radius/staerd
				a: Math.random() * Math.PI * 2, //i radians
				vert: Math.floor(Math.random() * (ROIDS_VERT + 1) + ROIDS_VERT /2), //vertex
				offs: []//vertex offset
			};
			
			//bua til og fjolga vertex offset array
			for (var i = 0; i < roid.vert; i++) {
                roid.offs.push(Math.random() * ROIDS_JAG * 2 + 1 - ROIDS_JAG);
            }

			return roid;
		}

		function update() {
			// teiknar bakrunnin
			ctx.fillStyle = "black"
			ctx.fillRect(0,0, canv.width, canv.height);

			//yta skipid
			if (ship.thrusting) {
				ship.thrust.x += SHIP_THRUST * Math.cos(ship.a) / FPS;
				ship.thrust.y -= SHIP_THRUST * Math.sin(ship.a) / FPS;
				
				//teikna bakeldinn

				ctx.fillStyle = "orange"
				ctx.strokeStyle = "cyan"
				ctx.lineWidth = SHIP_SIZE / 10;
				ctx.beginPath();
				ctx.moveTo( // rear left
					ship.x - ship.r * (2/3 * Math.cos(ship.a) + 0.5 * Math.sin(ship.a)),
					ship.y + ship.r * (2/3 * Math.sin(ship.a) - 0.5 * Math.cos(ship.a))
				);
				ctx.lineTo( //aftan skipid
					ship.x - ship.r * (5/3 * Math.cos(ship.a)),
					ship.y + ship.r * (5/3 * Math.sin(ship.a))
				);
				ctx.lineTo( //rear right ship
					ship.x - ship.r * (2/3 * Math.cos(ship.a) - 0.5 * Math.sin(ship.a)),
					ship.y + ship.r * (2/3 * Math.sin(ship.a) + 0.5 * Math.cos(ship.a))
				);
				ctx.closePath();
				ctx.fill();
				ctx.stroke();

			} else {
				ship.thrust.x -= FRICTION * ship.thrust.x / FPS;
				ship.thrust.y -= FRICTION * ship.thrust.y / FPS;//:eyes:
			}

			// teiknar thrihyrnt skip
			ctx.strokeStyle = "white";//breyta skip litid seinna
			ctx.lineWidth = SHIP_SIZE / 20;
			ctx.beginPath();
			ctx.moveTo( // nose of the ship
				ship.x + 4/3 * ship.r * Math.cos(ship.a),
				ship.y - 4/3 * ship.r * Math.sin(ship.a)
			);
			ctx.lineTo( //rear left ship
				ship.x - ship.r * (2/3 * Math.cos(ship.a) + Math.sin(ship.a)),
				ship.y + ship.r * (2/3 * Math.sin(ship.a) - Math.cos(ship.a))
			);
			ctx.lineTo( //rear right ship
				ship.x - ship.r * (2/3 * Math.cos(ship.a) - Math.sin(ship.a)),
				ship.y + ship.r * (2/3 * Math.sin(ship.a) + Math.cos(ship.a))
			);
			ctx.closePath();
			ctx.stroke();

			if (SHOW_BOUNDING){//reikningar og teikning af "collision" fyrir skipid
				ctx.strokeStyle = "lime";
				ctx.beginPath();
				ctx.arc(ship.x, ship.y, ship.r, 0, Math.PI*2, false);
				ctx.stroke();

			}
			//halda afram her 1:01:19

			//teikna loftsteina
			ctx.strokeStyle = "slategrey";
			ctx.lineWidth = SHIP_SIZE / 20;
			var x, y, r, a, offs, vert;
			for (var i = 0; i < roids.length; i++) {
				
				//na i loftsteina properties
				x = roids[i].x;
				y = roids[i].y;
				r = roids[i].r;
				a = roids[i].a;
				offs = roids[i].offs;//offset
				vert = roids[i].vert;
				

				//teikna leid
				ctx.beginPath();
                ctx.moveTo(
                    x + r * offs[0] * Math.cos(a),
                    y + r * offs[0] * Math.sin(a)
                );

				//teikna 2D polygon
				for (var j = 1; j < vert; j++) {
                    ctx.lineTo(
                        x + r * offs[j] * Math.cos(a + j * Math.PI * 2 / vert),
                        y + r * offs[j] * Math.sin(a + j * Math.PI * 2 / vert)
                    );
				}
				ctx.closePath();
				ctx.stroke();

				//hreyfa loftsteinin
				roids[i].x += roids[i].xv; //xv = x velocity átt
				roids[i].y += roids[i].yv;

				//hondla skja bordanna
				if (roids[i].x < 0 - roids[i].r) {
					roids[i].x = canv.width + roids[i].r;
				} else if (roids[i].x > canv.width + roids[i].r) {
					roids[i].x = 0 - roids[i].r
				}
				if (roids[i].y < 0 - roids[i].r) {
					roids[i].y = canv.height + roids[i].r;
				} else if (roids[i].x > canv.height + roids[i].r) {
					roids[i].y = 0 - roids[i].r
				}
			}

			// snua skipid
			ship.a += ship.rot;
			// hreyfa skipid
			ship.x += ship.thrust.x;
			ship.y += ship.thrust.y;

			//hondla ad fara i gegnum bordanna ad skjanum
			if (ship.x < 0 - ship.r) {
				ship.x = canv.width + ship.r;
			} else if (ship.x > canv.width + ship.r){
				ship.x = 0 - ship.r
			}
			if (ship.y < 0 - ship.r) {
				ship.y = canv.height + ship.r;
			} else if (ship.y > canv.height + ship.r){
				ship.y = 0 - ship.r
			}

			//centre dot/midjan ad skipid
			if (SHOW_CENTRE_DOT) {
                ctx.fillStyle = "aqua";
                ctx.fillRect(ship.x - 1, ship.y - 1, 2, 2);
            }



		} //<-- endan a update functionid, allt fyrir utan þvi getur ekki fengið update
