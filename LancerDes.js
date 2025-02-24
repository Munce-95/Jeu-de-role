document.addEventListener("DOMContentLoaded", () => {
    let select = document.getElementById("playerSelect");
    select.innerHTML = ""; // Réinitialisation

    let joueurs = ["joueur1", "joueur2", "joueur3", "joueur4", "joueur5", "joueur6"];

    joueurs.forEach(joueurID => {
        let personnage = JSON.parse(localStorage.getItem(joueurID));
        let nom = personnage && personnage.nom ? personnage.nom : `Joueur ${joueurID.replace("joueur", "")}`;

        let option = document.createElement("option");
        option.value = joueurID;
        option.innerText = nom;
        
        select.appendChild(option);
    });
});

function lancement_de() {
    const randomArray = new Uint32Array(1);
    crypto.getRandomValues(randomArray);

    const randomNumber = randomArray[0] % 1000000;

    const thousands = Math.floor(randomNumber / 1000) % 10;
    const tens = Math.floor((randomNumber % 100) / 10);

    const result = (thousands === 0 && tens === 0) ? 100 : (thousands * 10 + tens);

    return result;
}

function lancerDe(caracteristique) {
    let joueur = document.getElementById("playerSelect").value;

    let personnage = JSON.parse(localStorage.getItem(joueur));

    if (!personnage) {
        document.getElementById("resultat").innerText = "Aucune donnée trouvée pour ce joueur.";
        return;
    }

    let stat = personnage[caracteristique];
    let jet = lancement_de();

    let rep = (jet <= stat) ? "Réussite" : "Échec";
    if (jet <= 10 || jet >= 90) {
        rep = rep + " Critique";
        if (jet == 1 || jet == 100){
            rep = 'Super ' + rep;
        }
    }

    document.getElementById("resultat").innerText = 
        `Jet de ${caracteristique} : ${jet} (Stat : ${stat}) → ${rep}`;
}
