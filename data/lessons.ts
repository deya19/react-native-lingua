import type { Lesson } from "@/types/learning";

export const lessons: Lesson[] = [
  // English — Unit 1: Basics 1
  {
    id: "lesson-en-1-1",
    unitId: "unit-en-1",
    languageCode: "en",
    title: "Hello!",
    description: "Learn to say hello and introduce yourself.",
    order: 1,
    xpReward: 15,
    goals: [
      { id: "g-en-1-1-1", description: "Recognize common English greetings" },
      { id: "g-en-1-1-2", description: "Say hello and goodbye" },
    ],
    activities: [
      {
        id: "a-en-1-1-1",
        type: "multiple_choice",
        question: "Which word means hello?",
        options: ["Goodbye", "Hello", "Thank you", "Sorry"],
        correctAnswer: "Hello",
      },
      {
        id: "a-en-1-1-2",
        type: "translation",
        question: "Translate: Hello",
        correctAnswer: "Hello",
      },
      {
        id: "a-en-1-1-3",
        type: "multiple_choice",
        question: "What do you say when you leave?",
        options: ["Hello", "Good morning", "Goodbye", "Please"],
        correctAnswer: "Goodbye",
      },
    ],
    vocabulary: [
      {
        id: "v-en-1-1-1",
        word: "Hello",
        translation: "Hello",
        pronunciation: "/həˈloʊ/",
        exampleSentence: "Hello, how are you?",
      },
      {
        id: "v-en-1-1-2",
        word: "Goodbye",
        translation: "Goodbye",
        pronunciation: "/ˌɡʊdˈbaɪ/",
        exampleSentence: "Goodbye, see you tomorrow!",
      },
    ],
    phrases: [
      {
        id: "p-en-1-1-1",
        text: "Hello, nice to meet you.",
        translation: "Hello, nice to meet you.",
        context: "Greeting someone for the first time",
      },
      {
        id: "p-en-1-1-2",
        text: "Goodbye, have a great day!",
        translation: "Goodbye, have a great day!",
        context: "Saying farewell to a friend",
      },
    ],
    aiTeacherPrompt: {
      lessonId: "lesson-en-1-1",
      introScript:
        "Welcome to your first English lesson! Today we will learn how to greet people. Listen and repeat after me.",
      explanationScript:
        "'Hello' is the most common greeting in English. You can use it at any time of day. 'Goodbye' is what we say when we leave.",
      practiceScript:
        "Now it's your turn. Say 'Hello' loudly and clearly. Then try 'Goodbye'.",
      closingScript:
        "Great job! You just learned your first English words. Practice them every day.",
    },
  },

  // English — Unit 1: Basics 1
  {
    id: "lesson-en-1-2",
    unitId: "unit-en-1",
    languageCode: "en",
    title: "What's your name?",
    description: "Learn to ask and answer about names.",
    order: 2,
    xpReward: 20,
    goals: [
      { id: "g-en-1-2-1", description: "Ask someone their name" },
      { id: "g-en-1-2-2", description: "Answer with your own name" },
    ],
    activities: [
      {
        id: "a-en-1-2-1",
        type: "fill_blank",
        question: "___ your name?",
        options: ["What is", "How are", "Where is", "Who is"],
        correctAnswer: "What is",
      },
      {
        id: "a-en-1-2-2",
        type: "translation",
        question: "My name is...",
        correctAnswer: "My name is",
      },
      {
        id: "a-en-1-2-3",
        type: "multiple_choice",
        question: "How do you ask someone's name?",
        options: [
          "How old are you?",
          "What is your name?",
          "Where are you from?",
        ],
        correctAnswer: "What is your name?",
      },
    ],
    vocabulary: [
      {
        id: "v-en-1-2-1",
        word: "name",
        translation: "name",
        pronunciation: "/neɪm/",
        exampleSentence: "What is your name?",
      },
      {
        id: "v-en-1-2-2",
        word: "my",
        translation: "my",
        pronunciation: "/maɪ/",
        exampleSentence: "My name is Sam.",
      },
    ],
    phrases: [
      {
        id: "p-en-1-2-1",
        text: "What is your name?",
        translation: "What is your name?",
        context: "Meeting someone new",
      },
      {
        id: "p-en-1-2-2",
        text: "My name is Alex.",
        translation: "My name is Alex.",
        context: "Replying when asked your name",
      },
    ],
  },

  // Spanish — Unit 1: Saludos
  {
    id: "lesson-es-1-1",
    unitId: "unit-es-1",
    languageCode: "es",
    title: "¡Hola!",
    description: "Learn Spanish greetings and basic phrases.",
    order: 1,
    xpReward: 15,
    goals: [
      { id: "g-es-1-1-1", description: "Recognize Spanish greetings" },
      { id: "g-es-1-1-2", description: "Say hello and goodbye in Spanish" },
    ],
    activities: [
      {
        id: "a-es-1-1-1",
        type: "multiple_choice",
        question: "What does 'Hola' mean?",
        options: ["Goodbye", "Hello", "Thank you", "Please"],
        correctAnswer: "Hello",
      },
      {
        id: "a-es-1-1-2",
        type: "translation",
        question: "Translate: Goodbye (Spanish)",
        options: ["Hola", "Adiós", "Gracias", "Por favor"],
        correctAnswer: "Adiós",
      },
      {
        id: "a-es-1-1-3",
        type: "multiple_choice",
        question: "Which phrase means 'Good morning'?",
        options: ["Buenas noches", "Buenos días", "Buenas tardes", "Hola"],
        correctAnswer: "Buenos días",
      },
    ],
    vocabulary: [
      {
        id: "v-es-1-1-1",
        word: "Hola",
        translation: "Hello",
        pronunciation: "/ˈo.la/",
        exampleSentence: "Hola, ¿cómo estás?",
      },
      {
        id: "v-es-1-1-2",
        word: "Adiós",
        translation: "Goodbye",
        pronunciation: "/aˈðjos/",
        exampleSentence: "Adiós, hasta mañana.",
      },
      {
        id: "v-es-1-1-3",
        word: "Buenos días",
        translation: "Good morning",
        pronunciation: "/ˈbwe.nos ˈði.as/",
        exampleSentence: "Buenos días, señor.",
      },
    ],
    phrases: [
      {
        id: "p-es-1-1-1",
        text: "Hola, ¿cómo estás?",
        translation: "Hello, how are you?",
        context: "Casual greeting",
      },
      {
        id: "p-es-1-1-2",
        text: "Adiós, que tengas un buen día.",
        translation: "Goodbye, have a good day.",
        context: "Polite farewell",
      },
    ],
    aiTeacherPrompt: {
      lessonId: "lesson-es-1-1",
      introScript:
        "¡Bienvenido a tu primera lección de español! Hoy aprenderemos a saludar. Escucha y repite después de mí.",
      explanationScript:
        "'Hola' es el saludo más común en español. 'Adiós' se dice al despedirse. 'Buenos días' se usa por la mañana.",
      practiceScript:
        "Ahora te toca a ti. Di 'Hola' en voz alta. Luego prueba 'Adiós'.",
      closingScript:
        "¡Excelente trabajo! Acabas de aprender tus primeras palabras en español. Practícalas todos los días.",
    },
  },

  // French — Unit 1: Bonjour
  {
    id: "lesson-fr-1-1",
    unitId: "unit-fr-1",
    languageCode: "fr",
    title: "Bonjour",
    description: "Learn French greetings and polite expressions.",
    order: 1,
    xpReward: 15,
    goals: [
      { id: "g-fr-1-1-1", description: "Recognize French greetings" },
      { id: "g-fr-1-1-2", description: "Say hello and goodbye in French" },
    ],
    activities: [
      {
        id: "a-fr-1-1-1",
        type: "multiple_choice",
        question: "What does 'Bonjour' mean?",
        options: ["Goodbye", "Hello / Good day", "Thank you", "Please"],
        correctAnswer: "Hello / Good day",
      },
      {
        id: "a-fr-1-1-2",
        type: "translation",
        question: "Translate: Goodbye (French)",
        options: ["Bonjour", "Au revoir", "Merci", "S'il vous plaît"],
        correctAnswer: "Au revoir",
      },
      {
        id: "a-fr-1-1-3",
        type: "match_pairs",
        question: "Match the greeting to the time of day",
        options: ["Bonjour", "Bonsoir", "Bonne nuit"],
        correctAnswer: ["Morning", "Evening", "Night"],
      },
    ],
    vocabulary: [
      {
        id: "v-fr-1-1-1",
        word: "Bonjour",
        translation: "Hello / Good day",
        pronunciation: "/bɔ̃.ʒuʁ/",
        exampleSentence: "Bonjour, Madame.",
      },
      {
        id: "v-fr-1-1-2",
        word: "Au revoir",
        translation: "Goodbye",
        pronunciation: "/o ʁə.vwaʁ/",
        exampleSentence: "Au revoir et à bientôt.",
      },
      {
        id: "v-fr-1-1-3",
        word: "Merci",
        translation: "Thank you",
        pronunciation: "/mɛʁ.si/",
        exampleSentence: "Merci beaucoup!",
      },
    ],
    phrases: [
      {
        id: "p-fr-1-1-1",
        text: "Bonjour, enchanté(e).",
        translation: "Hello, nice to meet you.",
        context: "Formal introduction",
      },
      {
        id: "p-fr-1-1-2",
        text: "Au revoir, à demain!",
        translation: "Goodbye, see you tomorrow!",
        context: "Saying goodbye to a friend",
      },
    ],
    aiTeacherPrompt: {
      lessonId: "lesson-fr-1-1",
      introScript:
        "Bienvenue à votre première leçon de français! Aujourd'hui, nous allons apprendre à saluer. Écoutez et répétez après moi.",
      explanationScript:
        "'Bonjour' est le salutation le plus courant en français. 'Au revoir' se dit en partant. 'Merci' signifie 'thank you'.",
      practiceScript:
        "Maintenant, c'est à vous. Dites 'Bonjour' à haute voix. Essayez aussi 'Au revoir'.",
      closingScript:
        "Très bien! Vous venez d'apprendre vos premiers mots en français. Pratiquez-les chaque jour.",
    },
  },

  // German — Unit 1: Hallo
  {
    id: "lesson-de-1-1",
    unitId: "unit-de-1",
    languageCode: "de",
    title: "Hallo",
    description: "Learn German greetings and polite words.",
    order: 1,
    xpReward: 15,
    goals: [
      { id: "g-de-1-1-1", description: "Recognize German greetings" },
      { id: "g-de-1-1-2", description: "Say hello and goodbye in German" },
    ],
    activities: [
      {
        id: "a-de-1-1-1",
        type: "multiple_choice",
        question: "What does 'Hallo' mean?",
        options: ["Goodbye", "Hello", "Thank you", "Please"],
        correctAnswer: "Hello",
      },
      {
        id: "a-de-1-1-2",
        type: "translation",
        question: "Translate: Goodbye (German)",
        options: ["Hallo", "Tschüss", "Danke", "Bitte"],
        correctAnswer: "Tschüss",
      },
      {
        id: "a-de-1-1-3",
        type: "multiple_choice",
        question: "How do you say 'Good morning' in German?",
        options: ["Guten Abend", "Guten Morgen", "Gute Nacht", "Hallo"],
        correctAnswer: "Guten Morgen",
      },
    ],
    vocabulary: [
      {
        id: "v-de-1-1-1",
        word: "Hallo",
        translation: "Hello",
        pronunciation: "/ˈha.lo/",
        exampleSentence: "Hallo, wie geht's?",
      },
      {
        id: "v-de-1-1-2",
        word: "Tschüss",
        translation: "Goodbye",
        pronunciation: "/tʃʏs/",
        exampleSentence: "Tschüss, bis bald!",
      },
      {
        id: "v-de-1-1-3",
        word: "Danke",
        translation: "Thank you",
        pronunciation: "/ˈdaŋ.kə/",
        exampleSentence: "Danke schön!",
      },
    ],
    phrases: [
      {
        id: "p-de-1-1-1",
        text: "Hallo, wie geht es dir?",
        translation: "Hello, how are you?",
        context: "Casual greeting to a friend",
      },
      {
        id: "p-de-1-1-2",
        text: "Tschüss, bis morgen!",
        translation: "Goodbye, see you tomorrow!",
        context: "Saying goodbye to a classmate",
      },
    ],
    aiTeacherPrompt: {
      lessonId: "lesson-de-1-1",
      introScript:
        "Willkommen zu deiner ersten Deutschstunde! Heute lernen wir, wie man sich begrüßt. Hör zu und wiederhole nach mir.",
      explanationScript:
        "'Hallo' ist die häufigste Begrüßung auf Deutsch. 'Tschüss' sagt man beim Abschied. 'Danke' bedeutet 'thank you'.",
      practiceScript:
        "Jetzt bist du dran. Sag 'Hallo' laut und deutlich. Versuche dann 'Tschüss'.",
      closingScript:
        "Sehr gut! Du hast gerade deine ersten deutschen Wörter gelernt. Übe sie jeden Tag.",
    },
  },

  // Japanese — Unit 1: Konnichiwa
  {
    id: "lesson-ja-1-1",
    unitId: "unit-ja-1",
    languageCode: "ja",
    title: "こんにちは",
    description: "Learn Japanese greetings and hiragana basics.",
    order: 1,
    xpReward: 15,
    goals: [
      { id: "g-ja-1-1-1", description: "Recognize common Japanese greetings" },
      { id: "g-ja-1-1-2", description: "Say hello and goodbye in Japanese" },
    ],
    activities: [
      {
        id: "a-ja-1-1-1",
        type: "multiple_choice",
        question: "What does 'こんにちは' mean?",
        options: ["Goodbye", "Hello", "Thank you", "Please"],
        correctAnswer: "Hello",
      },
      {
        id: "a-ja-1-1-2",
        type: "translation",
        question: "Translate: さようなら",
        options: ["Hello", "Goodbye", "Thank you", "Please"],
        correctAnswer: "Goodbye",
      },
      {
        id: "a-ja-1-1-3",
        type: "multiple_choice",
        question: "Which greeting is used in the morning?",
        options: ["こんばんは", "こんにちは", "おはよう", "さようなら"],
        correctAnswer: "おはよう",
      },
    ],
    vocabulary: [
      {
        id: "v-ja-1-1-1",
        word: "こんにちは",
        translation: "Hello / Good afternoon",
        pronunciation: "/kon.ni.chi.wa/",
        exampleSentence: "こんにちは、たなかさん。",
      },
      {
        id: "v-ja-1-1-2",
        word: "さようなら",
        translation: "Goodbye",
        pronunciation: "/sa.you.na.ra/",
        exampleSentence: "さようなら、またね。",
      },
      {
        id: "v-ja-1-1-3",
        word: "ありがとう",
        translation: "Thank you",
        pronunciation: "/a.ri.ga.tou/",
        exampleSentence: "ありがとうございます。",
      },
    ],
    phrases: [
      {
        id: "p-ja-1-1-1",
        text: "こんにちは、はじめまして。",
        translation: "Hello, nice to meet you.",
        context: "First time meeting someone",
      },
      {
        id: "p-ja-1-1-2",
        text: "さようなら、またあした。",
        translation: "Goodbye, see you tomorrow.",
        context: "Saying goodbye to a friend",
      },
    ],
    aiTeacherPrompt: {
      lessonId: "lesson-ja-1-1",
      introScript:
        "日本語の最初のレッスンへようこそ！今日はあいさつを学びます。聞いて、私の後に繰り返してください。",
      explanationScript:
        "「こんにちは」は日本語で最も一般的なあいさつです。「さようなら」は別れる時に言います。「ありがとう」は「thank you」です。",
      practiceScript:
        "では、あなたの番です。「こんにちは」を大きな声で言ってください。次に「さようなら」を試してみてください。",
      closingScript:
        "よくできました！あなたは今、最初の日本語の単語を学びました。毎日練習してください。",
    },
  },
];
