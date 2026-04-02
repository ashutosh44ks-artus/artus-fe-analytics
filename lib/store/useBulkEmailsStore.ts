import { create } from 'zustand';

export interface Conditional {
  metric: string;
  operator: '=' | '!=' | '>' | '>=' | '<' | '<=';
  value: string | number | string[];
}

export interface UserFilters {
  filter_by_last_logged_in: 'all' | 'last_24_hours' | 'last_7_days' | 'last_30_days';
  credits_status: 'all' | 'ran_out_of_credits' | 'credits_expired';
  visited_payments_plan: 'all' | 'yes' | 'no';
  filter_by_job_title: string;
  filter_by_heard_from: string;
}

interface BulkEmailsState {
  // User filters
  userFilters: UserFilters;
  setUserFilter: <K extends keyof UserFilters>(key: K, value: UserFilters[K]) => void;

  // Dynamic filters (conditionals)
  dynamicFilters: Conditional[];
  addDynamicFilter: (conditional: Conditional) => void;
  removeDynamicFilter: (index: number) => void;
  updateDynamicFilter: (index: number, conditional: Conditional) => void;

  // Email template selection
  selectedTemplate: string | null;
  setSelectedTemplate: (templateId: string | null) => void;

  // Reset all state
  reset: () => void;
}

const initialUserFilters: UserFilters = {
  filter_by_last_logged_in: 'all',
  credits_status: 'all',
  visited_payments_plan: 'all',
  filter_by_job_title: 'all',
  filter_by_heard_from: 'all',
};

export const useBulkEmailsStore = create<BulkEmailsState>((set) => ({
  userFilters: initialUserFilters,
  setUserFilter: (key, value) =>
    set((state) => ({
      userFilters: {
        ...state.userFilters,
        [key]: value,
      },
    })),

  dynamicFilters: [],
  addDynamicFilter: (conditional) =>
    set((state) => ({
      dynamicFilters: [...state.dynamicFilters, conditional],
    })),
  removeDynamicFilter: (index) =>
    set((state) => ({
      dynamicFilters: state.dynamicFilters.filter((_, i) => i !== index),
    })),
  updateDynamicFilter: (index, conditional) =>
    set((state) => {
      const newFilters = [...state.dynamicFilters];
      newFilters[index] = conditional;
      return { dynamicFilters: newFilters };
    }),

  selectedTemplate: null,
  setSelectedTemplate: (templateId) => set({ selectedTemplate: templateId }),

  reset: () =>
    set({
      userFilters: initialUserFilters,
      dynamicFilters: [],
      selectedTemplate: null,
    }),
}));
