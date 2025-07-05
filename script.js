document.addEventListener('DOMContentLoaded', () => {
    // ... (DOM要素の取得部分は変更なし) ...
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

            // 今日の日付に基づいて問題をフィルタリング
            const today = new Date();
            // 日本時間に調整 (例: JST UTC+9)
            const offset = today.getTimezoneOffset() * 60 * 1000; // ミリ秒単位のオフセット
            const jstDate = new Date(today.getTime() + (9 * 60 * 60 * 1000) + offset);

            const year = jstDate.getFullYear();
            const month = String(jstDate.getMonth() + 1).padStart(2, '0');
            const day = String(jstDate.getDate()).padStart(2, '0');
            const todayId = `${year}${month}${day}`;

            const questionForToday = allQuestions.find(q => q.id === todayId);

            if (questionForToday) {
                questions = [questionForToday]; // 今日の問題だけをquestions配列に入れる
            } else {
                // 今日の問題が見つからない場合のフォールバック（例：最初の一つを使う、エラーメッセージを出すなど）
                console.warn(`今日 (${todayId}) の問題が見つかりませんでした。最初の問題を表示します。`);
                questions = [allQuestions[0]]; // またはエラー表示
            }

            // 問題が読み込まれたら最初のページを表示
            showPage(coverPage);

        } catch (error) {
            console.error('問題の読み込みに失敗しました:', error);
            // エラーメッセージを表示するなどの処理
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
        loadQuestionContent(); // ここを修正: loadQuestionContent() を呼び出す
        showPage(questionPage);
    });

    // --- 問題の読み込みと表示 (関数名を変更) ---
    function loadQuestionContent() { // 関数名を変更しました
        const q = questions[currentQuestionIndex];
        if (!q) { // 問題が定義されていない場合のガード
            console.error("問題が見つかりません。");
            quizContainer.innerHTML = '<p style="color: red;">問題の表示に失敗しました。設定を確認してください。</p>';
            return;
        }

        questionText.textContent = `問題：\n${q.question}`; // 「問題1：」を削除
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
