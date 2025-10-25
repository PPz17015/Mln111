class QuizApp {
    constructor() {
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.score = { correct: 0, wrong: 0 };
        this.wrongAnswers = [];
        this.userAnswers = [];
        this.isAnswered = false;
        
        this.initializeElements();
        this.loadQuestions();
        this.bindEvents();
    }

    initializeElements() {
        this.questionText = document.getElementById('question-text');
        this.optionButtons = {
            A: document.getElementById('option-a'),
            B: document.getElementById('option-b'),
            C: document.getElementById('option-c'),
            D: document.getElementById('option-d')
        };
        this.optionTexts = {
            A: document.getElementById('option-a-text'),
            B: document.getElementById('option-b-text'),
            C: document.getElementById('option-c-text'),
            D: document.getElementById('option-d-text')
        };
        this.nextBtn = document.getElementById('next-btn');
        this.restartBtn = document.getElementById('restart-btn');
        this.newQuizBtn = document.getElementById('new-quiz-btn');
        this.progressBar = document.getElementById('progress');
        this.correctCount = document.getElementById('correct-count');
        this.wrongCount = document.getElementById('wrong-count');
        this.currentQuestion = document.getElementById('current-question');
        this.totalQuestions = document.getElementById('total-questions');
        this.quizContainer = document.getElementById('quiz-container');
        this.resultsSection = document.getElementById('results-section');
        this.finalTotal = document.getElementById('final-total');
        this.finalCorrect = document.getElementById('final-correct');
        this.finalWrong = document.getElementById('final-wrong');
        this.finalPercentage = document.getElementById('final-percentage');
        this.wrongList = document.getElementById('wrong-list');
    }

    async loadQuestions() {
        try {
            const response = await fetch('questions.json');
            this.questions = await response.json();
            this.totalQuestions.textContent = this.questions.length;
            this.displayQuestion();
        } catch (error) {
            console.error('Lỗi khi tải câu hỏi:', error);
            this.questionText.textContent = 'Lỗi khi tải câu hỏi. Vui lòng kiểm tra file questions.json';
        }
    }

    bindEvents() {
        // Bind option buttons
        Object.keys(this.optionButtons).forEach(option => {
            this.optionButtons[option].addEventListener('click', () => {
                this.selectOption(option);
            });
        });

        // Bind action buttons
        this.nextBtn.addEventListener('click', () => {
            this.nextQuestion();
        });

        this.restartBtn.addEventListener('click', () => {
            this.restartQuiz();
        });

        this.newQuizBtn.addEventListener('click', () => {
            this.restartQuiz();
        });
    }

    displayQuestion() {
        if (this.currentQuestionIndex >= this.questions.length) {
            this.showResults();
            return;
        }

        const question = this.questions[this.currentQuestionIndex];
        this.questionText.textContent = `${question.id}. ${question.question}`;
        
        // Update option texts
        Object.keys(question.options).forEach(option => {
            this.optionTexts[option].textContent = question.options[option];
        });

        // Reset button states
        this.resetOptionButtons();
        this.nextBtn.disabled = true;
        this.isAnswered = false;

        // Update progress
        this.updateProgress();
        this.currentQuestion.textContent = this.currentQuestionIndex + 1;
    }

    selectOption(selectedOption) {
        if (this.isAnswered) return;

        const question = this.questions[this.currentQuestionIndex];
        const isCorrect = selectedOption === question.correct;

        // Store user answer
        this.userAnswers[this.currentQuestionIndex] = selectedOption;

        // Update score
        if (isCorrect) {
            this.score.correct++;
        } else {
            this.score.wrong++;
            this.wrongAnswers.push({
                question: question.question,
                userAnswer: selectedOption,
                correctAnswer: question.correct,
                questionNumber: question.id
            });
        }

        // Show correct/incorrect answers
        this.showAnswerFeedback(selectedOption, question.correct);
        
        this.isAnswered = true;
        this.nextBtn.disabled = false;
        this.updateScoreDisplay();
    }

    showAnswerFeedback(selectedOption, correctAnswer) {
        // Highlight correct answer in green
        this.optionButtons[correctAnswer].classList.add('correct');
        
        // Highlight wrong answer in red if different from correct
        if (selectedOption !== correctAnswer) {
            this.optionButtons[selectedOption].classList.add('wrong');
        }

        // Disable all buttons
        Object.values(this.optionButtons).forEach(btn => {
            btn.disabled = true;
        });
    }

    resetOptionButtons() {
        Object.values(this.optionButtons).forEach(btn => {
            btn.disabled = false;
            btn.classList.remove('correct', 'wrong', 'selected');
        });
    }

    nextQuestion() {
        this.currentQuestionIndex++;
        if (this.currentQuestionIndex < this.questions.length) {
            this.displayQuestion();
        } else {
            this.showResults();
        }
    }

    showResults() {
        this.quizContainer.style.display = 'none';
        this.resultsSection.style.display = 'block';

        const total = this.questions.length;
        const percentage = Math.round((this.score.correct / total) * 100);

        this.finalTotal.textContent = total;
        this.finalCorrect.textContent = this.score.correct;
        this.finalWrong.textContent = this.score.wrong;
        this.finalPercentage.textContent = percentage;

        // Display wrong answers
        this.displayWrongAnswers();
    }

    displayWrongAnswers() {
        if (this.wrongAnswers.length === 0) {
            this.wrongList.innerHTML = '<p style="color: #4caf50; font-weight: bold;">Chúc mừng! Bạn đã trả lời đúng tất cả câu hỏi!</p>';
            return;
        }

        this.wrongList.innerHTML = this.wrongAnswers.map(wrong => `
            <div class="wrong-item">
                <div class="question">Câu ${wrong.questionNumber}: ${wrong.question}</div>
                <div class="answer-info">
                    <span class="user-answer">Bạn chọn: ${wrong.userAnswer}</span> | 
                    <span class="correct-answer">Đáp án đúng: ${wrong.correctAnswer}</span>
                </div>
            </div>
        `).join('');
    }

    restartQuiz() {
        this.currentQuestionIndex = 0;
        this.score = { correct: 0, wrong: 0 };
        this.wrongAnswers = [];
        this.userAnswers = [];
        this.isAnswered = false;

        this.quizContainer.style.display = 'block';
        this.resultsSection.style.display = 'none';
        
        this.updateScoreDisplay();
        this.displayQuestion();
    }

    updateProgress() {
        const progress = ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
        this.progressBar.style.width = `${progress}%`;
    }

    updateScoreDisplay() {
        this.correctCount.textContent = this.score.correct;
        this.wrongCount.textContent = this.score.wrong;
    }
}

// Initialize the quiz when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new QuizApp();
});
