function start_game(){
	name = prompt("Nom del jugador");
	
	sessionStorage.setItem("username", name);
	
	loadpage("./HTML/game.html");
}

function phaser_game(){
	loadpage("./HTML/phasergame.html");
}

function phaser_game_mode2(){
	loadpage("./html/phasergame_mode2.html");
}

function exit (){
	if (name != ""){
		alert("Sortint del joc de l'" + name);
	}
	name = "";
}

function options(){
	loadpage("./HTML/options.html");
}

function load(){
	loadpage("./HTML/load.html");
}