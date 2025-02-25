// 🔹 Initialisation Supabase (À mettre tout en haut !)
const SUPABASE_URL = "https://sxwltroedzxkvqpbcqjc.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4d2x0cm9lZHp4a3ZxcGJjcWpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0MjQxNzIsImV4cCI6MjA1NjAwMDE3Mn0.F_XIxMSvejY2xLde_LbLcLt564fiW2zF-wqr95rZ2zA";
const API_PERSONNAGES = `${SUPABASE_URL}/rest/v1/personnages`;
const API_JETS = `${SUPABASE_URL}/rest/v1/JetDeDes`;

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 🔴 Écouter les nouveaux jets de dés en temps réel
supabase
    .channel('public:JetDeDes')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'JetDeDes' }, (payload) => {
        console.log("🎲 Nouveau jet reçu :", payload.new);
        afficherResultat(payload.new);
    })
    .subscribe();

// 🔹 Fonction pour charger la liste des personnages
async function chargerPersonnages() {
    let { data, error } = await supabase
        .from("personnages")
        .select("ID, Nom")
        .order("ID", { ascending: true });

    if (error) {
        console.error("❌ Erreur lors du chargement des personnages :", error);
        return;
    }

    console.log("📜 Liste des personnages :", data);

    let select = document.getElementById("playerSelect");
    select.innerHTML = ""; // 🔹 Vide la liste avant de la remplir

    data.forEach(personnage => {
        let option = document.createElement("option");
        option.value = personnage.ID; // 🔹 L'ID permet de bien identifier le joueur
        option.textContent = personnage.Nom; // 🔹 Affichage du nom du personnage
        select.appendChild(option);
    });
}

// 🔹 Charger la liste des personnages au démarrage
document.addEventListener("DOMContentLoaded", chargerPersonnages);

// 🔹 Fonction pour lancer un dé et comparer avec la stat du personnage
async function lancerDe(caracteristique) {
    let select = document.getElementById("playerSelect");
    let joueurID = select.value; // 🔹 Récupère l'ID du personnage sélectionné
    let joueurNom = select.options[select.selectedIndex].text; // 🔹 Récupère son nom

    if (!joueurID) {
        alert("Sélectionne un joueur !");
        return;
    }

    // 🔹 Récupérer les stats du joueur depuis Supabase
    let { data, error } = await supabase
        .from("personnages")
        .select(caracteristique) // 🔹 Récupère UNIQUEMENT la stat concernée
        .eq("ID", joueurID)
        .single();

    if (error) {
        console.error("❌ Erreur lors de la récupération des stats :", error);
        return;
    }

    let statJoueur = data[caracteristique]; // 🔹 Valeur de la caractéristique sélectionnée
    let resultat = Math.floor(Math.random() * 100) + 1; // 🔹 Simulation d'un d100

    let reussite = resultat <= statJoueur ? "Réussite" : "Échec"; // 🔹 Vérification du jet

    console.log(`🎲 ${joueurNom} (${caracteristique} : ${statJoueur}) a obtenu ${resultat} → ${reussite}`);

    // 🔹 Affichage dans l’interface
    let resultatContainer = document.getElementById("resultat");
    resultatContainer.innerHTML = `
        <h3>Résultat du dé pour "<strong>${caracteristique}</strong>" :</h3>
        <h2 style="color: ${reussite === "Réussite" ? "gold" : "red"};">${resultat} - ${reussite}</h2>
        <p><small>(${joueurNom})</small></p>
    `;

    // 🔹 Envoi du jet de dé à Supabase
    const { data: jetData, error: jetError } = await supabase
        .from("JetDeDes")
        .insert([
            { Joueur: joueurNom, Caractéristique: caracteristique, Résultat: resultat, Issue: reussite }
        ]);

    if (jetError) {
        console.error("❌ Erreur lors de l'enregistrement du jet :", jetError);
    } else {
        console.log("✅ Jet enregistré avec succès :", jetData);
    }
}

// 🔹 Charger le dernier résultat au démarrage
async function chargerDernierJet() {
    let { data, error } = await supabase
        .from("JetDeDes")
        .select("*")
        .order("Timestamp", { ascending: false })
        .limit(1);

    if (error) {
        console.error("❌ Erreur lors du chargement du dernier jet :", error);
    } else if (data.length > 0) {
        afficherResultat(data[0]);
    }
}

// 🔹 Fonction pour afficher le dernier résultat reçu
function afficherResultat(jet) {
    let resultatContainer = document.getElementById("resultat");
    resultatContainer.innerHTML = `
        <h3>Résultat du dé pour "<strong>${jet.Caractéristique}</strong>" :</h3>
        <h2 style="color: ${jet.Issue === "Réussite" ? "gold" : "red"};">${jet.Résultat} - ${jet.Issue}</h2>
        <p><small>(${jet.Joueur})</small></p>
    `;
}

// 🔹 Charger le dernier résultat existant au chargement de la page
document.addEventListener("DOMContentLoaded", chargerDernierJet);
