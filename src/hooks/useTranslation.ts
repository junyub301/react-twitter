import { languagesState } from "atom";
import TRANSLATIONS from "constants/language";
import { useRecoilValue } from "recoil";

export default function useTranslation() {
    const lang = useRecoilValue(languagesState);
    return (key: keyof typeof TRANSLATIONS) => {
        return TRANSLATIONS[key][lang];
    };
}
