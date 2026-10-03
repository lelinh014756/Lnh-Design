import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import {
  APPEARANCE_STORAGE_KEY,
  applyAppearanceToDocument,
  DEFAULT_SIDEBAR_STYLE,
  isSidebarStyle,
  type SidebarStyle,
} from "@/config/appearance";

interface AppearanceState {
  sidebarStyle: SidebarStyle;
  setSidebarStyle: (style: SidebarStyle) => void;
}

/**
 * Nguồn sự thật cho kiểu nền sidebar.
 *
 * Ghi thuộc tính `data-*` ngay trong setter thay vì qua `useEffect` ở component:
 * hiệu ứng phải chạy đúng một lần cho mỗi lần đổi, không phụ thuộc component nào
 * đang mounted.
 */
export const useAppearanceStore = create<AppearanceState>()(
  persist(
    (set) => ({
      sidebarStyle: DEFAULT_SIDEBAR_STYLE,
      setSidebarStyle: (sidebarStyle) => {
        applyAppearanceToDocument(sidebarStyle);
        set({ sidebarStyle });
      },
    }),
    {
      name: APPEARANCE_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        const sidebarStyle = isSidebarStyle(state.sidebarStyle)
          ? state.sidebarStyle
          : DEFAULT_SIDEBAR_STYLE;
        if (sidebarStyle !== state.sidebarStyle) {
          useAppearanceStore.setState({ sidebarStyle });
        }
        applyAppearanceToDocument(sidebarStyle);
      },
    },
  ),
);
