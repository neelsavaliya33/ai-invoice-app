import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";

type ThemeMode = "system" | "light" | "dark";
type Language = "en" | "gu" | "hi" | "mr";
type AiPlan = "free" | "basic" | "professional" | "business";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    theme: "system" as ThemeMode,
    language: "en" as Language,
    aiOpen: false,
    aiCreditsUsed: 784,
    aiCreditLimit: 800,
    aiPlan: "professional" as AiPlan,
    activeIndustry: "Textile",
    activeCompanyId: "kavya-textiles",
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
    setAiPlan(state, action: PayloadAction<{ plan: AiPlan; limit: number; used?: number }>) {
      state.aiPlan = action.payload.plan;
      state.aiCreditLimit = action.payload.limit;
      if (typeof action.payload.used === "number") {
        state.aiCreditsUsed = Math.min(action.payload.used, action.payload.limit);
      } else {
        state.aiCreditsUsed = Math.min(state.aiCreditsUsed, action.payload.limit);
      }
    },
    setActiveIndustry(state, action: PayloadAction<string>) {
      state.activeIndustry = action.payload;
    },
    setActiveCompany(state, action: PayloadAction<string>) {
      state.activeCompanyId = action.payload;
    },
  },
});

export const {
  setAiOpen,
  setTheme,
  setLanguage,
  setActiveIndustry,
  setActiveCompany,
  setAiCreditLimit,
  setAiPlan,
  consumeAiCredits,
} = uiSlice.actions;

export const store = configureStore({
  reducer: {
    ui: uiSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
