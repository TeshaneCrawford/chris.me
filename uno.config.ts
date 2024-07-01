import {
  type CSSObject,
  type RuleContext,
  defineConfig,
  transformerCompileClass,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'
import { presetUseful } from 'unocss-preset-useful'
import { parseColor } from '@unocss/preset-mini/utils'
import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'

const typographyCssExtend: Record<string, CSSObject> = {
  'a': {
    'display': 'inline-block',
    'line-height': '1.5',
    'border-bottom': '1px dashed rgba(var(--c-context), 0.5)',
    'text-decoration': 'none',
    'transition': 'all 0.3s ease-in-out',
  },
  'a:hover': {
    'border-bottom': '1px solid rgba(var(--c-context), 1)',
  },
  'pre': {
    'background': '#eee !important',
    'font-family': 'dm',
  },
  '.dark pre': {
    background: '#222 !important',
  },
  'blockquote': {
    'border-left': '0.1em solid rgba(168,85,247,.4)',
  },
}

export default defineConfig({
  rules: [
    [/^o-(.*)$/, ([, body]: string[], { theme }: RuleContext) => {
      const color = parseColor(body, theme)
      if (color?.cssColor?.type === 'rgb' && color.cssColor.components) {
        return {
          '--c-context': `${color.cssColor.components.join(',')}`,
        }
      }
      else {
        return {
          '--c-context': color?.color,
        }
      }
    }],
    // eslint-disable-next-line regexp/no-super-linear-backtracking
    [/^(.+?)::(.+)$/, ([, n, v], { theme }) => {
      const color = parseColor(v, theme)
      if (color?.cssColor?.type === 'rgb' && color.cssColor.components) {
        return {
          [`--${n}`]: `${color.cssColor.components.join(',')}`,
        }
      }
      return {
        [`--${n}`]: v,
      }
    }],
  ],
  shortcuts: [
    ['text', 'text-primary-text'],
    ['bg', 'bg-primary-bg'],

    ['linear-text', 'text-transparent bg-clip-text bg-gradient-to-r'],
    ['text-p-r', 'linear-text from-purple to-red'], // test case

    ['icon', 'w-5.5 h-5.5 cursor-pointer select-none transition-opacity-300 ease-in-out text'],
    ['icon-btn', 'icon color-inherit op64 hover-op100 hover-color-teal-500 dark-hover-color-inherit'],
    ['icon-link', 'icon color-inherit op64 hover:op100 hover-text-red-300 dark-hover-color-inherit'],
    ['icon-text', 'color-inherit op64 hover:op100 hover-text-purple dark-hover-color-inherit'],
    ['linkWithIcon', 'trans c-context'],

    ['header-anchor', 'float-left mt-[0.125em] ml-[-0.8em] pr-[0.2em] text-[0.85em] op-0 group-hover-op-60 fw-600'],
  ],
  theme: {
    fontFamily: {
      dank: 'dank',
    },
    colors: {
      context: 'rgba(var(--c-context),%alpha)',
      primary: {
        DEFAULT: 'rgba(var(--c-text),%alpha)',
        text: 'rgba(var(--c-text),%alpha)',
        bg: 'rgba(var(--c-bg),%alpha)',
      },
      level: {
        0: 'var(--gc-level-0)',
        1: 'var(--gc-level-1)',
        2: 'var(--gc-level-2)',
        3: 'var(--gc-level-3)',
        4: 'var(--gc-level-4)',
      },
      unocss: {
        DEFAULT: '#818181',
        from: '#ccc',
        via: '#858585',
        to: '#4d4d4d',
      },
      elk: '#c18139',
      onuui: {
        from: '#acc1ee',
        to: '#c084fc',
      },
      unpreset: {
        from: '#ff5c5c',
        to: '#dbe74f',
      },
      vite: {
        from: '#41d1ff',
        to: '#bd34fe',
      },
      vue: '#64b687',
      nuxt: '#64d98a',
      bilibili: '#ed7099',
    },
  },
  presets: [
    presetUseful({
      theme: {
        extend: {
          animation: {
            shape: 'shape 5s linear infinite',
          },
          keyframes: {
            shape: {
              '0%,100%': {
                'border-radius': '42% 58% 70% 30% / 45% 45% 55% 55%',
                'transform': 'translate3d(0,0,0) rotateZ(0.01deg)',
              },
              '34%': {
                'border-radius': '70% 30% 46% 54% / 30% 29% 71% 70%',
                'transform': 'translate3d(0,5px,0) rotateZ(0.01deg)',
              },
              '50%': {
                transform: 'translate3d(0,0,0) rotateZ(0.01deg)',
              },
              '67%': {
                'border-radius': '100% 60% 60% 100% / 100% 100% 60% 60%',
                'transform': 'translate3d(0,-3px,0) rotateZ(0.01deg)',
              },
            },
          },
        },
      },
      icons: {
        extraProperties: {
          'display': 'inline-block',
          'height': '1.2em',
          'width': '1.2em',
          'vertical-align': 'text-bottom',
        },
        collections: {
          'my-logos': FileSystemIconLoader('./public/logos'),
        },
      },
      typography: { cssExtend: typographyCssExtend },
      webFonts: {
        fonts: {
          dm: ['DM Sans', 'DM Sans:400,700'],
        },
      },
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
    transformerCompileClass(),
  ],
  safelist: [
    Array.from({ length: 5 }, (j, i) => `fill-level-${i}`),
    'sm-fsc max-w-75'.split(' '),
  ].flat(),
})
