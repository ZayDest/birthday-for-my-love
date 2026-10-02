export const SURPRISES = [
  {
    id: 'adore',
    number: '01',
    symbol: '✦',
    title: 'Something I adore',
    hint: 'A little truth about you',
    message: 'You have a way of making ordinary moments feel like the ones I want to remember forever. Your laugh, your kindness, the way you are simply you — I adore it all.',
  },
  {
    id: 'promise',
    number: '02',
    symbol: '♡',
    title: 'A little promise',
    hint: 'For all the days ahead',
    message: 'I promise to keep choosing you. In the exciting chapters, in the quiet Tuesdays, and in every small moment in between, I want to be right there beside you.',
  },
  {
    id: 'wish',
    number: '03',
    symbol: '✳',
    title: 'My wish for you',
    hint: 'Especially this year',
    message: 'I hope this year brings you soft mornings, brave beginnings, beautiful surprises, and the deep certainty that you are loved more than words can hold.',
  },
];

export const ENDINGS = [
  {
    id: 'stars',
    symbol: '✦',
    label: 'Under the stars',
    message: 'Then let’s find a night sky, make a wish together, and let the world wait a little while.',
  },
  {
    id: 'dance',
    symbol: '♫',
    label: 'A slow dance',
    message: 'Then this is my invitation: one song, no rush, just you and me.',
  },
  {
    id: 'cozy',
    symbol: '☾',
    label: 'A cozy night in',
    message: 'Then let’s make the comfiest corner in the world and stay there awhile.',
  },
];

export function initialState() {
  return { opened: [], ending: null };
}

export function revealSurprise(state, id) {
  if (!SURPRISES.some((surprise) => surprise.id === id) || state.opened.includes(id)) {
    return state;
  }
  return { ...state, opened: [...state.opened, id] };
}

export function canReadLetter(state) {
  return state.opened.length === SURPRISES.length;
}

export function chooseEnding(state, id) {
  if (!canReadLetter(state) || !ENDINGS.some((ending) => ending.id === id)) {
    return state;
  }
  return { ...state, ending: id };
}
