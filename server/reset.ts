import { rmSync } from 'node:fs'
import path from 'node:path'

// Apaga o banco local; na próxima vez que a API subir, ele é recriado com os dados de demonstração.
const pasta = path.resolve(import.meta.dirname, '..', 'dados')
rmSync(pasta, { recursive: true, force: true })
console.log('Banco apagado. Rode "npm run dev" para recriá-lo com os dados de demonstração.')
