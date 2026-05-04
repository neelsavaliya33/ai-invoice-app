import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";

type ThemeMode = "system" | "light" | "dark";
type Language = "en" | "gu" | "hi" | "mr";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    theme: "system" as ThemeMode,
    language: "en" as Language,
    aiOpen: false,
    aiCreditsUsed: 784,
    aiCreditLimit: 1200,
    activeIndustry: "Textile",
  },
  reducers: {
    setTheme(state, action: PayloadAction<ThemeMode>) {
      state.theme = action.payload;
    },
    setLanguage(state, action: PayloadAction<Language>) {
      state.language = action.payload;
    },
    setAiOpen(state, action: PayloadAction<boolean>) {
      state.aiOpen = action.payload;
    },
    consumeAiCredits(state, action: PayloadAction<number>) {
      state.aiCreditsUsed = Math.min(
        state.aiCreditLimit,
        state.aiCreditsUsed + action.payload,
      );
    },
    setAiCreditLimit(state, action: PayloadAction<number>) {
      state.aiCreditLimit = Math.max(action.payload, state.aiCreditsUsed);
    },
    setActiveIndustry(state, action: PayloadAction<string>) {
      state.activeIndustry = action.payload;
    },
  },
});

export const {
  setAiOpen,
  setTheme,
  setLanguage,
  setActiveIndustry,
  setAiCreditLimit,
  consumeAiCredits,
} = uiSlice.actions;

export const store = configureStore({
  reducer: {
    ui: uiSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
