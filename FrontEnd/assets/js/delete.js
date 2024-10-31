async function deletePhoto(photoId) {
    const authToken = localStorage.getItem("authToken"); // Récupérez le token d'authentification ici
    try {
        const response = await fetch(`http://localhost:5678/api/works/${photoId}`, {
            method: 'DELETE',
            headers: {
                "Authorization": "Bearer " + authToken, // Si une authentification est requise
            },
        });

        if (response.ok) {
            alert("Photo supprimée avec succès !"); // Message de succès de suppression
            displayAllProject()
            return true; // Retourne vrai pour une réponse réussie
        } else {
            console.error("La suppression a échoué :", response.status); // Message d'erreur
            return false; // Retourne faux pour une réponse échouée
        } 
    } catch (error) {
        console.error("Erreur de suppression :", error); // Message d'erreur
        alert("Une erreur est survenue lors de la suppression."); // Une erreur s'est produite lors de la suppression
        return false; // Retourne faux en cas d'erreur
    } 
}

// Ici, vous pouvez ajouter les écouteurs d'événements nécessaires dans le fichier delete.js
function addPhotoToModal(photo) {
    const modalGallery = document.querySelector(".modal-gallery");

    const photoItem = document.createElement("div");
    photoItem.classList.add("photo-item");
    photoItem.setAttribute("data-photo-id", photo.id); // Stockez l'ID de la photo

    const img = document.createElement("img");
    img.src = photo.imageUrl;

    photoItem.appendChild(img);
    photoItem.appendChild(deleteIcon);
    modalGallery.appendChild(photoItem);
}
