class GameScene extends Phaser.Scene {
    constructor (){
        super('GameScene');
		this.cards = null;
		this.firstClick = null;
		this.score = 100;
		this.correct = 0;
    }

    preload (){	
		this.load.image('back', '../SPRITES/back.png');
		this.load.image('cb', '../SPRITES/cb.png');
		this.load.image('co', '../SPRITES/co.png');
		this.load.image('sb', '../SPRITES/sb.png');
		this.load.image('so', '../SPRITES/so.png');
		this.load.image('tb', '../SPRITES/tb.png');
		this.load.image('to', '../SPRITES/to.png');
	}
	
    create (){	
		let arraycards_total = ['co', 'co', 'cb', 'cb', 'sb', 'sb', 'so', 'so', 'tb', 'tb', 'to', 'to'];
		this.cameras.main.setBackgroundColor(0xdeb887);
		
		//Tractament de les opcions 
		var json = localStorage.getItem("config") || '{"cards":2,"dificulty":"hard"}';
		var options_data = JSON.parse(json);
		var dificultat = options_data.dificulty;
		var cartes = options_data.cards;
		var arraycards_joc = arraycards_total.slice(0, cartes*2);
        var centre_X = this.cameras.main.centerX;
        var centre_Y = this.cameras.main.centerY;


		//Tractament de variables segons la dificultat
		var puntuacio_negativa = null;
		var temps_girades = null;
		if (dificultat == "easy"){
			puntuacio_negativa = 5;
			temps_girades = 2000;
		}
		else if (dificultat == "normal"){
			puntuacio_negativa = 10
			temps_girades = 1000;
		}
		else if (dificultat == "hard"){
			puntuacio_negativa = 20;
			temps_girades = 500;
		}

		//Barreja de les cartes per a que no surtin les parelles una al costat de l'altre
		arraycards_joc.sort((a,b) => 0.5 - Math.random())

		//Distribucio per columnes i files
		if (cartes < 5){
			var columnes = cartes;
			var files = 2;
		}
		else{
			var columnes = 5;
			var files = 5;
		}

		var m = 0;
		for (let n = 0; n < columnes; n++){
			for(let k = 0; k < files; k++){
				this.add.image(n * 125 + centre_X - (cartes / 2)*100, k * 150 + centre_Y - (cartes * 128)/4, arraycards_joc[m]);
				m += 1;
			}
		}

		this.cards = this.physics.add.staticGroup();

		for (let p = 0; p < columnes; p++){
			for(let q = 0; q < files; q++){
				this.cards.create(p * 125 + centre_X - (cartes / 2)*100, q * 150 + centre_Y - (cartes * 128)/4, 'back');
			}	
		}
		
		let i = 0;
		this.cards.children.iterate((card)=>{
			card.card_id = arraycards_joc[i];
			i++;
			card.setInteractive();
			card.on('pointerup', () => {
				card.disableBody(true,true);
				if (this.firstClick){
					//Si fallem
					if (this.firstClick.card_id !== card.card_id){
						this.score -= puntuacio_negativa;
						this.firstClick.enableBody(false, 0, 0, true, true);
						card.enableBody(false, 0, 0, true, true);
						//Les girem per a que les pugui tornar a veure el jugador
						var destructor = [];
						let c = 0;
						for (let i = 0; i < columnes; i++){
							for(let j = 0; j < files; j++){
								var carta_girada = this.add.image(i * 125 + centre_X - (cartes / 2)*100, j * 150 + centre_Y - (cartes * 128)/4, arraycards_joc[c]);
								c += 1;
								destructor.push(carta_girada);						
							}
						}
					
						setTimeout(() =>{
							for (let n = 0; n < cartes*2; n++){
								destructor[n].destroy();
							}
						},temps_girades);
						//Tractament de fi de joc
						if (this.score <= 0){
							alert("FI DEL JOC");
							loadpage("../");
						}
					}
					//Si ho fem bé
					else{
						this.correct++;
						if (this.correct >= cartes){
							alert("Has GUANYAT amb " + this.score + " punts.");
							loadpage("../");
						}
					}
					this.firstClick = null;
				}
				else{
					this.firstClick = card;
				}
			}, card);
		});
	}
	update (){	}
}