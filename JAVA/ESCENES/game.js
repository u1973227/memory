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
		this.cameras.main.setBackgroundColor(0xBFFCFF);
		
		//Tractament de les opcions 
		var json = localStorage.getItem("config") || '{"cards":3,"dificulty":"normal"}';
		var opcions = JSON.parse(json);
		var dificultat = opcions.dificulty;
		var cartes = opcions.cards;
		arraycards_joc = arraycards_total.slice(0, cartes*2);
		
		//Tractament de variables segons la dificultat
		var puntuacio_negativa = null;
		var temps_girades = null;
		if (dificultat == "facil"){
			puntuacio_negativa = 5;
			temps_girades = 2000;
		}
		else if (dificultat == "normal"){
			puntuacio_negativa = 10
			temps_girades = 1000;
		}
		else if (dificultat == "dificil"){
			puntuacio_negativa = 20;
			temps_girades = 500;
		}

		//Barreja de les cartes per a que no surtin les parelles una al costat de l'altre
		arraycards_joc.sort((a,b) => 05 - Math.random())

		var m = 0;
		for (let n = 0; n < cartes * 2; n++){
			this.add.image(, arraycards[quin]);
			m += 1;
		}

		this.cards = this.physics.add.staticGroup();

		for (let p = 0; p < cartes * 2; p++){
			this.cards.create(, 'back');
		}
		
		let i = 0;
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
						for(let i = 0; i < cartes*2; i++){
							let imatge = this.add.image(, arraycards[c]);
							c++;
							destructor.push(imatge);						
						}
						setTimeout(() =>{
							for (let n = 0; n < cartes*2; n++){
								fallo[iterador].destroy();
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