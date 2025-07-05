document.addEventListener('DOMContentLoaded', () => {
    // DOM要素の取得 (変更なし)
    const quizContainer = document.getElementById('quiz-container');
    const coverPage = document.getElementById('cover-page');
    const startButton = document.getElementById('start-button');
    const questionPage = document.getElementById('question-page');
    const questionText = document.getElementById('question-text');
    const choicesContainer = document.getElementById('choices-container');
    const feedbackArea = document.getElementById('feedback-area');
    const resultText = document.getElementById('result-text');
    const explanationText = document.getElementById('explanation-text');
    const nextQuestionButton = document.getElementById('next-question-button');
    const finalPage = document.getElementById('final-page');
    const finalMessage = document.getElementById('final-message');
    const attemptsCountSpan = document.getElementById('attempts-count');
    const retryButton = document.getElementById('retry-button');

    // クイズの問題データは外部ファイルから読み込むように変更
    let questions = []; // 初期化

    let currentQuestionIndex = 0;
    let attemptsCount = 0;
    let quizCompletedSuccessfully = true;

    // --- 問題データを読み込む関数 ---
    async function loadQuestions() {
        try {
            const response = await fetch('questions.json'); // questions.jsonを読み込み
            const allQuestions = await response.json();

            // JSONファイルから読み込んだ最初の問題のみを使用
            if (allQuestions.length > 0) {
                questions = [allQuestions[0]];
            } else {
                console.error('questions.jsonに問題が定義されていません。');
                quizContainer.innerHTML = '<p style="color: red;">問題の読み込みに失敗しました。問題ファイルを確認してください。</p>';
                return; // 問題がない場合は処理を中断
            }

            // 問題が読み込まれたら最初のページを表示
            showPage(coverPage);

        } catch (error) {
            console.error('問題の読み込みに失敗しました:', error);
            quizContainer.innerHTML = '<p style="color: red;">クイズの読み込みに失敗しました。時間をおいて再度お試しください。</p>';
        }
    }

    // --- ページの表示・非表示を制御する関数 (変更なし) ---
    function showPage(pageToShow) {
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => {
            page.classList.remove('active');
            page.style.display = 'none';
        });

        pageToShow.style.display = 'flex';
        setTimeout(() => {
            pageToShow.classList.add('active');
        }, 10);
    }

    // --- クイズの開始 (変更なし) ---
    startButton.addEventListener('click', () => {
        attemptsCount++;
        currentQuestionIndex = 0;
        quizCompletedSuccessfully = true;
        loadQuestionContent();
        showPage(questionPage);
    });

    // --- 問題の読み込みと表示 (関数名を変更) ---
    function loadQuestionContent() {
        const q = questions[currentQuestionIndex];
        if (!q) {
            console.error("問題が見つかりません。");
            quizContainer.innerHTML = '<p style="color: red;">問題の表示に失敗しました。設定を確認してください。</p>';
            return;
        }

        // ここを修正: 「問題：」を削除し、問題文だけを表示
        questionText.textContent = q.question;
        choicesContainer.innerHTML = '';

        resultText.textContent = '';
        resultText.classList.remove('correct-feedback', 'incorrect-feedback');
        explanationText.textContent = '';
        feedbackArea.style.display = 'none';
        nextQuestionButton.style.display = 'none';

        q.choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.textContent = choice;
            button.classList.add('choice-button');
            button.dataset.index = index;
            button.addEventListener('click', handleChoiceClick);
            choicesContainer.appendChild(button);
        });
    }

    // --- 選択肢クリック時の処理 (変更なし) ---
    function handleChoiceClick(event) {
        if (event.target.classList.contains('selected')) {
            return;
        }

        const selectedButton = event.target;
        const selectedIndex = parseInt(selectedButton.dataset.index);
        const q = questions[currentQuestionIndex];

        const allChoiceButtons = choicesContainer.querySelectorAll('.choice-button');
        allChoiceButtons.forEach(button => button.classList.add('selected'));

        feedbackArea.style.display = 'block';
        if (selectedIndex === q.correctAnswer) {
            selectedButton.classList.add('correct');
            resultText.textContent = '正解！';
            resultText.classList.add('correct-feedback');
        } else {
            selectedButton.classList.add('incorrect');
            resultText.textContent = '不正解...';
            resultText.classList.add('incorrect-feedback');
            quizCompletedSuccessfully = false;
        }
        explanationText.textContent = `解説：${q.explanation}`;

        nextQuestionButton.style.display = 'block';
    }

    // --- 「次へ」ボタンクリック時の処理 (変更なし) ---
    nextQuestionButton.addEventListener('click', () => {
        displayFinalPage();
    });

    // --- 最終ページの表示 (変更なし) ---
    function displayFinalPage() {
        if (quizCompletedSuccessfully) {
            finalMessage.textContent = 'めんそ～れ～♪';
            finalMessage.classList.add('win');
            finalMessage.classList.remove('lose');
        } else {
            finalMessage.textContent = 'どんまい';
            finalMessage.classList.add('lose');
            finalMessage.classList.remove('win');
        }
        attemptsCountSpan.textContent = attemptsCount;
        showPage(finalPage);
    }

    // --- 再挑戦ボタンの処理 (変更なし) ---
    retryButton.addEventListener('click', () => {
        currentQuestionIndex = 0;
        quizCompletedSuccessfully = true;
        finalMessage.classList.remove('win', 'lose');
        showPage(coverPage);
    });

    // スクリプト読み込み時に問題データをロードする
    loadQuestions();
});
