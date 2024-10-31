document.addEventListener("DOMContentLoaded", function() {
    const fileUploadInput = document.getElementById("input-file");
    const uploadedImage = document.getElementById("output");
    const validerButton = document.getElementById("valider-btn");
    const fileUploadButton = document.getElementById("file-upload-button");
    const titleInput = document.getElementById("titre");
    const elementToHide = document.getElementById("file-upload-button");

    // Lorsque le bouton de téléchargement de fichiers est cliqué, déclenchez le champ de téléchargement de fichiers
    fileUploadButton.addEventListener("click", function() {
        fileUploadInput.click(); // Déclenche l'entrée de téléchargement de fichiers
    });

    // Désactivez le bouton au départ
    validerButton.disabled = true;
    // Affichez l'image lorsque le fichier est téléchargé
    fileUploadInput.addEventListener("change", function() {
        const file = fileUploadInput.files[0]; // Récupère le fichier téléchargé

        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                uploadedImage.src = e.target.result; // Affiche le chemin du fichier téléchargé
                uploadedImage.style.display = 'block'; // Affiche l'image
                if(elementToHide){
                    elementToHide.style.display = 'none'
                }
                validerButton.disabled = false; // Active le bouton
                checkInputs();
            };
            reader.readAsDataURL(file); // Lit le fichier
        } else {
            uploadedImage.style.display = 'none'; // Cache l'image si le fichier n'existe pas
            validerButton.disabled = true;
            checkInputs(); // Vérifie les entrées
        }
    });

    // Vérifie les entrées lorsque le champ de titre change
    titleInput.addEventListener("input", function() {
        checkInputs(); // Vérifie les entrées
    });

    // Fonction qui vérifie les deux champs
    function checkInputs() {
        const file = fileUploadInput.files[0]; // Récupère le fichier téléchargé
        const title = titleInput.value.trim(); // Récupère la valeur du champ de titre

        // Si un fichier est téléchargé et qu'il y a un titre, activez le bouton
        if (file && title) {
            validerButton.disabled = false; // Active le bouton
        } else {
            validerButton.disabled = true; // Désactive le bouton
        }
    }

    // Lorsque le bouton Valider est cliqué, téléchargez la photo
    validerButton.addEventListener("click", async function(event) {
        event.preventDefault(); // Empêche l'envoi par défaut du formulaire
    
        const file = fileUploadInput.files[0]; // Récupère le fichier téléchargé
        const titre = titleInput.value; // Récupère le titre
        const categorie = document.getElementById("categorie").value; // Récupère la catégorie
    
        // Vérifie si tous les champs sont remplis
        if (!file || !titre || !categorie) {
            alert("Veuillez remplir tous les champs et télécharger une photo.");
            return;
        }
    
        // Effectue une requête API pour télécharger la photo
        const formData = new FormData();
        formData.append("image", file);
        formData.append("title", titre);
        formData.append("category", parseInt(categorie)); // Ajoute l'ID de la catégorie en tant qu'entier
    
        try {
            const response = await fetch("http://localhost:5678/api/works", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + authToken, // Si une authentification est requise
                },
                body: formData,
            });
    
            if (response.ok) {
                const data = await response.json();
                alert("Photo téléchargée avec succès !"); // Başarılı yükleme mesajı
                displayAllProject()
                displayGalerieModal()
                console.log(data); // Affiche les données téléchargées dans la console
            } else {
                alert("Le téléchargement a échoué."); // Hata mesajı
            }
        } catch (error) {
            console.error("Erreur de téléchargement :", error); // Hata mesajı
            alert("Une erreur s'est produite lors du téléchargement."); // Yükleme sırasında bir hata oluştu
        }
    });
});
