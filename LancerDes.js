const SUPABASE_URL = "https://sxwltroedzxkvqpbcqjc.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4d2x0cm9lZHp4a3ZxcGJjcWpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0MjQxNzIsImV4cCI6MjA1NjAwMDE3Mn0.F_XIxMSvejY2xLde_LbLcLt564fiW2zF-wqr95rZ2zA"; // 🔹 Remplace par ta clé API
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 🔴 Écouter les nouveaux jets de dés en temps réel
supabase
    .channel('public:JetDeDes')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'JetDeDes' }, (payload) => {
        console.log("🎲 Nouveau jet reçu :", payload.new);
        afficherResultat(payload.new);
    })
    .subscribe();

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
        option.value = personnage.ID; // 🔹 On garde l'ID comme valeur pour bien cibler en base
        option.textContent = personnage.Nom; // 🔹 Affiche le nom réel du personnage
        select.appendChild(option);
    });
}



// 🔹 Fonction pour envoyer un jet de dé à Supabase
async function lancerDe(caracteristique) {
    let select = document.getElementById("playerSelect");
    let joueurID = select.value; // 🔹 Récupère l'ID du personnage sélectionné
    let joueurNom = select.options[select.selectedIndex].text; // 🔹 Récupère son nom

    if (!joueurID) {
        alert("Sélectionne un joueur !");
        return;
    }

    let resultat = Math.floor(Math.random() * 100) + 1; // 🔹 Simulation d'un d100

    console.log(`🎲 ${joueurNom} (ID: ${joueurID}) a lancé ${caracteristique} et a obtenu ${resultat}`);

    // 🔹 Envoi du jet de dé à Supabase avec l'ID du personnage
    const { data, error } = await supabase
        .from("JetDeDes")
        .insert([
            { Joueur: joueurNom, Caractéristique: caracteristique, Résultat: resultat }
        ]);

    if (error) {
        console.error("❌ Erreur lors de l'enregistrement du jet :", error);
    } else {
        console.log("✅ Jet enregistré avec succès :", data);
    }
}


// 🔹 Fonction pour afficher le dernier résultat
function afficherResultat(jet) {
    let resultatContainer = document.getElementById("resultat");
    resultatContainer.innerHTML = `
        <h3>Résultat du dé pour "<strong>${jet.Caractéristique}</strong>" :</h3>
        <h2 style="color: gold;">${jet.Résultat}</h2>
        <p><small>(${jet.Joueur})</small></p>
    `;
}

// 🔹 Charger le dernier résultat existant au démarrage
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

// 🔹 Charger le dernier résultat au démarrage
document.addEventListener("DOMContentLoaded", chargerDernierJet);
// 🔹 Charger la liste au chargement de la page
document.addEventListener("DOMContentLoaded", chargerPersonnages);
