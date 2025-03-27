import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      external: [
        'react-day-picker',
        '@radix-ui/react-popover',
        '@radix-ui/react-dialog',
        '@radix-ui/react-select',
        '@radix-ui/react-slot',
        '@radix-ui/react-toast',
        '@radix-ui/react-label',
        '@radix-ui/react-dropdown-menu',
        '@radix-ui/react-alert-dialog'
      ],
      output: {
        globals: {
          'react-day-picker': 'ReactDayPicker',
          '@radix-ui/react-popover': 'RadixPopover',
          '@radix-ui/react-dialog': 'RadixDialog',
          '@radix-ui/react-select': 'RadixSelect',
          '@radix-ui/react-slot': 'RadixSlot',
          '@radix-ui/react-toast': 'RadixToast',
          '@radix-ui/react-label': 'RadixLabel',
          '@radix-ui/react-dropdown-menu': 'RadixDropdownMenu',
          '@radix-ui/react-alert-dialog': 'RadixAlertDialog'
        }
      }
    }
  },
  server: {
    port: 3000,
    host: true,
  },
})
