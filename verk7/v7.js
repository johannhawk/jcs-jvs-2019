let header = document.getElementById("container").innerHTML = "<center><h1>API tenging</h1></center><br><div id=filt></div><br><div id=main class=grid-container></div>";

var filt = document.getElementById("filt");
var mainco = document.getElementById("main");

//data url: http://apis.is/concerts

function nameFilter(rData) {
	find = document.getElementById('nameSearch').value.toLowerCase();//tekur value ut ur search bar, gerir það að lowercase
	sDate = document.getElementById('startDate').value;//tekur value ut ur fyrra date input
	eDate = document.getElementById('endDate').value;//tekur value ut ur seinna date input

	//String.prototype.includes() verdur notad
	let rArray = [];
	let newArray = [];
	for (let i = 0; i < rData.results.length; i++) {
		let bah = rData.results[i].eventDateName.toLowerCase();//tekur eventdate name og gerir það að lowercase til að vinna með .includes()

		let year = rData.results[i].dateOfShow.substr(0,4);
		let month = rData.results[i].dateOfShow.substr(5,2);
		let day = rData.results[i].dateOfShow.substr(8,2);//taka efni ut ur array sem er haegt ad nota og gera þau léttara að höndla
		if (bah.includes(find) || find == '') {//search filter
			if (sDate.substr(0,4) <= year && year <= eDate.substr(0,4)){//ára filter
				if (sDate.substr(5,2) <= month && month <= eDate.substr(5,2)){//mánaðar filter
					if(sDate.substr(8,2) <= day && day <= eDate.substr(8,2)){//daga filter
						rArray[i] = rData.results[i];
						}
					}
				}
			}
		}	
	newArray = rArray.filter(function(){return true;});
	//for loop i fet() function vil að telja upp frá 0 og ekki fyrsta tölunna sem filterið sem ég gerði gefur það svo ég nota annan filter til að laga það 
	return newArray;
};

function timeisl(unt) {//gerir timan meira læsilegt
	let isl = unt.replace(/T/, " | kl. ");

	return isl;
};

//þarf að finna út ef async er nauðsynlegt, það er ekki á verkefnalýsinguna
//async function fet() {

//https ekki http svo það passar í github pages
function fet() { fetch('https://apis.is/concerts')  //  JSON skrá sem eru local (ekki á miðlarar) hleðst ekki, færð villumeldingu, sjá console 
  .then(
    function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' + response.status);
        return;
      }

      // Examine the text in the response
      response.json().then(function(data) {
      	mainco.innerHTML = "";//hreinsar HTMLið
        /*
        console.log(data); // hráar uppllýsingar, ég get notið það til að bera saman það sem kemur á síðunna við hráa efnið til að sjá ef eitthvað fór úrskeiðis
        console.log(data.results);
        console.log(data.results[0].eventDateName);
        console.log(data.results[1].eventDateName); // úttak er strengur td: U2 Tribute Austurland að Glettingi		
		*/
        let fdata = [];

        fdata = nameFilter(data);//filter
        //console.log(fdata);

        //6 hlutir til ad vinna med .eventDateName; .name; .dateOfShow; .eventHallName; .userGroupName; .imageSource;
		 		
		for (let i = 0; i < fdata.length; i++) { //nota data.results.length ekki data.length
			let timeread = timeisl(fdata[i].dateOfShow);//þetta function sækir datetime strengin og breytir framsetninguna
			let here = document.createElement("here");//"here" byggir nytt element
			here.innerHTML = "<div class=grid-item><b>" //HTML sett saman
			+ fdata[i].eventDateName + "</b><br>" + 
			fdata[i].name + "<br>" + 
			fdata[i].userGroupName + "<br>" + 
			fdata[i].eventHallName + "<br>" + 
			timeread + "<br>" + 
			"<img src="+fdata[i].imageSource+">" + "</div>"; 
			
			mainco.appendChild(here);//tekur "here" og bætir það á HTMLið
			
		}
      });
    }
  )
  //ef error gerist það mun gera 'catch' á errorið hérna
  .catch(function(err) {
    console.log('Fetch Error :-S', err);
  }); 
};

fet();//fetch function

//html fyrir leitar filter og dagatals filter formin, hefur "onkeyup" og "onselect" til að kalla á fall
filt.innerHTML = "<center><input type=text id=nameSearch onkeyup=fet() placeholder='Leita...'></center>"
+ "<br><center><input type=date id=startDate oninput=fet() value=2019-12-01 min=2019-12-01 max=2020-01-01>" 
+ "<input type=date id=endDate oninput=fet() value=2019-12-31 min=2019-12-01 max=2020-01-01></center>";

