async function getAllProjects() {
    await fetch("http://localhost:5678/api/works/")
        .then((response) => {
            console.log(response)
            return response.json()           
        })
        .then((data) => {
            console.log(data)
        })
        .catch((error) => {
            console.error(
                "Erreur:",
                error
            );
        });
};
getAllProjects()