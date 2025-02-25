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

// 🔹 Fonction pour envoyer un jet de dé à Supabase
async function lancerDe(caracteristique) {
    let joueur = document.getElementById("playerSelect").value;

    if (!joueur) {
        alert("Sélectionne un joueur !");
        return;
    }

    let resultat = Math.floor(Math.random() * 100) + 1; // Simulation d'un d100

    console.log(`🎲 ${joueur} a lancé ${caracteristique} et a obtenu ${resultat}`);

    // 🔹 Envoi du jet de dé à Supabase
    const { data, error } = await supabase
        .from("JetDeDes")
        .insert([
            { Joueur: joueur, Caractéristique: caracteristique, Résultat: resultat }
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
