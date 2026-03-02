import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Language, Translations } from '../types';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'en',
      setLanguage: (language) => {
        document.documentElement.lang = language;
        set({ language });
      },
    }),
    {
      name: 'language-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          document.documentElement.lang = state.language;
        }
      },
    }
  )
);
