// src/utils/logger.ts
// Utilitaire de logging conditionnel - N'affiche les logs qu'en développement

const isDev = import.meta.env.DEV

export const logger = {
  log: (...args: unknown[]) => {
    if (isDev) console.log(...args)
  },
  warn: (...args: unknown[]) => {
    if (isDev) console.warn(...args)
  },
  error: (...args: unknown[]) => {
    // Les erreurs sont toujours loggées
    console.error(...args)
  },
  info: (...args: unknown[]) => {
    if (isDev) console.info(...args)
  },
  debug: (...args: unknown[]) => {
    if (isDev) console.debug(...args)
  },
  group: (label: string) => {
    if (isDev) console.group(label)
  },
  groupEnd: () => {
    if (isDev) console.groupEnd()
  },
  table: (data: unknown) => {
    if (isDev) console.table(data)
  }
}

export default logger
