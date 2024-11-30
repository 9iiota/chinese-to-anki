const QFMT = ['{{Hanzi}}', '{{Pinyin}}<br>\n{{Definition}}<br>\n{{Audio}}']
const AFMT = ['{{FrontSide}}\n\n<hr id=answer>\n\n{{Pinyin}}<br>\n{{Definition}}<br>\n{{Audio}}', '{{FrontSide}}\n\n<hr id=answer>\n\n{{Hanzi}}']

// Used to keep the service worker alive
chrome.alarms.create({ periodInMinutes: .4 })
chrome.alarms.onAlarm.addListener(() =>
{
    console.log('Keeping service worker alive...')
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) =>
{
    if (message.action === 'createCard')
    {
        (async () =>
        {
            await createChineseModel();
            await createAnkiCard(message.data);
        })();
    }
    else if (message.action === 'deckNames')
    {
        invoke('deckNames', 6)
            .then(deckNames =>
            {
                sendResponse({ deckNames });
            })
            .catch(error =>
            {
                sendResponse({ error });
            });
        return true;
    }
});

function findModelsByName(modelNames)
{
    return invoke('findModelsByName', 6, { modelNames: modelNames });
}

function arraysEqual(a, b)
{
    if (a === b)
    {
        return true;
    }
    if (a == null || b == null)
    {
        return false;
    }
    if (a.length !== b.length)
    {
        return false;
    }

    for (let i = 0; i < a.length; ++i)
    {
        if (a[i] !== b[i])
        {
            return false;
        }
    }
    return true;
}

async function createChineseModel()
{
    try
    {
        const models = await findModelsByName(['Chinese']);
    }
    catch (error)
    {
        return invoke('createModel', 6, {
            modelName: 'Chinese',
            inOrderFields: ['Hanzi', 'Pinyin', 'Definition', 'Audio'],
            cardTemplates: [
                {
                    Name: 'Card 1',
                    Front: '{{Hanzi}}',
                    Back: '{{FrontSide}}\n\n<hr id=answer>\n\n{{Pinyin}}<br>\n{{Definition}}<br>\n{{Audio}}'
                },
                {
                    Name: 'Card 2',
                    Front: '{{Pinyin}}<br>\n{{Definition}}<br>\n{{Audio}}',
                    Back: '{{FrontSide}}\n\n<hr id=answer>\n\n{{Hanzi}}'
                }
            ]
        });
    }

    // try
    // {
    //     const models = await findModelsByName(['Chinese']);
    //     for (const model of models)
    //     {
    //         // Check fields
    //         const fields = model['flds']
    //         if (fields.length !== 4)
    //         {
    //             continue;
    //         }

    //         // Check field names
    //         const fieldNames = fields.map(field => field['name']);
    //         if (!arraysEqual(fieldNames, ['Hanzi', 'Pinyin', 'Definition', 'Audio']))
    //         {
    //             continue;
    //         }

    //         // Check templates
    //         const templates = model['tmpls'];
    //         if (templates.length !== 2)
    //         {
    //             continue;
    //         }

    //         // Check card front
    //         const qfmt = templates.map(template => template['qfmt']);
    //         if (!arraysEqual(qfmt, QFMT))
    //         {
    //             console.log('qfmt', qfmt);
    //             continue;
    //         }

    //         // Check card back
    //         const afmt = templates.map(template => template['afmt']);
    //         if (!arraysEqual(afmt, AFMT))
    //         {
    //             continue;
    //         }
    //     }
    // }
    // catch (error)
    // {
    //     return invoke('createModel', 6, {
    //         modelName: 'Chinese',
    //         inOrderFields: ['Hanzi', 'Pinyin', 'Definition', 'Audio'],
    //         cardTemplates: [
    //             {
    //                 Name: 'Card 1',
    //                 Front: '{{Hanzi}}',
    //                 Back: '{{FrontSide}}\n\n<hr id=answer>\n\n{{Pinyin}}<br>\n{{Definition}}<br>\n{{Audio}}'
    //             },
    //             {
    //                 Name: 'Card 2',
    //                 Front: '{{Pinyin}}<br>\n{{Definition}}<br>\n{{Audio}}',
    //                 Back: '{{FrontSide}}\n\n<hr id=answer>\n\n{{Hanzi}}'
    //             }
    //         ]
    //     });
    // }
}

function getToneColor(syllable)
{
    const tone1 = /[āēīōūǖ]/;
    const tone2 = /[áéíóúǘ]/;
    const tone3 = /[ǎěǐǒǔǚ]/;
    const tone4 = /[àèìòùǜ]/;

    if (tone1.test(syllable))
    {
        return 'red';
    }       // 1st tone: red
    if (tone2.test(syllable))
    {
        return 'orange';
    }
    if (tone3.test(syllable))
    {
        return 'green';
    }
    if (tone4.test(syllable))
    {
        return 'blue';
    }
    return 'white';
}

function createAnkiCard(data)
{
    const { hanzi, pinyinArray, definition, audioArray } = data;
    chrome.storage.sync.get(['ankiDeck'], function (storage)
    {
        if (!storage.ankiDeck)
        {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs)
            {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'showAlert', message: 'Please set Anki deck in the extension options' });
            });
        }

        const { ankiDeck } = storage;
        let pinyin = '';
        for (const syllable of pinyinArray)
        {
            const color = getToneColor(syllable);
            pinyin += `<span style="color: ${color}">${syllable}</span>`;
        }
        const audioObjects = audioArray.map(audio =>
        {
            return {
                "url": audio,
                "filename": `${audio}`,
                "fields": [
                    "Audio"
                ]
            }
        });
        const note = {
            deckName: ankiDeck,
            modelName: 'Chinese',
            fields: {
                Hanzi: hanzi,
                Pinyin: pinyin,
                Definition: definition
            },
            "audio": audioObjects
        };

        invoke('addNote', 6, { note: note })
    });
};

function invoke(action, version, params = {})
{
    return fetch('http://127.0.0.1:8765', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, version, params })
    })
        .then(response =>
        {
            if (!response.ok)
            {
                throw 'failed to issue request';
            }
            return response.json();
        })
        .then(response =>
        {
            if (Object.keys(response).length !== 2)
            {
                throw 'response has an unexpected number of fields';
            }
            if (!('error' in response))
            {
                throw 'response is missing required error field';
            }
            if (!('result' in response))
            {
                throw 'response is missing required result field';
            }
            if (response.error)
            {
                throw response.error;
            }
            return response.result;
        })
        .catch(error =>
        {
            throw error;
        });
}