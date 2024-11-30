const BASE_AUDIO_URL = 'https://www.mdbg.net/chinese/rsc/audio/voice_pinyin_pz/';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) =>
{
    if (message.action === 'showAlert')
    {
        alert(message.message);
    }
});

// Add a copy button to each pinyin
const rows = document.getElementsByClassName('row');
for (const row of rows)
{
    const head = row.querySelector('.head');

    const button = document.createElement('button');
    button.innerHTML = 'Copy';
    button.onclick = () =>
    {
        // Get hanzi
        const hanzis = head.querySelectorAll('.hanzi a span');
        let hanzi = '';
        for (const hanziText of hanzis)
        {
            hanzi += hanziText.textContent;
        }

        // Get pinyin and audio
        const pinyins = head.querySelectorAll('.pinyin a span');
        let pinyin = '';
        let audioArray = [];
        for (const pinyinText of pinyins)
        {
            // Pinyin
            pinyin += pinyinText.textContent;

            // Audio
            const convertedPinyin = convertPinyinToNormal(pinyinText.textContent);
            const toneNumber = pinyinText.className.match(/\d/)[0];
            const audioUrl = `${BASE_AUDIO_URL}${convertedPinyin}${toneNumber}.mp3`;
            audioArray.push(audioUrl);
        }

        // Get definition
        const definitions = row.querySelector('.details .defs');

        const clonedDefinition = definitions.cloneNode(true);
        clonedDefinition.querySelectorAll('a, strong').forEach(el => el.remove());

        // Normalize spaces and remove trailing punctuation like ","
        let definition = clonedDefinition.textContent.trim();
        definition = definition.replace(/\s+/g, ' ').replace(/,\s*$/, '');
        definition = definition.split(' ').join('; ').replace(/;\s*$/, '');

        chrome.runtime.sendMessage({ action: 'createCard', data: { hanzi, pinyin, definition, audioArray } });
    };

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