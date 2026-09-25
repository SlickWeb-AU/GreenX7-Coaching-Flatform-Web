import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';

/**
 * DESIGN TOKENS
 * -------------
 * Toàn bộ màu khai báo bằng CSS variable (xem src/app/globals.css) thay vì hex cứng.
 * Khi lấy token từ Figma: chỉ cần sửa giá trị HSL trong globals.css,
 * KHÔNG phải đụng vào file này và cũng không phải sửa từng component.
 *
 * Cách lấy giá trị: Figma → chọn màu → copy HEX → convert sang HSL → điền dạng "142 72% 29%"
 * (không có dấu ngoặc và không có chữ hsl()).
 */
const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1rem', sm: '1.5rem', lg: '2rem' },
      screens: { '2xl': '1400px' },
    },
    extend: {
      colors: {
        secondary: {
          green: {
            1: '#9ACC63',
            2: '#E6F2D8',
            4: '#087452',
          },
          yellow: {
            1: '#EBD343',
            2: '#FAF4D0',
            3: '#9E892E',
          },
          orange: {
            1: '#F09E5D',
            2: '#FBE7D7',
          },
          cyan: {
            1: '#5FC8C9',
            2: '#D7F1F2',
            3: '#418382',
          },
          violet: {
            1: '#AC8ED4',
            2: '#EBE4F5',
          },
          rose: {
            1: '#EE8F9F',
            2: '#FCDADD',
          },
          red: {
            1: '#F56C77',
            2: '#FBE3E7',
            4: '#B43E47',
          },
          teal: {
            1: '#83ADB9',
            2: '#E1EBEE',
          },
        },
        neutral: {
          white: {
            solid: '#FFFFFF',
          },
          grey: {
            1: '#12211C',
            2: '#53635C',
            3: '#6A7A72',
            4: '#BFCFC5',
            5: '#CBD1CD',
            6: '#DFE5E1',
            7: '#EDF3EF',
            8: '#F6F8F5',
          },
        },
        brand: {
          green: {
            2: '#005943',
          },
        },
      },
      borderWidth: {
        '0.5': '0.5px',
      },
      fontFamily: {
        satoshi: ['var(--font-satoshi)', 'sans-serif'],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        'slide-up': 'slide-up 0.25s ease-out',
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
