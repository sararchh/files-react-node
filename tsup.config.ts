import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['src/**/*.ts'],
    outDir: 'dist',
    clean: true,
    loader: {
        '.ejs': 'text',
    },
})
