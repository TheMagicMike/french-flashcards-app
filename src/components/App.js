import React, { useState, useEffect } from 'react';

// Embedded vocabulary data - sample words for each theme/difficulty
const VOCAB_DATA = {
  adjectives: {
    beginner: [
      { fr: 'grand', en: 'big' }, { fr: 'petit', en: 'small' }, { fr: 'beau', en: 'beautiful' },
      { fr: 'bon', en: 'good' }, { fr: 'mauvais', en: 'bad' }, { fr: 'chaud', en: 'hot' },
      { fr: 'froid', en: 'cold' }, { fr: 'jeune', en: 'young' }, { fr: 'vieux', en: 'old' },
      { fr: 'nouveau', en: 'new' }, { fr: 'heureux', en: 'happy' }, { fr: 'triste', en: 'sad' },
      { fr: 'rapide', en: 'fast' }, { fr: 'lent', en: 'slow' }, { fr: 'fort', en: 'strong' },
      { fr: 'faible', en: 'weak' }, { fr: 'long', en: 'long' }, { fr: 'court', en: 'short' },
      { fr: 'facile', en: 'easy' }, { fr: 'difficile', en: 'difficult' }
    ],
    intermediate: [
      { fr: 'magnifique', en: 'magnificent' }, { fr: 'extraordinaire', en: 'extraordinary' },
      { fr: 'splendide', en: 'splendid' }, { fr: 'merveilleux', en: 'marvelous' },
      { fr: 'étonnant', en: 'astonishing' }, { fr: 'remarquable', en: 'remarkable' },
      { fr: 'impressionnant', en: 'impressive' }, { fr: 'formidable', en: 'formidable' },
      { fr: 'exceptionnel', en: 'exceptional' }, { fr: 'génial', en: 'brilliant' }
    ],
    advanced: [
      { fr: 'incommensurable', en: 'immeasurable' }, { fr: 'ineffable', en: 'ineffable' },
      { fr: 'époustouflant', en: 'breathtaking' }, { fr: 'prodigieux', en: 'prodigious' },
      { fr: 'stupéfiant', en: 'stupefying' }
    ]
  },
  verbs: {
    beginner: [
      { fr: 'être', en: 'to be' }, { fr: 'avoir', en: 'to have' }, { fr: 'aller', en: 'to go' },
      { fr: 'faire', en: 'to do/make' }, { fr: 'dire', en: 'to say' }, { fr: 'pouvoir', en: 'can/to be able to' },
      { fr: 'voir', en: 'to see' }, { fr: 'vouloir', en: 'to want' }, { fr: 'venir', en: 'to come' },
      { fr: 'devoir', en: 'must/to have to' }, { fr: 'prendre', en: 'to take' }, { fr: 'donner', en: 'to give' },
      { fr: 'parler', en: 'to speak' }, { fr: 'manger', en: 'to eat' }, { fr: 'boire', en: 'to drink' },
      { fr: 'dormir', en: 'to sleep' }, { fr: 'travailler', en: 'to work' }, { fr: 'aimer', en: 'to love/like' }
    ]
  },
  nouns: {
    beginner: [
      { fr: 'maison', en: 'house' }, { fr: 'chat', en: 'cat' }, { fr: 'chien', en: 'dog' },
      { fr: 'livre', en: 'book' }, { fr: 'table', en: 'table' }, { fr: 'chaise', en: 'chair' },
      { fr: 'eau', en: 'water' }, { fr: 'pain', en: 'bread' }, { fr: 'voiture', en: 'car' },
      { fr: 'école', en: 'school' }, { fr: 'ami', en: 'friend' }, { fr: 'famille', en: 'family' }
    ]
  }
};

const THEMES = {
  redBlack: { background: '#0a0000', card: '#1a0202', text: '#fff', accent: '#ff1744', button: '#c41c00' },
  cyberpunk: { background: '#0d001a', card: '#1a0033', text: '#39ff14', accent: '#ff2a6d', button: '#d1005a' },
  ocean: { background: '#001a33', card: '#003366', text: '#fff', accent: '#00bfff', button: '#0080ff' }
};

function App() {
  const [theme, setTheme] = useState('redBlack');
  const [difficulty, setDifficulty] = useState('beginner');
  const [topic, setTopic] = useState(null);
  const [mode, setMode] = useState('select');
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [helpWords, setHelpWords] = useState(() => JSON.parse(localStorage.getItem('helpWords') || '[]'));

  const shuffle = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const startFlashcards = (selectedTopic) => {
    const data = VOCAB_DATA[selectedTopic]?.[difficulty] || [];
    const randomWords = shuffle(data).slice(0, Math.min(20, data.length));
    setWords(randomWords);
    setTopic(selectedTopic);
    setCurrentIndex(0);
    setShowAnswer(false);
    setMode('flashcards');
  };

  const addHelpWord = (word) => {
    const updated = [...helpWords, word];
    setHelpWords(updated);
    localStorage.setItem('helpWords', JSON.stringify(updated));
  };

  const clearHelpWords = () => {
    setHelpWords([]);
    localStorage.setItem('helpWords', '[]');
  };

  const currentTheme = THEMES[theme];
  const styles = {
    app: {
      minHeight: '100vh',
      background: currentTheme.background,
      color: currentTheme.text,
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    },
    header: {
      textAlign: 'center',
      marginBottom: '30px'
    },
    button: {
      background: currentTheme.button,
      color: '#fff',
      border: 'none',
      padding: '12px 24px',
      margin: '8px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '16px',
      transition: 'transform 0.2s',
      ':hover': { transform: 'scale(1.05)' }
    },
    card: {
      background: currentTheme.card,
      padding: '40px',
      borderRadius: '16px',
      boxShadow: `0 4px 20px ${currentTheme.accent}33`,
      maxWidth: '600px',
      margin: '0 auto',
      textAlign: 'center'
    },
    topicButton: {
      background: currentTheme.accent,
      color: '#fff',
      border: 'none',
      padding: '16px 32px',
      margin: '10px',
      borderRadius: '12px',
      cursor: 'pointer',
      fontSize: '18px',
      fontWeight: 'bold',
      transition: 'all 0.3s'
    }
  };

  return (
    <div style={styles.app}>
      <div style={styles.header}>
        <h1 style={{ fontSize: '48px', margin: '0', color: currentTheme.accent }}>French Flashcards</h1>
        <div style={{ marginTop: '20px' }}>
          <button style={styles.button} onClick={() => setMode('select')}>Home</button>
          <button style={styles.button} onClick={() => setMode('help')}>Help Section ({helpWords.length})</button>
          <select style={{ ...styles.button, cursor: 'pointer' }} value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value="redBlack">Red & Black</option>
            <option value="cyberpunk">Cyberpunk</option>
            <option value="ocean">Ocean</option>
          </select>
        </div>
      </div>

      {mode === 'select' && (
        <div style={styles.card}>
          <h2>Select Difficulty</h2>
          <div>
            {['beginner', 'intermediate', 'advanced'].map(d => (
              <button
                key={d}
                style={{ ...styles.button, opacity: difficulty === d ? 1 : 0.6 }}
                onClick={() => setDifficulty(d)}
              >
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </button>
            ))}
          </div>
          <h2 style={{ marginTop: '40px' }}>Choose a Topic</h2>
          <div>
            {['adjectives', 'verbs', 'nouns'].map(t => (
              <button key={t} style={styles.topicButton} onClick={() => startFlashcards(t)}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {mode === 'flashcards' && (
        <div style={styles.card}>
          {currentIndex < words.length ? (
            <>
              <h2 style={{ fontSize: '64px', margin: '40px 0', color: currentTheme.accent }}>
                {words[currentIndex].fr}
              </h2>
              {showAnswer && (
                <p style={{ fontSize: '32px', marginTop: '20px' }}>
                  {words[currentIndex].en}
                </p>
              )}
              <div style={{ marginTop: '40px' }}>
                {!showAnswer ? (
                  <button style={styles.button} onClick={() => setShowAnswer(true)}>Show Answer</button>
                ) : (
                  <>
                    <button style={styles.button} onClick={() => { setCurrentIndex(currentIndex + 1); setShowAnswer(false); }}>
                      I Know This ✓
                    </button>
                    <button style={styles.button} onClick={() => { addHelpWord(words[currentIndex]); setCurrentIndex(currentIndex + 1); setShowAnswer(false); }}>
                      Need Help ?
                    </button>
                  </>
                )}
              </div>
              <p style={{ marginTop: '30px', opacity: 0.7 }}>Card {currentIndex + 1} of {words.length}</p>
            </>
          ) : (
            <>
              <h2>Session Complete! 🎉</h2>
              <p>You reviewed {words.length} words</p>
              <button style={styles.button} onClick={() => setMode('select')}>Back to Home</button>
            </>
          )}
        </div>
      )}

      {mode === 'help' && (
        <div style={styles.card}>
          <h2>Words Needing Help</h2>
          {helpWords.length === 0 ? (
            <p>No words yet! You're doing great! 🌟</p>
          ) : (
            <>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {helpWords.map((w, i) => (
                  <li key={i} style={{ padding: '12px', margin: '8px 0', background: currentTheme.background, borderRadius: '8px' }}>
                    <strong style={{ color: currentTheme.accent }}>{w.fr}</strong> — {w.en}
                  </li>
                ))}
              </ul>
              <button style={styles.button} onClick={clearHelpWords}>Clear All</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
