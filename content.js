const BASE_AUDIO_URL = 'https://www.mdbg.net/chinese/rsc/audio/voice_pinyin_pz/';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) =>
{
    if (message.action === 'showAlert')
    {
        alert(message.message);
    }
    else if (message.action === 'stopLoading')
    {
        const button = document.getElementById('creating-flashcard');
        button.id = '';
        button.innerHTML = 'Flashcard Created';
        button.disabled = true;
        button.style.pointerEvents = 'none';
    }
});

// Add a copy button to each pinyin
const rows = document.getElementsByClassName('row');
for (const row of rows)
{
    const head = row.querySelector('.head');

    const button = document.createElement('button');
    button.innerHTML = 'Create Flashcard';
    button.addEventListener('click', () =>
    {
        button.id = 'creating-flashcard';
        button.innerHTML = 'Creating Flashcard...';

        // Get hanzi
        const hanzis = head.querySelectorAll('.hanzi a span');
        let hanzi = '';
        for (const hanziText of hanzis)
        {
            hanzi += hanziText.textContent;
        }

        // Get pinyin and audio
        const pinyins = head.querySelectorAll('.pinyin a span');
        let pinyinArray = [];
        let audioArray = [];
        for (const pinyinText of pinyins)
        {
            // Pinyin
            pinyinArray.push(pinyinText.textContent);

            // Audio
            const convertedPinyin = convertPinyinToNormal(pinyinText.textContent);
            const toneNumber = pinyinText.className.match(/\d/)[0];
            const audioUrl = `${BASE_AUDIO_URL}${convertedPinyin}${toneNumber}.mp3`;
            audioArray.push(audioUrl);
        }

        // Get definition
        const defs = row.querySelector('.details .defs');

        const clonedDefinition = defs.cloneNode(true);
        clonedDefinition.querySelectorAll('strong').forEach(el => el.remove());

        const definitions = clonedDefinition.innerHTML.split('<a')[0].split('  ');
        const definition = definitions.filter(item => /[a-zA-Z]/.test(item)).join(' /');

        // // Normalize spaces and remove trailing punctuation like ","
        // const definition = definition.replace(/\s+/g, ' ').replace(/,\s*$/, '');
        // definition = definition.split(' ').join('; ').replace(/;\s*$/, '');

        chrome.runtime.sendMessage({ action: 'createCard', data: { hanzi, pinyinArray, definition, audioArray } });
    });

    head.appendChild(button);
};

function convertPinyinToNormal(pinyin)
{
    // Remove tone numbers and dashes
    return pinyin
        .replace(/[āáǎàa]/g, 'a')
        .replace(/[ēéěèe]/g, 'e')
        .replace(/[īíǐìi]/g, 'i')
        .replace(/[ōóǒòo]/g, 'o')
        .replace(/[ūúǔùu]/g, 'u')
        .replace(/[ǖǘǚǜü]/g, 'u') // Handle 'ü'
        .replace(/[^a-zA-Z\s]/g, ''); // Remove any non-alphabetic characters
}