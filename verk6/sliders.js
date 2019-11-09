
//1.tables tafla med nofn og stiga numer

//2. Notaðu og stilltu UI range slider eftir þörfum https://refresh-less.com/nouislider/

//3.Búðu til síu(e.filter) sem tengir leikjaskor við e.slider gildi(minogmaxgildi)
//bara reyna nota filter

//4. Notandi á að geta með gagnvirkum hætti stýrt e.slider sem birtir síuð gögn
//nota DOM liklega

var header = document.getElementById("container").innerHTML = "<center><h1>Slider App</h1></center><br><div id=slider-handles></div><br><input id=input-number></input><input id=input-number2></input><br><div id=table></div>";

var table = document.getElementById("table").innerHTML = "<table style=width:100 id=content></table>";
document.getElementById("table").style.border = "1px solid black"

var content = document.getElementById("content").innerHTML = "<tr><th>Nafn</th><th>Stig</th></tr><tr><td>Novak</td><td>150</td></tr><tr><td>Martin</td><td>200</td></tr><tr><td>Matt</td><td>250</td></tr>";



var html5Slider = document.getElementById('slider-handles');

const players = [
      { name: 'Joseph', score: 75 },
      { name: 'Isaac', score: 150 },
      { name: 'Colt', score: 200 },
      { name: 'Marie', score: 250 },
      { name: 'Kepler', score: 421 }
    ];


noUiSlider.create(html5Slider, {
    start: [90, 300],
    connect: true,
    range: {
        'min': 0,
        'max': 500
    }
});



var inputNum = document.getElementById('input-number');
var inputNum2 = document.getElementById('input-number2');

html5Slider.noUiSlider.on('update', function (values, handle) {

    var value = values[handle];

    if (handle) {
        inputNum2.value = Math.round(value);
    } else {
        inputNum.value = Math.round(value);
    }
    updateFilt();//setur filter function i gang thegar slider update gerast
});

//breytir value af inputNum og inputNum2 thegar eventlistener tekur eftir breytingum
inputNum.addEventListener('change', function () {
    html5Slider.noUiSlider.set([this.value, null]);
});

inputNum2.addEventListener('change', function () {
    html5Slider.noUiSlider.set([null, this.value]);
});




function updateFilt() {
	//"hreinsar" og setur byrjunnin
	var html = "<table><tr><th>Nafn</th><th>Stig</th></tr><tr>"; 
	
	//set in nofn og stig
	for (var i=0; i < players.length; i++) {
		if (inputNum.value <= players[i].score && players[i].score <= inputNum2.value) {
		    html += "<td>" + players[i].name + "</td>";
		    html += "<td>" + players[i].score + "</td>";
		    html += "</tr><tr>";
		    //console.log(players[i]);
	    }
  	}
  	html += "</tr></table>";

  // ATTACH HTML TO CONTAINER
  document.getElementById("table").innerHTML = html;
	/*if(inputNum.value < 100){
		content = document.getElementById("content").innerHTML = "<tr><th>Nafn</th><th>Stig</th></tr><tr><td>Novak</td><td>150</td></tr><tr><td>Martin</td><td>200</td></tr><tr><td>Matt</td><td>250</td></tr>";

	} else
	content = document.getElementById("content").innerHTML = "test"
	*/
}


