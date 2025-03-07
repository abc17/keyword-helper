
let selectedWords = [];
let words = [];

// Загружаем текущую базу при открытии
fetch('/keywords.csv')
    .then(response => response.text())
    .then(parseCSV)
    .then(renderWords)
    .catch(() => console.warn('No initial keywords.csv found'));

function parseCSV(csvText) {
    words = [];
    const rows = csvText.trim().split('\n');
    rows.forEach(row => {
        const [category, ...keywords] = row.split(',');
        if (category && keywords.length) {
            // Очистка от кавычек и пробелов
            const cleanedKeywords = keywords.map(keyword => keyword.replace(/"/g, '').trim());
            words.push({ group: category, list: cleanedKeywords });
        }
    });
}



document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    fetch('/.netlify/functions/saveKeywords', {
        method: 'POST',
        body: formData
    }).then(() => {
        alert('Database updated! Refreshing...');
        location.reload();
    }).catch(err => {
        console.error('Upload failed', err);
        alert('Failed to upload file');
    });
});

function parseCSV(csvText) {
    words = [];
    const rows = csvText.trim().split('\n');
    rows.forEach(row => {
        const [category, ...keywords] = row.split(',');
        if (category && keywords.length) {
            words.push({ group: category, list: keywords });
        }
    });
}

function renderWords() {
    const wordList = document.getElementById('wordList');
    wordList.innerHTML = '';

    words.forEach(category => {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'group';

        const groupTitle = document.createElement('h3');
        groupTitle.textContent = category.group;
        groupDiv.appendChild(groupTitle);

        const wordContainer = document.createElement('div');
        wordContainer.className = 'word-list';

        category.list.forEach(word => {
            const wordItem = document.createElement('div');
            wordItem.className = 'word';
            wordItem.textContent = word;
            wordItem.dataset.word = word;
            wordItem.onclick = () => toggleWord(word, wordItem);
            wordContainer.appendChild(wordItem);
        });

        groupDiv.appendChild(wordContainer);
        wordList.appendChild(groupDiv);
    });
}

function toggleWord(word, element) {
    if (selectedWords.includes(word)) {
        removeWord(word);
    } else {
        addWord(word);
    }
    updateWordHighlighting();
}

function addWord(word) {
    selectedWords.push(word);
    updateField();
}

function removeWord(word) {
    selectedWords = selectedWords.filter(w => w !== word);
    updateField();
}

function updateField() {
    const container = document.getElementById('keywordsContainer');
    container.innerHTML = '';
    selectedWords.forEach(word => {
        const keywordEl = document.createElement('div');
        keywordEl.className = 'keyword';
        keywordEl.textContent = word;
        const removeBtn = document.createElement('span');
        removeBtn.textContent = '×';
        removeBtn.onclick = () => removeWordAndUpdate(word);
        keywordEl.appendChild(removeBtn);
        container.appendChild(keywordEl);
    });
    document.getElementById('wordCount').textContent = selectedWords.length;
}

function removeWordAndUpdate(word) {
    removeWord(word);
    updateWordHighlighting();
}

function updateWordHighlighting() {
    document.querySelectorAll('.word').forEach(wordElement => {
        if (selectedWords.includes(wordElement.dataset.word)) {
            wordElement.classList.add('selected');
        } else {
            wordElement.classList.remove('selected');
        }
    });
}

function copyToClipboard() {
    const allKeywords = selectedWords.join(', ');
    navigator.clipboard.writeText(allKeywords).then(() => alert('Copied!'));
}

function clearAll() {
    selectedWords = [];
    updateField();
    updateWordHighlighting();
}
