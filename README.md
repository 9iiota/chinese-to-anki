# Chinese-to-Anki Chrome Extension

This Chrome extension streamlines the process of adding Chinese words into Anki flashcards. With a single click, you can transfer Chinese words, Pinyin, definitions, and audio directly into your Anki deck using the AnkiConnect plugin.

---

## Features

- Automatically adds Chinese words as flashcards in your Anki deck.
- Supports **Hanzi**, **Pinyin**, **definitions**, and **audio** fields.
- Customizable Anki deck name via extension settings.
- Works seamlessly with the AnkiConnect API.

---

## Installation Guide

### Step 1: Install Anki and AnkiConnect

#### 1. Install Anki
1. Download and install Anki from the [official website](https://apps.ankiweb.net/).
2. Follow the installation instructions for your operating system.

#### 2. Install the AnkiConnect Plugin
1. Open Anki.
2. Go to **Tools > Add-ons > Get Add-ons**.
3. Enter the AnkiConnect add-on code: `2055492159`.
4. Click **OK** to install the add-on.
5. Restart Anki to enable AnkiConnect.

#### 3. Verify AnkiConnect
1. Open Anki and ensure **AnkiConnect** is listed under **Tools > Add-ons**.
2. **Keep Anki running** while using this extension to allow communication with AnkiConnect.

---

### Step 2: Install the Chrome Extension

#### 1. Download the Extension Code
Clone or download this repository as a ZIP file:
```bash
git clone https://github.com/9iiota/chinese-to-anki.git
```

#### 2. Unpack the Extension
If you downloaded the ZIP file, extract it to a folder on your computer.

#### 3. Load the Extension into Chrome
1. Open Chrome and navigate to ```chrome://extensions/```.
2. Enable Developer Mode (toggle it on in the top-right corner).
3. Click Load unpacked and select the folder containing the extension's code.
4. The extension should now appear in your extensions list.

---

## Usage Instructions
1. Open [MDBG Chinese Dictionary](https://www.mdbg.net/chinese/dictionary).
2. Look up a word and click the "Create Flashcard" button.
3. Ensure your Anki deck name is set in the extension's options (accessible via the extension popup or settings menu).
4. The card will be added to your selected Anki deck, including Hanzi, Pinyin, definitions, and audio (if available).

---

## Known Issues and Troubleshooting
### Cards Not Adding?
- Ensure Anki is running and that the AnkiConnect add-on is properly installed.
### Extension Errors
- Reload the extension via chrome://extensions/ and verify the folder path.

---

## Contribution
Feel free to contribute to this project! To get started:

1. Fork the repository.
2. Create a new branch:
```bash
git checkout -b feature-name
```
3. Make your changes and submit a pull request.

---

## License
This project is licensed under the MIT License. See the LICENSE file for details.

---

Enjoy learning Chinese with ease! 😊
