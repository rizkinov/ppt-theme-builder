/**
 * Zustand store for PPT Theme Builder state management
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { TemplateConfig, ThemeColors, TextStyle, FontAsset } from './types';
import { defaultTemplateConfig, slideDimensions, defaultFontLibrary, defaultCustomColors, defaultTypography } from './defaults';

interface BuilderState {
  config: TemplateConfig;

  // Actions for theme colors
  updateThemeColor: (colorKey: keyof ThemeColors, value: string) => void;

  // Actions for fonts
  addFont: (font: FontAsset) => void;
  removeFont: (fontId: string) => void;

  // Actions for typography
  updateTextStyle: (styleKey: keyof TemplateConfig['typography'], updates: Partial<TextStyle>) => void;

  // Actions for slide size
  updateSlideSize: (size: TemplateConfig['slideSize']) => void;

  // Actions for guides
  addGuide: (orientation: 'horizontal' | 'vertical', position: number) => void;
  updateGuide: (id: string, position: number) => void;
  removeGuide: (id: string) => void;
  clearGuides: () => void;

  // Actions for layouts
  toggleLayout: (layoutId: string) => void;

  // Actions for template metadata
  updateTemplateName: (name: string) => void;

  // Reset to defaults
  resetConfig: () => void;

  // Load config (for import functionality later)
  loadConfig: (config: TemplateConfig) => void;
}

export const useBuilderStore = create<BuilderState>()(
  devtools(
    persist(
      (set) => ({
        config: {
          ...defaultTemplateConfig,
          id: crypto.randomUUID(),
        },

        updateThemeColor: (colorKey, value) =>
          set((state) => ({
            config: {
              ...state.config,
              theme: {
                ...state.config.theme,
                colors: {
                  ...state.config.theme.colors,
                  [colorKey]: value,
                },
              },
            },
          })),

        addFont: (font) =>
          set((state) => ({
            config: {
              ...state.config,
              fontLibrary: [...state.config.fontLibrary, font],
            },
          })),

        removeFont: (fontId) =>
          set((state) => ({
            config: {
              ...state.config,
              fontLibrary: state.config.fontLibrary.filter((f) => f.id !== fontId),
            },
          })),

        updateTextStyle: (styleKey, updates) =>
          set((state) => ({
            config: {
              ...state.config,
              typography: {
                ...state.config.typography,
                [styleKey]: {
                  ...state.config.typography[styleKey],
                  ...updates,
                },
              },
            },
          })),

        updateSlideSize: (size) =>
          set((state) => ({
            config: {
              ...state.config,
              slideSize: size,
              slideDimensions: slideDimensions[size],
            },
          })),

        addGuide: (orientation, position) =>
          set((state) => ({
            config: {
              ...state.config,
              guides: [
                ...state.config.guides,
                {
                  id: crypto.randomUUID(),
                  orientation,
                  position,
                },
              ],
            },
          })),

        updateGuide: (id, position) =>
          set((state) => ({
            config: {
              ...state.config,
              guides: state.config.guides.map((guide) =>
                guide.id === id ? { ...guide, position } : guide
              ),
            },
          })),

        removeGuide: (id) =>
          set((state) => ({
            config: {
              ...state.config,
              guides: state.config.guides.filter((guide) => guide.id !== id),
            },
          })),

        clearGuides: () =>
          set((state) => ({
            config: {
              ...state.config,
              guides: [],
            },
          })),

        toggleLayout: (layoutId) =>
          set((state) => {
            const isSelected = state.config.selectedLayouts.includes(layoutId);
            return {
              config: {
                ...state.config,
                selectedLayouts: isSelected
                  ? state.config.selectedLayouts.filter((id) => id !== layoutId)
                  : [...state.config.selectedLayouts, layoutId],
              },
            };
          }),

        updateTemplateName: (name) =>
          set((state) => ({
            config: {
              ...state.config,
              name,
            },
          })),

        resetConfig: () =>
          set(() => ({
            config: {
              ...defaultTemplateConfig,
              id: crypto.randomUUID(),
            },
          })),

        loadConfig: (config) =>
          set(() => ({
            config,
          })),
      }),
      {
        name: 'ppt-builder-storage',
        partialize: (state) => ({ config: state.config }),
        version: 3,
        migrate: (persistedState: unknown, version) => {
          const state = persistedState as BuilderState;

          if (version === undefined || version < 1) {
            // Migration v0 -> v1: Ensure fontLibrary is populated
            const currentLibrary = state.config?.fontLibrary || [];

            if (currentLibrary.length === 0) {
              state.config = {
                ...state.config,
                fontLibrary: defaultFontLibrary,
              };
            }
          }

          if (version === undefined || version < 2) {
            // Migration v1 -> v2: Ensure customColors is populated
            if (!state.config?.theme?.customColors) {
              state.config = {
                ...state.config,
                theme: {
                  ...state.config.theme,
                  customColors: defaultCustomColors,
                },
              };
            }
          }

          if (version === undefined || version < 3) {
            // Migration v2 -> v3: Ensure new 16-style typography system is populated
            // Check if the new styles exist, if not, populate from defaults
            if (!state.config?.typography?.slideTitle) {
              state.config = {
                ...state.config,
                typography: {
                  ...defaultTypography,
                  // Preserve any legacy custom styles the user may have set
                  heading: state.config?.typography?.heading || defaultTypography.heading,
                  subtitle: state.config?.typography?.subtitle || defaultTypography.subtitle,
                  bodyLarge: state.config?.typography?.bodyLarge || defaultTypography.bodyLarge,
                  bodySmall: state.config?.typography?.bodySmall || defaultTypography.bodySmall,
                  quote: state.config?.typography?.quote || defaultTypography.quote,
                  bullet: state.config?.typography?.bullet || defaultTypography.bullet,
                  link: state.config?.typography?.link || defaultTypography.link,
                },
              };
            }
          }

          return state;
        },
      }
    )
  )
);
