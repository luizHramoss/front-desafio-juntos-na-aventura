"use client";

import { create } from "zustand";

type State = {
  groupSizeByToken: Record<string, number | undefined>;
  increment: (token: string, max: number) => void;
  setFromServer: (token: string, value: number) => void;
};

export const useGroupStore = create<State>((set, get) => ({
  groupSizeByToken: {},
  increment: (token, max) => {
    const current = get().groupSizeByToken[token];
    const next = Math.min(max, (current ?? 0) + 1);
    set((s) => ({ groupSizeByToken: { ...s.groupSizeByToken, [token]: next } }));
  },
  setFromServer: (token, value) => {
    const existing = get().groupSizeByToken[token];
    if (typeof existing === "number") return;
    set((s) => ({ groupSizeByToken: { ...s.groupSizeByToken, [token]: value } }));
  },
}));

