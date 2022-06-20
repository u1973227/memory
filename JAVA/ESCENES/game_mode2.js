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
		var json = sessionStorage.getItem("config") || '{"cards":2,"dificulty":"easy", "punts":10}';
		var options_data = JSON.parse(json);
		var dificultat = options_data.dificulty;
		var cartes = options_data.cards;
        var puntuacio_negativa = options_data.punts;
		var arraycards_joc = arraycards_total.slice(0, cartes*2);
        this.score = 150;
        var centre_X = this.cameras.main.centerX;
        var centre_Y = this.cameras.main.centerY;



		var temps_girades = null;
		if (dificultat == "easy"){
			temps_girades = 2000;
			puntuacio_negativa = 10
		}
		else if (dificultat == "normal"){
			temps_girades = 1000;
			puntuacio_negativa = 15;
		}
		else if (dificultat == "hard"){
			temps_girades = 500;
			puntuacio_negativa = 20;
		}

        //Barreja de les cartes per a que no surtin les parelles una al costat de l'altre
		arraycards_joc.sort((a,b) => 0.5 - Math.random())

        //Distribucio per columnes i files
		if (cartes < 5){
			var columnes = cartes;
			var files = 2;
		}
		else{
			var columnes = cartes;
			var files = 2;
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
        var aux = false
        var level = 0;
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
						for (let a = 0; a < cartes*2; a++){
							for (let i = 0; i < columnes; i++){
								for(let j = 0; j < files; j++){
									let carta_girada = this.add.image(i * 125 + centre_X - (cartes / 2)*100, j * 150 + centre_Y - (cartes * 128)/4, arraycards_joc[c]);
									destructor.push(carta_girada);		
									c += 1;				
								}
							}
						}
						setTimeout(() =>{
							for (let nose = 0; nose < cartes*2; nose++){
								console.log(destructor[nose])
								destructor[nose].destroy();
							}
						},temps_girades);
						//Tractament de fi de joc
						if (this.score <= 0){
							alert("FI DEL JOC");
                            options_data.cards = 2;                 //M'he trobat amb el problema de que no es reiniciaven les variables aixi que les reinicio a mà
                            options_data.dificulty = "easy";
                            options_data.punts = 10;
                            sessionStorage.setItem("config", JSON.stringify(options_data));
							loadpage("../");
						}
					}
					//Si ho fem bé
					else{
						this.correct++;
						if (this.correct >= cartes){
							this.correct = 0;
                            level++;
                            //Augmentem la dificultat
                            if(dificultat == "easy"){  
                                dificultat = "normal";
                            }
                            else if(dificultat == "normal"){
                                dificultat = "hard";
                            }
                            //Augmentem la quantitat de parells de cartes que tenim
                            if(cartes < 6){
                                cartes++;
                            }

                            if (dificultat == "hard"){
                            	puntuacio_negativa += 5;
                            }

                            //Actualitzem les variables de opcions
                            options_data.dificulty = dificultat;
                            options_data.cards = cartes;
                            options_data.punts = puntuacio_negativa
                            sessionStorage.setItem("config", JSON.stringify(options_data));
                            //Actualitzem l'escena per a la següent ronda
                            this.scene.restart();
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
