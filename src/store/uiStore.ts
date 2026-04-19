import { create } from 'zustand';

type ModalType = 'upload' | 'createPlaylist' | 'editProfile' | 'deleteAccount' | null;

interface UIState {
  sidebarOpen: boolean;
  activeModal: ModalType;
  theme: 'light' | 'dark';
  toggleSidebar: () => void;
  openModal: (modal: ModalType) => void;
  closeModal: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  activeModal: null,
  theme: 'dark',

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  openModal: (modal) => set({ activeModal: modal }),

  closeModal: () => set({ activeModal: null }),

  setTheme: (theme) => set({ theme }),
}));
