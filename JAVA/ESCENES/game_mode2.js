class GameScene extends Phaser.Scene {
    constructor (){
        super('GameScene');
		this.cards = null;
		this.firstClick = null;
		this.score = 100;
		this.correct = 0;
    }

    preload (){	
		this.load.image('back', '../resources/back.png');
		this.load.image('cb', '../resources/cb.png');
		this.load.image('co', '../resources/co.png');
		this.load.image('sb', '../resources/sb.png');
		this.load.image('so', '../resources/so.png');
		this.load.image('tb', '../resources/tb.png');
		this.load.image('to', '../resources/to.png');
	}
	
    create (){	
		let arraycards_total = ['co', 'co', 'cb', 'cb', 'sb', 'sb', 'so', 'so', 'tb', 'tb', 'to', 'to'];
        this.cameras.main.setBackgroundColor(burlywood);
		
		//Tractament de les opcions 
		var json = localStorage.getItem("config") || '{"cards":2,"dificulty":"easy", "punts":10}';
		var options_data = JSON.parse(json);
		var dificultat = options_data.dificulty;
		var cartes = options_data.cards;
        var puntuacio_negativa = options_data.punts;
		var arraycards_joc = arraycards_total.slice(0, cartes*2);
        this.score = 150

		var temps_girades = null;
		if (dificultat == "easy"){
			temps_girades = 2000;
		}
		else if (dificultat == "normal"){
			temps_girades = 1000;
		}
		else if (dificultat == "hard"){
			temps_girades = 500;
		}

        //Barreja de les cartes per a que no surtin les parelles una al costat de l'altre
		arraycards_joc.sort((a,b) => 05 - Math.random())

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
				this.add.image(n * 125 + this.cameras.main.centerX - (cartes / 2)*100, k * 150 + this.cameras.main.centerY - (cartes * 128)/4, arraycards_joc[m]);
				m += 1;
			}
		}

		this.cards = this.physics.add.staticGroup();

		for (let p = 0; p < columnes; p++){
			for(let q = 0; q < files; q++){
				this.cards.create(n * 125 + this.cameras.main.centerX - (cartes / 2)*100, k * 150 + this.cameras.main.centerY - (cartes * 128)/4, 'back');
			}	
		}

        let i = 0;
        var aux = false
        var level = 0;
		this.cards.children.iterate((card)=>{
			card.card_id = arraycards[i];
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
								this.add.image(n * 125 + this.cameras.main.centerX - (cartes / 2)*100, k * 150 + this.cameras.main.centerY - (cartes * 128)/4, arraycards_joc[c]);
								c += 1;
								destructor.push(imatge);						
							}
						}
						setTimeout(() =>{
							for (let n = 0; n < cartes*2; n++){
								fallo[iterador].destroy();
							}
						},temps_girades);
						//Tractament de fi de joc
						if (this.score <= 0){
							alert("FI DEL JOC");
                            options_data.cards = 2;                 //M'he trobat amb el problema de que no es reiniciaven les variables aixi que les reinicio a mà
                            options_data.dificulty = "easy"
                            options_data.punts = 10;
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
                            //Augmentem la quantitat de punts a perdre en la següent ronda
                            puntuacio_negativa += 5
                            //Actualitzem les variables de opcions
                            options_data.dificulty = dificultat;
                            options_data.cards = cartes;
                            options_data.punts = puntuacio_negativa
                            sessionStorage.setItem("config", JSON.stringify(options_data));
                            //Actualitzem l'escena per a la següent ronda
                            this.Scene.restart();
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
