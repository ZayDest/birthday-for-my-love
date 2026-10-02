import { SURPRISES, ENDINGS, initialState, revealSurprise, canReadLetter, chooseEnding } from './story.mjs';

let state = initialState();

const dialog = document.querySelector('#surpriseDialog');
const cards = [...document.querySelectorAll('[data-surprise]')];
const progressCount = document.querySelector('#progressCount');
const progressBar = document.querySelector('#progressBar');
const progressFill = document.querySelector('#progressFill');
const letterGate = document.querySelector('#letterGate');
const letterGateTitle = document.querySelector('#letterGateTitle');
const letterGateDesc = document.querySelector('#letterGateDesc');
const openLetterButton = document.querySelector('#openLetterButton');
const letterSection = document.querySelector('#letterSection');
const endingResult = document.querySelector('#endingResult');
const endingMessage = document.querySelector('#endingMessage');

function updateProgress() {
  const count = state.opened.length;
  progressCount.textContent = `${count} of ${SURPRISES.length} opened`;
  progressBar.setAttribute('aria-valuenow', String(count));
  progressFill.style.width = `${(count / SURPRISES.length) * 100}%`;

  cards.forEach((card) => {
    const opened = state.opened.includes(card.dataset.surprise);
    card.classList.toggle('is-opened', opened);
    card.querySelector('.card-status').textContent = opened ? 'Read again' : 'Open me';
  });

  if (canReadLetter(state)) {
    letterGate.classList.add('is-unlocked');
    letterGateTitle.textContent = 'Your letter is ready';
    letterGateDesc.textContent = 'All three little surprises led here. This one is from my heart.';
    openLetterButton.hidden = false;
  }
}

cards.forEach((card) => {
  card.addEventListener('click', () => {
    const surprise = SURPRISES.find((item) => item.id === card.dataset.surprise);
    if (!surprise) return;

    state = revealSurprise(state, surprise.id);
    updateProgress();
    document.querySelector('#dialogNumber').textContent = `SURPRISE ${surprise.number} / 03`;
    document.querySelector('#dialogSymbol').textContent = surprise.symbol;
    document.querySelector('#dialogTitle').textContent = surprise.title;
    document.querySelector('#dialogMessage').textContent = surprise.message;
    dialog.showModal();
  });
});

document.querySelector('#dialogClose').addEventListener('click', () => dialog.close());
document.querySelector('#dialogDone').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});

openLetterButton.addEventListener('click', () => {
  if (!canReadLetter(state)) return;
  letterGate.hidden = true;
  letterSection.hidden = false;
  document.querySelector('#letterTitle').focus({ preventScroll: true });
  letterSection.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
});

function celebrate() {
  const container = document.querySelector('#confetti');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  container.replaceChildren();
  const colors = ['#c8849b', '#e4bd70', '#e9a8b8', '#fff0dc', '#9e6379'];

  for (let index = 0; index < 36; index += 1) {
    const piece = document.createElement('span');
    piece.style.setProperty('--x', `${Math.random() * 100}vw`);
    piece.style.setProperty('--delay', `${Math.random() * 0.5}s`);
    piece.style.setProperty('--duration', `${2.3 + Math.random() * 1.6}s`);
    piece.style.setProperty('--rotation', `${Math.random() * 720 - 360}deg`);
    piece.style.backgroundColor = colors[index % colors.length];
    container.append(piece);
  }

  window.setTimeout(() => container.replaceChildren(), 4500);
}

document.querySelectorAll('[data-ending]').forEach((button) => {
  button.addEventListener('click', () => {
    const nextState = chooseEnding(state, button.dataset.ending);
    if (nextState === state) return;
    state = nextState;
    const ending = ENDINGS.find((item) => item.id === state.ending);
    document.querySelectorAll('[data-ending]').forEach((choice) => {
      const selected = choice.dataset.ending === state.ending;
      choice.classList.toggle('is-selected', selected);
      choice.setAttribute('aria-pressed', String(selected));
    });
    endingMessage.textContent = ending.message;
    endingResult.hidden = false;
    celebrate();
  });
});
