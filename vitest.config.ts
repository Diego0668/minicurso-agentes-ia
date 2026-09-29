import { defineConfig } from 'vitest/config'

// `npm test`: testes unitários (regras de domínio) e da API.
export default defineConfig({
  test: {
    include: ['src/**/*.test.ts', 'server/**/*.test.ts'],
    environment: 'node',
  },
})
