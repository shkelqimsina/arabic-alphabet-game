const arabicAlphabetGroups = [
    [
        { letter: 'أ', name: 'elif' },
        { letter: 'ب', name: 'be' },
        { letter: 'ت', name: 'te' },
        { letter: 'ث', name: 'the' },
        { letter: 'ج', name: 'xhim' },
        { letter: 'ح', name: 'ha' },
        { letter: 'خ', name: 'kha' }
    ],
    [
        { letter: 'د', name: 'del' },
        { letter: 'ذ', name: 'dhel' },
        { letter: 'ر', name: 'ra' },
        { letter: 'ز', name: 'zel' },
        { letter: 'س', name: 'sin' },
        { letter: 'ش', name: 'shin' }
    ],
    [
        { letter: 'ص', name: 'sad' },
        { letter: 'ض', name: 'dad' },
        { letter: 'ط', name: 'ta' },
        { letter: 'ظ', name: 'dha' }
    ],
    [
        { letter: 'ع', name: 'ajn' },
        { letter: 'غ', name: 'gajn' },
        { letter: 'ف', name: 'fe' },
        { letter: 'ق', name: 'kaf' },
        { letter: 'ك', name: 'kehf' }
    ],
    [
        { letter: 'ل', name: 'lem' },
        { letter: 'م', name: 'mim' },
        { letter: 'ن', name: 'nun' },
        { letter: 'ه', name: 'he' },
        { letter: 'و', name: 'waw' },
        { letter: 'ي', name: 'ja' }
    ]
];
const groupGoals = [20, 30, 40, 50, 70];
let currentGroupIndex;
let currentQuestion;
let score = 0;
let timer = null;
let currentAudio = null;


function generateAlphabetIntroduction() {
    const alphabetElement = document.getElementById('alphabet');
    alphabetElement.innerHTML = '';

    arabicAlphabetGroups[currentGroupIndex].forEach((letterObj) => {
        const letterElement = document.createElement('div');
        letterElement.classList.add('letter');
        letterElement.textContent = `${letterObj.letter} (${letterObj.name})`;
        alphabetElement.appendChild(letterElement);
    });
}

function generateQuestion() {
    const allIntroducedLetters = arabicAlphabetGroups.slice(0, currentGroupIndex + 1).flat();
    const randomIndex = Math.floor(Math.random() * allIntroducedLetters.length);
    currentQuestion = allIntroducedLetters[randomIndex];

    document.getElementById("arabic-letter").textContent = currentQuestion.letter;
    playAudio(currentQuestion.name);

    const options = [currentQuestion.name];
    while (options.length < 4) {
        const optionIndex = Math.floor(Math.random() * allIntroducedLetters.length);
        const optionName = allIntroducedLetters[optionIndex].name;
        if (!options.includes(optionName)) {
            options.push(optionName);
        }
    }
    options.sort(() => Math.random() - 0.5);

    const optionButtons = document.querySelectorAll('.option');
    for (let i = 0; i < optionButtons.length; i++) {
        optionButtons[i].textContent = options[i];
    }
}

function playAudio(letterName) {
    const audio = new Audio(`audio/${letterName}.mp3`);
    audio.play();
}

function resetTimer() {
    if (timer) {
        clearInterval(timer);
    }

    document.getElementById('time-left').textContent = 10;

    if (document.getElementById('quiz-container').style.display === 'block') {
        timer = setInterval(() => {
            updateTimeLeft();
            if (parseInt(document.getElementById('time-left').textContent, 10) === 0) {
                score = 0;
                document.getElementById('score').textContent = score;
                document.body.style.backgroundColor = 'red';

                setTimeout(() => {
                    document.body.style.backgroundColor = '#f5f5f5';
                    generateQuestion();
                }, 500);
            }
        }, 1000);
    }
}


function checkAnswer(button) {
    if (button.textContent === currentQuestion.name) {
        score++;
        document.getElementById('score').textContent = score;
        document.body.style.backgroundColor = 'green';
    } else {
        score = 0;
        document.getElementById('score').textContent = score;
        document.body.style.backgroundColor = 'red';
    }

    setTimeout(() => {
        document.body.style.backgroundColor = '#f5f5f5';
        if (score >= groupGoals[currentGroupIndex]) {
            if (currentGroupIndex < arabicAlphabetGroups.length - 1) {
                currentGroupIndex++;
                saveProgress();
                generateAlphabetIntroduction();
                document.getElementById('quiz-container').style.display = 'none';
                document.getElementById('introduction').style.display = 'block';
                clearInterval(timer); // Clear the timer
                timer = null; // Reset the timer
                stopAudio(); // Stop audio playback
                score = 0; // Reset the score
                document.getElementById('score').textContent = score;
            } else {
                endGame();
                return;
            }
        } else {
            generateQuestion();
            resetTimer();
        }
    }, 500);
}






function startQuiz() {
    document.getElementById('introduction').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
    generateQuestion();
}

function endGame() {
    alert('Congratulations! You won the game!');
    resetGame();
}

function saveProgress() {
    localStorage.setItem('currentGroupIndex', currentGroupIndex);
}

function loadProgress() {
    const savedIndex = localStorage.getItem('currentGroupIndex');
    if (savedIndex !== null) {
        currentGroupIndex = parseInt(savedIndex, 10);
    } else {
        currentGroupIndex = 0;
    }
}

function updateTimeLeft() {
    const timeLeftElement = document.getElementById('time-left');
    let timeLeft = parseInt(timeLeftElement.textContent, 10) - 1;
    if (timeLeft < 0) {
        timeLeft = 10;
    }
    timeLeftElement.textContent = timeLeft;
}

function resetGame() {
    currentGroupIndex = 0;
    saveProgress();
    generateAlphabetIntroduction();
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('introduction').style.display = 'block';
    clearInterval(timer); // Clear the timer
    timer = null; // Reset the timer
    score = 0; // Reset the score
    document.getElementById('score').textContent = score; // Update the score display
}


function playAudio(letterName) {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
    currentAudio = new Audio(`audio/${letterName}.mp3`);
    currentAudio.play();
}

function stopAudio() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
}

function selectOptionByKey(event) {
    const optionKeys = ['1', '2', '3', '4'];
    const key = event.key;

    if (optionKeys.includes(key)) {
        const optionIndex = parseInt(key, 10) - 1;
        const optionButton = document.querySelectorAll('.option')[optionIndex];
        checkAnswer(optionButton);
    }
}

window.addEventListener('keydown', selectOptionByKey);


document.getElementById('start-quiz').addEventListener('click', startQuiz);

loadProgress();
generateAlphabetIntroduction();