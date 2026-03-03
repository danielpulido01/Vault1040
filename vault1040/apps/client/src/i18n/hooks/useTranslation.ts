import { useLanguageStore } from '../store/languageStore';
import { translations } from '../translations';

export function useTranslation() {
  const { language, setLanguage } = useLanguageStore();
  const t = translations[language];

  return {
    t,
    language,
    setLanguage,
  };
}
