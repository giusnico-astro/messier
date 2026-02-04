document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const resultCard = document.getElementById('resultCard');
    const errorMessage = document.getElementById('errorMessage');

    // UI Elements
    const objId = document.getElementById('objId');
    const objCommonName = document.getElementById('objCommonName');
    const objNgc = document.getElementById('objNgc');
    const objType = document.getElementById('objType');
    const objConstellation = document.getElementById('objConstellation');
    const objDiameter = document.getElementById('objDiameter');
    const objMagnitude = document.getElementById('objMagnitude');
    const objDistance = document.getElementById('objDistance');
    const objDescription = document.getElementById('objDescription');

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim().toUpperCase();

        // Hide stuff if empty
        if (query === '') {
            resultCard.classList.remove('active');
            errorMessage.style.display = 'none';
            return;
        }

        // Normalize input: "1" -> "M1", "M1" -> "M1"
        let searchId = query.startsWith('M') ? query : `M${query}`;

        // Find object
        const object = messierObjects.find(obj => obj.id === searchId);

        if (object) {
            // Populate UI
            objId.textContent = object.id;
            objCommonName.textContent = object.nomi_comuni !== '-' ? object.nomi_comuni : '';
            objNgc.textContent = object.ngc !== '-' ? object.ngc : '';
            objType.textContent = object.tipo;
            objConstellation.textContent = object.costellazione;
            objDiameter.textContent = object.diametro;
            objMagnitude.textContent = object.magnitudine;
            objDistance.textContent = object.distanza;

            // New fields
            document.getElementById('objSeason').textContent = object.stagione || '-';
            document.getElementById('objRA').textContent = object.ar || '-';
            document.getElementById('objDec').textContent = object.dec || '-';

            objDescription.textContent = object.descrizione;

            // Handle Image
            const imgContainer = document.getElementById('imgContainer');
            const imgElement = document.getElementById('objImage');
            const imgLink = document.getElementById('imgLink');

            if (imgContainer && imgElement) {
                const extensions = ['jpg', 'jpeg', 'png', 'webp', 'JPG', 'PNG'];
                let extIndex = 0;

                const tryLoadImage = () => {
                    if (extIndex >= extensions.length) {
                        // All attempts failed
                        imgContainer.classList.remove('active');
                        return;
                    }
                    // Try next extension
                    imgElement.onload = () => {
                        imgContainer.classList.add('active');
                        if (imgLink) imgLink.href = imgElement.src;
                    };
                    imgElement.onerror = () => {
                        extIndex++;
                        tryLoadImage();
                    };
                    imgElement.src = `images/${object.id}.${extensions[extIndex]}`;
                };

                // Start loading attempt
                tryLoadImage();
            }

            // Show card, hide error
            resultCard.classList.add('active');
            errorMessage.style.display = 'none';
        } else {
            // Show error, hide card
            resultCard.classList.remove('active');

            // Only show error if it looks like they are trying to type a number
            // Regex checks if it's M followed by digits or just digits
            if (/^M?\d+$/.test(query)) {
                errorMessage.style.display = 'block';
            } else {
                errorMessage.style.display = 'none';
            }
        }
    });

    // Auto-focus input
    searchInput.focus();
});
