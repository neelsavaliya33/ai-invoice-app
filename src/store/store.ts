import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";

type ThemeMode = "system" | "light" | "dark";
type Language = "en" | "gu";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    theme: "system" as ThemeMode,
    language: "en" as Language,
    aiOpen: false,
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
    setActiveIndustry(state, action: PayloadAction<string>) {
      state.activeIndustry = action.payload;
    },
  },
});

export const { setAiOpen, setTheme, setLanguage, setActiveIndustry } = uiSlice.actions;

export const store = configureStore({
  reducer: {
    ui: uiSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
