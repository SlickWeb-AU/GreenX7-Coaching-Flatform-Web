'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * UI state thuần tuý (không phải dữ liệu từ server).
 * Dữ liệu server nằm ở TanStack Query — đừng nhét vào đây, sẽ sinh ra hai nguồn sự thật.
 */
interface UiState {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),

      mobileSidebarOpen: false,
      setMobileSidebarOpen: (mobileSidebarOpen) => set({ mobileSidebarOpen }),
    }),
    {
      name: 'gx7-ui',
      // Chỉ lưu trạng thái đáng nhớ giữa các phiên; menu mobile luôn khởi đầu ở trạng thái đóng
      partialize: (state) => ({ sidebarCollapsed: state.sidebarCollapsed }),
    },
  ),
);
