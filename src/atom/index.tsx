import { atom } from "recoil";

type LanguageType = "ko" | "en";

export const languagesState = atom<LanguageType>({
    key: "language",
    default: (localStorage.getItem("language") as LanguageType) || "ko",
});
