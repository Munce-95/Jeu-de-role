document.addEventListener("DOMContentLoaded", () => {
    let liste = document.getElementById("listePersonnages");
    liste.innerHTML = ""; // Réinitialisation

    let joueurs = ["joueur1", "joueur2", "joueur3", "joueur4", "joueur5", "joueur6"];

    joueurs.forEach(joueurID => {
        let personnage = JSON.parse(localStorage.getItem(joueurID));
        let nom = personnage && personnage.nom ? personnage.nom : `Joueur ${joueurID.replace("joueur", "")}`;

        let bouton = document.createElement("button");
        bouton.innerText = nom;
        bouton.onclick = () => location.href = `FichePersonnage.html?joueur=${joueurID}`;
        
        liste.appendChild(bouton);
        liste.appendChild(document.createElement("br"));
    });
});
