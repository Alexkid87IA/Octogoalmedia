import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('logger', () => {
  const originalEnv = import.meta.env.DEV

  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(console, 'info').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should exist and have expected methods', async () => {
    const { logger } = await import('./logger')

    expect(logger).toBeDefined()
    expect(typeof logger.log).toBe('function')
    expect(typeof logger.warn).toBe('function')
    expect(typeof logger.error).toBe('function')
    expect(typeof logger.info).toBe('function')
  })

  it('logger methods should be callable', async () => {
    const { logger } = await import('./logger')

    // These should not throw
    expect(() => logger.log('test')).not.toThrow()
    expect(() => logger.warn('test')).not.toThrow()
    expect(() => logger.error('test')).not.toThrow()
    expect(() => logger.info('test')).not.toThrow()
  })
})
