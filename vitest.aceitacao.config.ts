import { defineConfig } from 'vitest/config'

// `npm run test:aceitacao`: testes de aceitação (pasta tests/aceitacao/),
// derivados dos critérios CA-xx da especificação e independentes dos testes escritos pelo agente.
export default defineConfig({
  test: {
    include: ['tests/aceitacao/**/*.test.ts'],
    environment: 'node',
    passWithNoTests: true,
  },
})
