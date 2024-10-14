let questions = [];
let currentQuestionIndex = 0;
let selectedAnswers = [];
let correctAnswers = 0;
const TOTAL_QUESTIONS = 20; // Number of questions to show

// Load questions from JSON file
fetch('questions.json')
    .then(response => response.json())
    .then(data => {
        questions = shuffle(data); // Shuffle
        showQuestion();
    });

function showQuestion() {
    if (currentQuestionIndex < TOTAL_QUESTIONS) {
        const currentQuestion = questions[currentQuestionIndex];
        
        // Display the question
        document.getElementById("question").innerText = currentQuestion.question;
        
        // Display the current question number
        document.getElementById("question-number").innerText = `Question ${currentQuestionIndex + 1} of ${TOTAL_QUESTIONS}`;
        
        // Display the options
        const optionsContainer = document.getElementById("options");
        optionsContainer.innerHTML = '';
        currentQuestion.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.innerText = option;
            button.classList.add('option-button');
            button.onclick = () => selectAnswer(index);
            optionsContainer.appendChild(button);
        });
        
        // Hide the "Next" button initially
        document.getElementById("next-button").style.display = "none";
    } else {
        showResults();
    }
}

function selectAnswer(selectedIndex) {
    const question = questions[currentQuestionIndex];
    selectedAnswers.push({
        question: question.question,
        selectedAnswer: question.options[selectedIndex],
        correctAnswer: question.options[question.answerIndex],
        isCorrect: selectedIndex === question.answerIndex
    });

    if (selectedIndex === question.answerIndex) {
        correctAnswers++;
    }

    // Show the "Next" button after selecting an answer
    document.getElementById("next-button").style.display = "block";
}

function nextQuestion() {
    currentQuestionIndex++;
    showQuestion();
}

// Function to display results at the end of the quiz
function showResults() {
    document.getElementById("question-container").style.display = "none";
    const resultsContainer = document.getElementById("results");
    resultsContainer.style.display = "block";

    let resultHtml = `<h2>Results</h2>
                      <p>You got ${correctAnswers} out of ${TOTAL_QUESTIONS} questions correct.</p>`;
    resultHtml += `<h3>Review your answers:</h3>`;
    selectedAnswers.forEach((answer, index) => {
        resultHtml += `<div>
            <strong>Question ${index + 1}:</strong> ${answer.question}<br>
            <strong>Your answer:</strong> ${answer.selectedAnswer}<br>
            <strong>Correct answer:</strong> ${answer.correctAnswer}<br>
            ${answer.isCorrect ? '<span style="color: green;">Correct</span>' : '<span style="color: red;">Incorrect</span>'}
            <br><br>
        </div>`;
    });
    resultsContainer.innerHTML = resultHtml;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Initialize the quiz
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("next-button").addEventListener('click', nextQuestion);
});
