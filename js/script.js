window.addEventListener('load', () => {
	const mainCard = document.querySelector('.main-card');
	const countdownEl = document.querySelector('.countdown');
	const amountInputs = document.querySelectorAll('.radio-input');
	const gameStart = document.querySelector('.game-start');
	const gameStartModes = document.querySelectorAll('.game-start__mode');
	const gameStartBtn = document.querySelector('.game-start__btn');
	const gameTasksEl = document.querySelector('.game__tasks');
	const gameTasksList = document.querySelector('.game__task-list');
	const btnRight = document.querySelector('.btn-right');
	const btnWrong = document.querySelector('.btn-wrong');
	const headerTitle = document.querySelector('.game__title');
	const gameEndEl = document.querySelector('.game__end');
	const gameEndTime = document.querySelector('.game__end-time');
	const correctEndEl = document.querySelector('.game__end-correct-score');
	const incorrectEndEl = document.querySelector('.game__end-incorrect-score');
	const gameEndTimeSpan = document.querySelector('.game__end-base-span');
	const gameEndPenalty = document.querySelector('.game__end-penalty-span');
	const gameEndBtn = document.querySelector('.game__end-btn');
	const gameTaskList = document.querySelector('.game__task-list');

	let clientHeight = 57;
	let tasksArr = [];
	let score = 0;
	let time = 0;
	let timeInterval;
	let questionsAmount = 0;
	let gameStartModeScoreValue;
	let gameStartModeCorrectValue;

	const OPERATIONS_Obj = {
		'+': (a, b) => a + b,
		'-': (a, b) => a - b,
		'*': (a, b) => a * b,
		'/': (a, b) => a / b,
	};

	gameStart.addEventListener('click', (e) => {
		const el = e.target;
		if (el.classList.contains('game-start__mode')) {
			gameStartModeScoreValue = el.querySelector('.score__value');
			gameStartModeCorrectValue = el.querySelector('.score__results-value');
			gameStartModes.forEach((item) =>
				item.classList.remove('game-start__mode--active')
			);
			el.classList.add('game-start__mode--active');
			const input = el.querySelector('.radio-input');
			input.checked = true;
			gameStartBtn.removeAttribute('disabled');
		}
	});

	gameStart.addEventListener('submit', (e) => {
		e.preventDefault();
		mainCard.classList.add('hidden');
		countdownEl.classList.remove('hidden');
		countdownEl.innerHTML = '3...';
		setTimeout(() => (countdownEl.innerHTML = '2...'), 1000);
		setTimeout(() => (countdownEl.innerHTML = '1...'), 2000);
		setTimeout(() => (countdownEl.innerHTML = 'GO!'), 3000);
		setTimeout(() => {
			timeInterval = setInterval(() => {
				time += 100;
			}, 100);

			countdownEl.classList.add('hidden');
			gameTasksEl.classList.remove('hidden');
			amountInputs.forEach((item) =>
				item.checked ? (questionsAmount = +item.value) : null
			);

			for (let i = 0; i < questionsAmount; i++) {
				const taskObj = getRandomTask();
				tasksArr.push({
					taskObj,
					problem: `${taskObj.firstNumber} ${taskObj.sign} ${
						taskObj.secondNumber
					} = ${taskObj.result()}`,
				});
			}

			gameTasksList.innerHTML = '';

			tasksArr.forEach((item) => {
				const task = document.createElement('div');
				task.innerHTML = `${item.problem}`;
				task.classList.add('game__task');
				gameTasksList.append(task);
			});

			document.querySelector('.game__task').classList.add('game__task--active');

			nextTaskScroll(gameTaskList, 0, 'auto');
		}, 3100);
	});

	function getRandomNumber(n) {
		return Math.floor(Math.random() * n + 1);
	}

	function getRandomSign() {
		return ['+', '-', '*', '/'][getRandomNumber(4) - 1];
	}

	function getRandomTask() {
		return {
			sign: getRandomSign(),
			firstNumber: getRandomNumber(10),
			secondNumber: getRandomNumber(10),
			result: function () {
				if (getRandomNumber(100) % 2 === 0) {
					this.correct = true;
					return OPERATIONS_Obj[this.sign](this.firstNumber, this.secondNumber);
				} else {
					this.correct = false;
					return getRandomNumber(100);
				}
			},
		};
	}

	function taskRight(condition) {
		const gameTask = document.querySelector('.game__task--active');
		const gameTasksEls = document.querySelectorAll('.game__task');

		if (gameTask) {
			condition
				? gameTask.classList.add('game__task-right')
				: gameTask.classList.add('game__task-wrong');
		}

		gameTasksEls.forEach((item) => item.classList.remove('game__task--active'));
		if (gameTask.nextElementSibling !== null) {
			gameTask.nextElementSibling.classList.add('game__task--active');
		} else {
			gameOver();
		}
	}

	btnRight.addEventListener('click', () => {
		taskRight(true);
		nextTaskScroll(gameTaskList, clientHeight);
		clientHeight += 57;
	});

	btnWrong.addEventListener('click', () => {
		taskRight(false);
		nextTaskScroll(gameTaskList, clientHeight);
		clientHeight += 57;
	});

	function nextTaskScroll(element, height, behavior = 'smooth') {
		element.scrollTo({
			top: height,
			behavior: behavior,
		});
	}

	function gameOver() {
		const gameTasksEls = document.querySelectorAll('.game__task');
		gameTasksEl.classList.add('hidden');
		gameEndEl.classList.remove('hidden');

		for (let i = 0; i < gameTasksEls.length; i++) {
			if (
				gameTasksEls[i].classList.contains('game__task-right') &&
				tasksArr[i].taskObj.correct
			) {
				score++;
			} else if (
				gameTasksEls[i].classList.contains('game__task-wrong') &&
				!tasksArr[i].taskObj.correct
			) {
				score++;
			}
		}

		const bestScore = ((questionsAmount - score) * 0.5 * 1000 + time) / 1000;

		gameStartModeScoreValue.innerHTML = `${bestScore}s`;
		gameStartModeCorrectValue.innerHTML = `${score}`;

		gameEndTime.innerHTML = `${bestScore}s`;
		correctEndEl.innerHTML = `${score}`;
		incorrectEndEl.innerHTML = `${questionsAmount - score}`;
		gameEndTimeSpan.innerHTML = `${time / 1000}s`;
		gameEndPenalty.innerHTML = `+${(questionsAmount - score) * 0.5}s`;

		clearInterval(timeInterval);
	}

	function playAgain() {
		mainCard.classList.remove('hidden');
		gameEndEl.classList.add('hidden');

		gameStartBtn.setAttribute('disabled', '');
		const gameStartModeActive = document.querySelector(
			'.game-start__mode--active'
		);
		gameStartModeActive.classList.remove('game-start__mode--active');
		tasksArr = [];
		score = 0;
		time = 0;
		questionsAmount = 0;
		gameStartModeScoreValue;
		gameStartModeCorrectValue;

		clientHeight = 57;
	}

	gameEndBtn.addEventListener('click', playAgain);
});
