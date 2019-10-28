var qCount = 0;
var yonCount;

var header = document.getElementById("container").innerHTML = "<center><h1>Q App</h1></center><br><div id=input></div>";
//setjur <h1> Q App sem a ekki ad breytast neitt, ef ekkert <h1> Q App kemur tha veit eg strax allt virkar ekki

var input = document.getElementById("input").innerHTML = "<iframe width=560 height=315 src=https://www.youtube.com/embed/GaoLU6zKaws frameborder=0 allow=accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture allowfullscreen></iframe><br>Hvaða hljóðfæri er þetta? <a href=https://youtu.be/GaoLU6zKaws>Video Link</a><br><ul class=q-list1><li>Flute</li><li>Keyboard</li><li>Saxophone</li><li>Tuba</li></ul>";
//gamans video efni
const qList1 = document.querySelectorAll(".q-list1 li")

for(ques of qList1) {//breytir litir og leyfir thig ad yta a nofnin eins og takkar
	ques.addEventListener("mouseover", function(){
		this.style.backgroundColor = "cyan";
	});
	ques.addEventListener("mouseout", function(){
		this.style.backgroundColor = "white";
	});
	ques.addEventListener('click', function(){
		this.style.backgroundColor = "red";//rautt fyrir rangt svar
		if (this.textContent == "Saxophone") {
			this.style.backgroundColor = "green";
			setTimeout(function(){var input = document.getElementById("input").innerHTML = "Er siðasta myndbandið notað sem dæmi?<br><ul class=q-list2><li>Yes</li><li>No</li></ul>";
			//timeout er her svo það er hægt að sjá takkan vera grænt fyrir rétt svar í smá stund


				const qList2 = document.querySelectorAll(".q-list2 li")

				for(yon of qList2) {//eins og fyrsta for lykkjan
					yon.addEventListener("mouseover", function(){
						this.style.backgroundColor = "cyan";
					});
					yon.addEventListener("mouseout", function(){
						this.style.backgroundColor = "white";
					});
					yon.addEventListener('click', function(){
						this.style.backgroundColor = "red";
						if(this.textContent == "Yes") {
							this.style.backgroundColor = "green";
							setTimeout(location.reload(),1000);
						}
					})
			}
			},1000);//timeout endar her
		}
	});
}

