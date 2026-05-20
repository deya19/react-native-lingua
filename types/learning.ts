export type LanguageCode = "en" | "es" | "fr" | "de" | "ja";

export interface Language {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  color: string;
  learners: string;
  greeting: string;
}

export type ActivityType =
  | "multiple_choice"
  | "translation"
  | "listen_select"
  | "speak"
  | "fill_blank"
  | "match_pairs";

export interface Activity {
  id: string;
  type: ActivityType;
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  hint?: string;
  audioUrl?: string;
}

export interface VocabularyItem {
  id: string;
  word: string;
  translation: string;
  pronunciation?: string;
  exampleSentence?: string;
  imageUrl?: string;
}

export interface Phrase {
  id: string;
  text: string;
  translation: string;
  context?: string;
}

export interface LessonGoal {
  id: string;
  description: string;
}

export interface AITeacherPrompt {
  lessonId: string;
  introScript: string;
  explanationScript: string;
  practiceScript: string;
  closingScript: string;
  voiceId?: string;
}

export interface Lesson {
  id: string;
  unitId: string;
  languageCode: LanguageCode;
  title: string;
  description: string;
  order: number;
  xpReward: number;
  goals: LessonGoal[];
  activities: Activity[];
  vocabulary: VocabularyItem[];
  phrases: Phrase[];
  aiTeacherPrompt?: AITeacherPrompt;
}

export interface Unit {
  id: string;
  languageCode: LanguageCode;
  title: string;
  description: string;
  order: number;
  color: string;
  lessons: Lesson[];
}
