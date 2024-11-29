// On popup content loaded
document.addEventListener('DOMContentLoaded', function ()
{
    const ankiDeckSelect = document.getElementById("ankiDeck");

    chrome.runtime.sendMessage({ action: "deckNames" }, (response) =>
    {
        if (response.error)
        {
            console.error("Error from background script:", response.error);
            return;
        }

        // Retrieve the user's saved deck from storage
        chrome.storage.sync.get(['ankiDeck'], function (storage)
        {
            const { ankiDeck } = storage;

            // Populate the select dropdown with decks and set the default value
            populateDeckSelect(ankiDeckSelect, response.deckNames, ankiDeck);

            // Add event listener to save the selected deck to storage
            ankiDeckSelect.addEventListener('change', function ()
            {
                const selectedDeck = ankiDeckSelect.value;
                chrome.storage.sync.set({ ankiDeck: selectedDeck });
            });
        });
    });
});

function populateDeckSelect(selectElement, deckNames, selectedDeck)
{
    selectElement.innerHTML = "";

    // Add options for the fetched deck names
    let isFirstIndex = true;
    deckNames.forEach((deckName) =>
    {
        const option = document.createElement("option");
        option.value = deckName;
        option.textContent = deckName;

        if (isFirstIndex && !selectedDeck)
        {
            option.selected = true; // Pre-select this if no deck is saved and it's the first item
        }
        else if (deckName === selectedDeck)
        {
            option.selected = true; // Pre-select the saved deck
        }

        selectElement.appendChild(option);
    });
}