let questions = [];
let currentQuestionIndex = 0;
let selectedAnswers = [];
let correctAnswers = 0;
let totalQuestions = 20; // Number of questions to show
let selectedAnswer = 0;

// Load questions from JSON file
fetch('questions.json')
    .then(response => response.json())
    .then(data => {
        questions = shuffle(data); // Shuffle
        showQuestion();
    });

function showQuestion() {
    if (currentQuestionIndex < totalQuestions) {
        const currentQuestion = questions[currentQuestionIndex];
        
        // Display the question
        document.getElementById("question").innerText = currentQuestion.question;
        
        // Display the current question number
        document.getElementById("question-number").innerText = `Question ${currentQuestionIndex + 1} of ${totalQuestions}`;
        
        // Display the options
        currentQuestion.options.forEach((option, index) => {
            const button = document.getElementById("option-" + index);
            button.innerText = option;
            button.onclick = () => selectAnswer(index);
        });
        
        // Hide the "Next" button initially
        // document.getElementById("next-button").style.display = "none";
    } else {
        showResults();
    }
}

function selectAnswer(selectedIndex) {
    selectedAnswer = selectedIndex;

    // Show the "Next" button after selecting an answer
    document.getElementById("next-button").style.display = "block";
}

function nextQuestion() {
    const question = questions[currentQuestionIndex];
    selectedAnswers.push({
        question: question.question,
        selectedAnswer: question.options[selectedAnswer],
        correctAnswer: question.options[question.answerIndex],
        isCorrect: selectedAnswer === question.answerIndex
    });

    if (selectedAnswer === question.answerIndex) {
        correctAnswers++;
    }

    currentQuestionIndex++;
    showQuestion();
}

// Function to display results at the end of the quiz
function showResults() {
    document.getElementById("question-container").style.display = "none";
    const resultsContainer = document.getElementById("results");
    resultsContainer.style.display = "block";

    let resultHtml = `<h2>Results</h2>
                      <p>You got ${correctAnswers} out of ${totalQuestions} questions correct.</p>`;
    resultHtml += `<h3>Review your answers:</h3>`;
    selectedAnswers.forEach((answer, index) => {
        if (!answer.isCorrect) {
            resultHtml += `<div>
                <span class="result-question">Question ${index + 1}: ${answer.question}</span><br>
                <span class="result-answer">Your answer is: ${answer.selectedAnswer} </span><br>
                <span class="result-answer">Correct answer: ${answer.correctAnswer}</span><br>
                ${answer.isCorrect ? '<span class="result-correct">Correct</span>' : '<span class="result-incorrect">Incorrect</span>'}
                <br><br>
            </div>`;
        }
    });

    resultsContainer.innerHTML = resultHtml;

    const encouragementImage = document.createElement("img");    
    if (correctAnswers > totalQuestions * 0.75) {
      encouragementImage.src = "bunny.png";
      encouragementImage.alt = "Encouraging Bunny";
      initSparticles();
      showGreets()
    } else if (correctAnswers >= totalQuestions * 0.5) {
      encouragementImage.src = "goose.png";
      encouragementImage.alt = "Encouraging Goose";
      showApprove()
    } else {
      encouragementImage.src = "beaver.png";
      encouragementImage.alt = "Encouraging Beaver";
      showGrief()
    }
    resultsContainer.appendChild(encouragementImage);
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function startQuiz() {
    document.getElementById("start-container").style.display = "none";
    document.getElementById("question-container").style.display = "block";
}

// Initialize the quiz
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("next-button").addEventListener('click', nextQuestion);

    document.getElementById("start").addEventListener('click', startQuiz);
    
    const dropdown = document.getElementById("question-count");
    dropdown.addEventListener("change", setTotalQuestions);

});

function setTotalQuestions() {
    const dropdown = document.getElementById("question-count");
    totalQuestions = parseInt(dropdown.value);
    showQuestion();
}

// Particles configuration
const colors = [
    "rgba(255,0,0,1)",
    "rgba(222,165,0,1)",
    "rgba(0,150,255,1)",
    "rgba(0,150,125,1)"
];

const options = {
    alphaSpeed: 10,
    alphaVariance: 1,
    color: colors,
    composition: "source-over",
    count: 350,
    direction: 161,
    float: 0.75,
    glow: 3,

    // Movement variants for Particles
    maxAlpha: 3,
    maxSize: 22,
    minAlpha: -0.2,
    minSize: 8,
    parallax: 1.75,
    rotation: 0.5,
    shape: "diamond",
    speed: 32,
    style: "fill",
    twinkle: false,
    xVariance: 5,
    yVariance: 0,
};

// Function to initialize sparticles (Particles)
function initSparticles() {
    const $main = document.querySelector('.falling');
    window.mySparticles = new sparticles.Sparticles($main, options);

    // Stop the particles after 3 seconds
    setTimeout(() => {
        window.mySparticles.stop(); // Stop the particle effect
        $main.style.visibility = 'hidden'; // Make the particles invisible
    }, 3000);
}

function showGreets() {
    const greetsContainer = document.createElement("div");
    greetsContainer.id = "greets-container";
    greetsContainer.innerHTML = `<div class="greets"><h2>Congratulations, you passed!</h2></div>`;
    document.body.appendChild(greetsContainer);

    const style = document.createElement("style");
    style.innerHTML = `
      .greets {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #ff0;
        font-size: 3em;
        animation: fadeInOut 3s ease-in-out;
      }
      @keyframes fadeInOut {
        0% { opacity: 0; }
        25% { opacity: 1; }
        75% { opacity: 1; }
        100% { opacity: 0; }
      }
    `;
    document.head.appendChild(style);
    // Set the element to display: none after animation ends
    greetsContainer.addEventListener('animationend', () => {
        greetsContainer.style.display = 'none';
    });
}

function showApprove() {
    const approveContainer = document.createElement("div");
    approveContainer.id = "approve-container";
    approveContainer.innerHTML = `<div class="approve"><h2>You are doing good! Study more!</h2></div>`;
    document.body.appendChild(approveContainer);

    const style = document.createElement("style");
    style.innerHTML = `
      .approve {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #ff0;
        font-size: 3em;
        animation: fadeInOut 3s ease-in-out;
      }
      @keyframes fadeInOut {
        0% { opacity: 0; }
        25% { opacity: 1; }
        75% { opacity: 1; }
        100% { opacity: 0; }
      }
    `;
    document.head.appendChild(style);
    // Set the element to display: none after animation ends
    approveContainer.addEventListener('animationend', () => {
        approveContainer.style.display = 'none';
    });
}

function showGrief() {
    const griefContainer = document.createElement("div");
    griefContainer.id = "grief-container";
    griefContainer.innerHTML = `<div class="grief"><h2>Ohh! Please, try again!</h2></div>`;
    document.body.appendChild(griefContainer);

    const style = document.createElement("style");
    style.innerHTML = `
      .grief {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #ff0;
        font-size: 3em;
        animation: fadeInOut 3s ease-in-out;
      }
      @keyframes fadeInOut {
        0% { opacity: 0; }
        25% { opacity: 1; }
        75% { opacity: 1; }
        100% { opacity: 0; }
      }
    `;
    document.head.appendChild(style);
    // Set the element to display: none after animation ends
    griefContainer.addEventListener('animationend', () => {
        griefContainer.style.display = 'none';
    });
}
