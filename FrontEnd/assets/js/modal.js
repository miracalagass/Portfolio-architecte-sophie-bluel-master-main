const authToken = localStorage.getItem("authToken");
document.addEventListener("DOMContentLoaded", function() {
    const openModalBtn = document.getElementById("edit-projects-btn"); // Bouton Modifier
    const modalDialog = document.getElementById("modal"); // Dialog modal
    const closeModalBtn = document.querySelector(".close"); // X pour fermer le modal
    const modalGallery = modalDialog.querySelector(".modal-gallery"); // Galerie du modal
    const modalOverlay = document.getElementById("modal-overlay");

    // Bouton "Ajouter une photo" et pages
    const ajouterPhotoBtn = document.getElementById("ajouter-photo-btn"); // Bouton "Ajouter une photo"
    const ajoutPhotoPage = document.getElementById("ajout-photo-page"); // Page d'ajout de photo
    const galleryPage = document.getElementById("modal-gallery-page"); // Page de la galerie
    const backBtn = document.getElementById("back-btn"); // Bouton retour

    // Ouvrez le modal lorsque vous cliquez sur le bouton Modifier
    if (openModalBtn) {
        openModalBtn.addEventListener("click", function() {
            console.log("Modifier butonuna basıldı, modal açılıyor..."); // Log de test
            modalDialog.showModal(); // Ouvrir le modal
            modalOverlay.style.display = 'block'; // Rendre l'overlay visible

            // Copier les projets de la page d'accueil dans la galerie modale
            const siteGalleryFigures = document.querySelectorAll(".gallery figure");

            modalGallery.innerHTML = ""; // Nettoyer la galerie
            siteGalleryFigures.forEach(figure => {
                const clonedFigure = figure.cloneNode(true); // Cloner les figures existantes
                
                // Obtenez l'ID de la figure d'origine et ajoutez-le à clonedFigure
                const photoId = figure.getAttribute("data-photo-id"); // Obtenir l'ID de la figure d'origine
                clonedFigure.setAttribute("data-photo-id", photoId); // Ajouter l'ID à clonedFigure

                // Ajoutons l'icône de la poubelle
                const deleteIcon = document.createElement("button");
                deleteIcon.classList.add("delete-icon");
                deleteIcon.innerHTML = '<span class="delete-container"><i class="fa-solid fa-trash-can"></i></span>'; // Icône de poubelle de Font Awesome
                
                // Fonction de suppression
                deleteIcon.addEventListener("click", function() {
                    if (!photoId) {
                        console.error("Fotoğraf ID'si bulunamadı!"); // Hata mesajı
                        return; // Sortir si l'ID n'existe pas
                    }
                    
                    // Envoyer la demande de suppression à l'API
                    deletePhoto(photoId).then(success => {
                        if (success) {
                            clonedFigure.remove(); // Supprimer la figure si la suppression API a réussi
                        } else {
                            alert("La suppression a échoué."); // Message d'erreur
                        }
                    });
                });

                clonedFigure.appendChild(deleteIcon); // Ajouter l'icône de poubelle 
                modalGallery.appendChild(clonedFigure); // Ajouter à la galerie modale
            });
        });
    } else {
        console.error("edit-projects-btn bulunamadı !"); // Hata mesajı
    }
    
    // Affichez la page d'ajout de photo lorsque vous cliquez sur le bouton "Ajouter une photo"
    if (ajouterPhotoBtn) {
        ajouterPhotoBtn.addEventListener("click", function() {
            galleryPage.style.display = 'none'; // Cacher la page de la galerie
            ajoutPhotoPage.style.display = 'block'; // Afficher la page d'ajout de photo
            ajouterPhotoBtn.style.display = 'none'; // Cacher le bouton "Ajouter une photo"
            const galerieTitle = document.getElementById("galerie-title"); // Sélectionnez le titre de la galerie
            if (galerieTitle) {
                galerieTitle.style.display = 'none'; // Cacher le titre
            }
        });
    }

    // Retournez à la page de la galerie lorsque vous cliquez sur le bouton de retour
    if (backBtn) {
        backBtn.addEventListener("click", function() {
            ajoutPhotoPage.style.display = 'none'; // Cacher la page d'ajout de photo
            galleryPage.style.display = 'flex'; // Afficher la page de la galerie
            ajouterPhotoBtn.style.display = 'block'; // Rendre le bouton "Ajouter une photo" visible
            const galerieTitle = document.getElementById("galerie-title"); // Sélectionnez le titre de la galerie
            if (galerieTitle) {
                galerieTitle.style.display = 'block'; // Rendre le titre visible
            }
        });
    }

    // Fermez le modal en cliquant sur le X
    if (closeModalBtn) {
        closeModalBtn.addEventListener("click", function() {
            modalDialog.close(); // Fermer le modal
            modalOverlay.style.display = 'none'; // Cacher l'overlay
        });
    }

    // Fermez le modal si vous cliquez en dehors
    window.addEventListener("click", function(event) {
        // Si la cible cliquée n'est pas le modal (en dehors du modal), fermez le modal
        if (event.target === modalDialog) {
            modalDialog.close(); // Fermer le modal
        }
    });
});

// Récupérez les catégories
async function getCategories() {
    try {
        const response = await fetch("http://localhost:5678/api/categories/"); // Récupère les catégories
        const data = await response.json();
        return data; // Retourne les catégories
    } catch (error) {
        console.error("Erreur lors de la récupération des catégories :", error); // Message d'erreur
        return []; // Retourne un tableau vide en cas d'erreur
    }
}

async function populateCategories() {
    const categories = await getCategories(); // Récupère les catégories
    const categorySelect = document.getElementById("categorie"); // Récupère l'élément select

    // Ajoute les catégories à l'élément select
    categories.forEach(category => {
        const option = document.createElement("option"); // Crée un nouvel élément option
        option.value = category.id; // Définit l'ID de la catégorie comme valeur
        option.textContent = category.name; // Affiche le nom de la catégorie
        categorySelect.appendChild(option); // Ajoute l'option à l'élément select
    });
}

// Remplit les catégories lorsque la page est chargée
document.addEventListener("DOMContentLoaded", function() {
    populateCategories(); // Remplit les catégories
});

