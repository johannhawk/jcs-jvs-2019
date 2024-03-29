//https://www.youtube.com/watch?v=H9CSWMxJx84
//adal tutorial, onnur tutorial eru adallega litla hlutir eins og litir og links

//js lint, js hint
		const FPS = 30; //frames per second

		const FRICTION = 0.7; // loft motkraftur coefficient, 0 = no friction, 1 = lots of friction

		const GAME_LIVES = 3; //byrjunar numer ad lif sem eru eftir

		const SHIP_SIZE = 30; // haed skip i pixels
		const SHIP_THRUST = 5; //hrodum skipins i pixels hverja sekundur
		const TURN_SPEED = 360; // beygju hradi i gradur a sekundu
		const SHIP_EXPLODE_DUR = 0.3; //timabil af skip sprengingu
		const SHIP_BLINK_DUR = 0.1; //hversu hratt skipid blikkar þegar það hefur "i-frames"
		const SHIP_INV_DUR = 3;//"i-frame" timabil þegar skipid kemur a skjainn

		const LASER_EXPLODE_DUR = 0.1; //timabil af skot sprengingu
		const LASER_MAX = 10; //hversu morg skot mega vera a skjanum
		const LASER_SPEED = 500; //hversu hratt skotinn fara a pixlar/sekundur
		const LASER_DIST = 0.9; //hversu lengi skotinn verda a skjainn eftir skja vidd

		const SHOW_BOUNDING = false; //syna/fela arekstrar hringi
		const SHOW_CENTRE_DOT = true; //syna/fela punktinn i midju skipinnu

		const ROID_NUM = 6; //hversu margar loftsteinar leikurinn byrjar med
		const ROID_SIZE = 100; //byrjunar staerd i pixlum
		const ROID_SPEED = 50; //hamarks byrjunar hradi i pixla hverja sekundur
		const ROID_VERT = 10; //medallag tala af vertices i hverja loftsteinn
		const ROID_JAG = 0.4; //hversu hvassir loftsteinar eru, 0 til 1

		const ROID_PTS_LGE = 20;//stig fyrir stora steina
		const ROID_PTS_MED = 50;//stig fyrir midlungs steina
		const ROID_PTS_SML = 100;//stig fyrir litla steina

		const TEXT_FADE_TIME = 2.5; //hversu lengi textinn verdur ekki gegnsae
		const TEXT_SIZE = 40; //haed text font i pixlum


		let SHIP_COLOR = "white"; //hvada litur skipid er
		
		var canv = document.getElementById("gameCanvas");
		var ctx = canv.getContext("2d");

		//setur up leikja parameters
		var level, lives, score, roids, ship, text, textAlpha;//alpha er fyrir gegnsaei
		newGame();

		
		

		//event handlers, tekur eftir hvort lyklar a lyklabordinnu eru snert
		document.addEventListener("keydown", keyDown);
		document.addEventListener("keyup", keyUp);

		//set up game loop
		setInterval(update, 1000 / FPS);

		function createAsteroidBelt() {
			roids = [];
			var x, y;
			for (var i = 0; i < ROID_NUM + level; i++) {
				do {
				x = Math.floor(Math.random() * canv.width);
				y = Math.floor(Math.random() * canv.height);
				} while (distBetweenPoints(ship.x, ship.y, x, y) < ROID_SIZE * 2 + ship.r); //callar a function sem stjornar hversu nalegt loftsteinar mega byrjar hja spilaran
				roids.push(newAsteroid(x, y, Math.ceil(ROID_SIZE / 2)));//
			
			}
		}

		function destroyAsteroid(index){
			var x = roids[index].x;
			var y = roids[index].y;
			var r = roids[index].r;

			//skera up loftsteinin i minni bita ef haegt
			if (r == Math.ceil(ROID_SIZE / 2)) {
				roids.push(newAsteroid(x,y,Math.ceil(ROID_SIZE / 4)));
				roids.push(newAsteroid(x,y,Math.ceil(ROID_SIZE / 4)));
				score += ROID_PTS_LGE;
			} else if (r == Math.ceil(ROID_SIZE / 4)) {
				roids.push(newAsteroid(x,y,Math.ceil(ROID_SIZE / 8)));
				roids.push(newAsteroid(x,y,Math.ceil(ROID_SIZE / 8)));
				score += ROID_PTS_MED;
			} else {
				score += ROID_PTS_SML;
			}
			//eydileggja loftsteinin
			roids.splice(index, 1);

			//nytt bord thegar allir steinarnir eru farinn
			if (roids.length == 0) {
				level++;
				newLevel();
			}
		}

		function distBetweenPoints(x1, y1, x2, y2) {//stjornar fjarlegd af hvar loftsteinar mega byrja
			return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
		};

		function drawShip(x, y, a) {
			if (lives == 3) {//breytir litid a skipnum eftir thvi hversu morg lif eru eftir
				SHIP_COLOR = "White";
			} else if (lives == 2) {
				SHIP_COLOR = "royalblue";
			} else if (lives == 1) {
				SHIP_COLOR = "gold";
			} 
			ctx.strokeStyle = SHIP_COLOR;//gerdi thad orduvisi olikt leidbeininga a 2:06:04
			ctx.lineWidth = SHIP_SIZE / 20;
			ctx.beginPath();
			ctx.moveTo( // nose of the ship
				x + 4/3 * ship.r * Math.cos(a),
				y - 4/3 * ship.r * Math.sin(a)
			);
			ctx.lineTo( //rear left ship
				x - ship.r * (2/3 * Math.cos(a) + Math.sin(a)),
				y + ship.r * (2/3 * Math.sin(a) - Math.cos(a))
			);
			ctx.lineTo( //rear right ship
				x - ship.r * (2/3 * Math.cos(a) - Math.sin(a)),
				y + ship.r * (2/3 * Math.sin(a) + Math.cos(a))
			);
			ctx.closePath();
			ctx.stroke();
		}

		function explodeShip() {
			ship.explodeTime = Math.ceil(SHIP_EXPLODE_DUR * FPS);

		}

		function gameOver() {
			ship.dead = true;
			text = "Game Over";
			textAlpha = 1.0;
		}

		function keyDown(ev){
			if (ship.dead) {//ef skipid er "dautt" tha ekki lesa fleiri lykla
				return;
			}

			switch(ev.keyCode){
				case 32: //spacebar, skytur skot
					shootLaser();
					break;
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
			if (ship.dead) {//ef skipid er "dautt" tha ekki lesa fleiri lykla
				return;
			}

			switch(ev.keyCode){
				case 32: //spacebar, stoppa og leyfa naesta skotid
					ship.canShoot = true;
					break;
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

		function newAsteroid(x, y, r) { //hradi og stadsetningar a loftsteinum
			var lvlMult = 1 + 0.1 * level;//haekkar loftsteina hradan eftir hvada bord thu ert i
			var roid = {
				x: x,
				y: y,
				xv: Math.random() * ROID_SPEED * lvlMult / FPS * (Math.random() < 0.5 ? 1 : -1),
				yv: Math.random() * ROID_SPEED * lvlMult / FPS * (Math.random() < 0.5 ? 1 : -1),//var med vandamal þar sem eg var med tvo xv enn eg loksins tok eftir og breytti einn yfir i yv eftir ad bera saman grunnskrainn vid mina utgafu
				r: r, //radius/staerd
				a: Math.random() * Math.PI * 2, //i radians
				vert: Math.floor(Math.random() * (ROID_VERT + 1) + ROID_VERT /2), //vertex
				offs: []//vertex offset
			};
			
			//bua til og fjolga vertex offset array
			for (var i = 0; i < roid.vert; i++) {
                roid.offs.push(Math.random() * ROID_JAG * 2 + 1 - ROID_JAG);
            }

			return roid;
		}

		function newGame() {
			level = 0;
			score = 0;
			lives = GAME_LIVES;
			ship = newShip();//setur upp skipid
			newLevel();
		}

		function newLevel() {
			text = "Level "+ (level+1)
			textAlpha = 1.0;
			createAsteroidBelt();//byr til loftsteina
		}

		function newShip() {//byr til fyrsta skipid og getur gert það aftur
			return { //hvar skipid er og onnur properties
				x: canv.width / 2,
				y: canv.height /2,
				r: SHIP_SIZE / 2,
				a: 90 / 180*Math.PI,  //convert to radians
				blinkNum: Math.ceil(SHIP_INV_DUR / SHIP_BLINK_DUR),
				blinkTime: Math.ceil(SHIP_BLINK_DUR * FPS),
				canShoot: true,
				dead: false,
				explodeTime: 0,
				lasers: [],
				rot: 0,
				thrusting: false,
				thrust: {//heldur hreyfiorku
					x: 0,
					y: 0
				}
			}
		}


		//hugmynd: mogulega bara skjota sjalfkrafa og nota spacebar til ad skjota staerri skot
		function shootLaser() {
			//byr til skotid og setur hradan fyrir það
			if (ship.canShoot && ship.lasers.length < LASER_MAX){
				ship.lasers.push({//fra nef skipsins
					x: ship.x + 4/3 * ship.r * Math.cos(ship.a),
					y: ship.y - 4/3 * ship.r * Math.sin(ship.a),
					xv: LASER_SPEED * Math.cos(ship.a) / FPS,
					yv: -LASER_SPEED * Math.sin(ship.a) / FPS,
					dist: 0,
					explodeTime: 0
				})
			}
			//stoppar fleiri skot
			ship.canShoot = false;
		}

		function update() {
			var blinkOn = ship.blinkNum % 2 == 0;//reikning tengd hvenaer skipid blikkar
			var exploding = ship.explodeTime > 0;//reikning tengd hvenaer skipid springur

			// teiknar bakrunnin
			ctx.fillStyle = "black"
			ctx.fillRect(0,0, canv.width, canv.height);

			//yta skipid
			if (ship.thrusting && !ship.dead) {
				ship.thrust.x += SHIP_THRUST * Math.cos(ship.a) / FPS;
				ship.thrust.y -= SHIP_THRUST * Math.sin(ship.a) / FPS;
				
				//teikna bakeldinn
				if (!exploding && blinkOn) {//<= slekkur a eldinn ef skipid springur
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
				}

			} else {
				ship.thrust.x -= FRICTION * ship.thrust.x / FPS;
				ship.thrust.y -= FRICTION * ship.thrust.y / FPS;//:eyes:
			}

			// teikna thrihyrnt skip
			if (!exploding && !ship.dead) {//ef skipid springur mun þetta if passa það verð ekki teiknað strax aftur, ef thad er engin lif tha ekki teikna lengur
				if (blinkOn) {
					drawShip(ship.x,ship.y, ship.a);
				}
				//hondla blikk
				if (ship.blinkNum > 0) {
					//laekka blikk tima
					ship.blinkTime--;

					//laekka blikk numer
					if (ship.blinkTime == 0){
						ship.blinkTime = Math.ceil(SHIP_BLINK_DUR * FPS);
						ship.blinkNum--;
					}
				}
			} else {
				//teikna sprengingu
				ctx.fillStyle = "darkred";
				ctx.beginPath();
				ctx.arc(ship.x, ship.y, ship.r * 1.7, 0, Math.PI*2, false);
				ctx.fill();
				ctx.fillStyle = "red";
				ctx.beginPath();
				ctx.arc(ship.x, ship.y, ship.r * 1.4, 0, Math.PI*2, false);
				ctx.fill();
				ctx.fillStyle = "orange";
				ctx.beginPath();
				ctx.arc(ship.x, ship.y, ship.r * 1.1, 0, Math.PI*2, false);
				ctx.fill();
				ctx.fillStyle = "yellow";
				ctx.beginPath();
				ctx.arc(ship.x, ship.y, ship.r * 0.8, 0, Math.PI*2, false);
				ctx.fill();
				ctx.stroke();
				ctx.fillStyle = "LightGoldenRodYellow";
				ctx.beginPath();
				ctx.arc(ship.x, ship.y, ship.r * 0.5, 0, Math.PI*2, false);
				ctx.fill();
				ctx.stroke();
			}
			

			if (SHOW_BOUNDING){//reikningar og teikning af "collision" fyrir skipid
				ctx.strokeStyle = "lime";
				ctx.beginPath();
				ctx.arc(ship.x, ship.y, ship.r, 0, Math.PI*2, false);
				ctx.stroke();

			}

			//teikna skot
			for (var i = 0; i < ship.lasers.length; i++) {
                if (ship.lasers[i].explodeTime == 0) {
                    ctx.fillStyle = "salmon";
                    ctx.beginPath();
                    ctx.arc(ship.lasers[i].x, ship.lasers[i].y, SHIP_SIZE / 15, 0, Math.PI * 2, false);
                    ctx.fill();
                } else {
					//teikna skot sprengingu
					ctx.fillStyle = "orangered";
                    ctx.beginPath();
                    ctx.arc(ship.lasers[i].x, ship.lasers[i].y, ship.r * 0.75, 0, Math.PI * 2, false);
                    ctx.fill();
                    ctx.fillStyle = "salmon";
                    ctx.beginPath();
                    ctx.arc(ship.lasers[i].x, ship.lasers[i].y, ship.r * 0.5, 0, Math.PI * 2, false);
                    ctx.fill();
                    ctx.fillStyle = "pink";
                    ctx.beginPath();
                    ctx.arc(ship.lasers[i].x, ship.lasers[i].y, ship.r * 0.25, 0, Math.PI * 2, false);
                    ctx.fill();
                }
            }

            //teikna leikja texta
            if (textAlpha >= 0) {
            	ctx.textAlign = "center";
            	ctx.textBaseline = "middle";
            	ctx.fillStyle = "rgba(255, 255, 255, " + textAlpha + ")";
            	ctx.font = "small-caps " + TEXT_SIZE + "px dejavu sans mono";
            	ctx.fillText(text, canv.width /2, canv.height * 0.75);
            	textAlpha -= (1.0 / TEXT_FADE_TIME / FPS);
            } else if (ship.dead) {//byrjar leikin aftur thegar "game over" textin er farinn
            	newGame();
            }

            // teikna lif
            var lifeColour;
            for (var i = 0; i < lives; i++) {
            	lifeColour = exploding && i == lives - 1 ? "red" : "white";
            	drawShip(SHIP_SIZE + i * SHIP_SIZE * 1.2, SHIP_SIZE, 0.5 * Math.PI, lifeColour);
            }

            // teikna stig
            ctx.textAlign = "right";
        	ctx.textBaseline = "middle";
		   	ctx.fillStyle = "white";
		   	ctx.font = TEXT_SIZE + "px dejavu sans mono";
		   	ctx.fillText(score, canv.width - SHIP_SIZE / 2 - 10, SHIP_SIZE);
            	


			//kikja þegar skot hitta loftsteina
			var ax, ay, ar, lx, ly;//ax/ay eru fyrir loftsteina, lx/ly eru fyrir skotin
			for (var i = roids.length - 1; i >= 0; i--) {

				//saekja loftsteina properties
				ax = roids[i].x;
				ay = roids[i].y;
				ar = roids[i].r;

				// setja loop yfir skotinn
				for (var j = ship.lasers.length - 1; j >= 0; j--) {

					//saekja skot properties
					lx = ship.lasers[j].x;
					ly = ship.lasers[j].y;

					// kikja hvort skotin hitta
					if (ship.lasers[j].explodeTime == 0 && distBetweenPoints(ax,ay,lx,ly) < ar) {

						
						//fjarlega stein og kveikja a skot sprengingu
						destroyAsteroid(i);
						ship.lasers[j].explodeTime = Math.ceil(LASER_EXPLODE_DUR * FPS);
						break;
					}
				}
			}

			//teikna loftsteina
			var x, y, r, a, offs, vert;
			for (var i = 0; i < roids.length; i++) {
				ctx.strokeStyle = "slategrey";
				ctx.lineWidth = SHIP_SIZE / 20;
				
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

				//teikna 2D polygon fyrir loftsteinana
				for (var j = 1; j < vert; j++) {
                    ctx.lineTo(
                        x + r * offs[j] * Math.cos(a + j * Math.PI * 2 / vert),
                        y + r * offs[j] * Math.sin(a + j * Math.PI * 2 / vert)
                    );
				}
				ctx.closePath();
				ctx.stroke();

				if (SHOW_BOUNDING){//reikningar og teikning af "collision" fyrir loftsteinana
					ctx.strokeStyle = "red";
					ctx.beginPath();
					ctx.arc(x, y, r, 0, Math.PI*2, false);
					ctx.stroke();

				}
			}

			//kikja hvort skipid rekst a stein
			if (!exploding) { //stoppar hreyfingar ef skipid springur
				if(ship.blinkNum == 0 && !ship.dead) {//kikir ef skipid hefur "i-frames" til ad vernda thad
					for (var i = 0; i < roids.length; i++) {
						if (distBetweenPoints(ship.x,ship.y, roids[i].x, roids[i].y) < ship.r + roids[i].r){
							explodeShip();
							destroyAsteroid(i);
							break;//thetta break er svo skipid brytur ekki marga steina i einu
						}
					}
				}

				// snua skipid
				ship.a += ship.rot;

				// hreyfa skipid
				ship.x += ship.thrust.x;
				ship.y += ship.thrust.y;
			} else {
				//laekkar hversu mikill sprengi timi er eftir
				ship.explodeTime--;

				//gerir nytt skip þegar sprengingin er buinn
				if (ship.explodeTime == 0) {
					lives--;
					if (lives == 0) {
						gameOver();
					} else{
						ship = newShip();
					}
				}
			}

			//hondla ad fara i gegnum bordanna ad skjanum fyrir skipid
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

			//hreyfa skotinn
			for (var i = ship.lasers.length - 1; i >= 0; i--) {
				//kikja a skot ferdalengd
				if (ship.lasers[i].dist > LASER_DIST * canv.width) {//villa lagad: nota "lasers" ekki "laser"
					ship.lasers.splice(i, 1);//"splice" fjarlaegir skotid fra leikin
					continue;
				}

				//hondlar skot sprengingu
				if (ship.lasers[i].explodeTime > 0) {
					ship.lasers[i].explodeTime--;

					//eyda skotid eftir thad springur
					if (ship.lasers[i].explodeTime == 0) {//villa lagad, ekki setja ; inni () i thetta skipti
						ship.lasers.splice(i, 1);
						continue;
					}
				} else {
					//hreyfir skot
					ship.lasers[i].x += ship.lasers[i].xv;
					ship.lasers[i].y += ship.lasers[i].yv;

					//reikna hversu langt skotinn hafa farid
					ship.lasers[i].dist += Math.sqrt(Math.pow(ship.lasers[i].xv, 2) + Math.pow(ship.lasers[i].yv, 2));
				}


				//hondla skja bordanna fyrir skotinn
				if (ship.lasers[i].x < 0) {
					ship.lasers[i].x = canv.width;
				} else if (ship.lasers[i].x > canv.width) {
					ship.lasers[i].x = 0
				}
				if (ship.lasers[i].y < 0) {
					ship.lasers[i].y = canv.height;
				} else if (ship.lasers[i].y > canv.height) {
					ship.lasers[i].y = 0
				}
			}		

			//hreyfa loftsteinana
			for (var i = 0; i < roids.length; i++) {
				roids[i].x += roids[i].xv; //xv = x velocity átt
				roids[i].y += roids[i].yv;

				//hondla skja bordanna fyrir loftsteinnana
				if (roids[i].x < 0 - roids[i].r) {
					roids[i].x = canv.width + roids[i].r;
				} else if (roids[i].x > canv.width + roids[i].r) {
					roids[i].x = 0 - roids[i].r
				}
				if (roids[i].y < 0 - roids[i].r) {
					roids[i].y = canv.height + roids[i].r;
				} else if (roids[i].y > canv.height + roids[i].r) {
					roids[i].y = 0 - roids[i].r
				}
			}

			//centre dot/midjan ad skipid
			if (SHOW_CENTRE_DOT) {
                ctx.fillStyle = "aqua";
                ctx.fillRect(ship.x - 1, ship.y - 1, 2, 2);
            }



		} //<-- endan a update functionid, allt fyrir utan þvi getur ekki fengið update
