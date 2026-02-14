import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('PromptInjector', () => {
  let PromptInjector

  beforeEach(async () => {
    document.body.innerHTML = ''
    vi.resetModules()
    
    // Set up location hostname
    const url = new URL('https://chatgpt.com')
    Object.defineProperty(window, 'location', {
      value: url,
      writable: true
    })
    
    // Mock getComputedStyle properly
    vi.spyOn(window, 'getComputedStyle').mockImplementation((element) => {
      return {
        display: element.style?.display || 'block',
        visibility: element.style?.visibility || 'visible'
      }
    })
    
    // Import content.js which sets up PromptInjector
    await import('../../content.js')
    PromptInjector = window.PromptInjector
  })

  describe('selectors', () => {
    it('has default selectors defined', () => {
      expect(PromptInjector.selectors).toBeDefined()
      expect(Array.isArray(PromptInjector.selectors)).toBe(true)
      expect(PromptInjector.selectors.length).toBeGreaterThan(0)
    })
  })

  describe('domainSelectors', () => {
    it('has selectors for ChatGPT', () => {
      expect(PromptInjector.domainSelectors['chatgpt.com']).toBeDefined()
    })

    it('has selectors for Claude', () => {
      expect(PromptInjector.domainSelectors['claude.ai']).toBeDefined()
    })

    it('has selectors for Gemini', () => {
      expect(PromptInjector.domainSelectors['gemini.google.com']).toBeDefined()
    })
  })

  describe('isValidTarget()', () => {
    it('returns false for null element', () => {
      expect(PromptInjector.isValidTarget(null)).toBe(false)
    })

    it('returns false for disabled element', () => {
      const textarea = document.createElement('textarea')
      textarea.disabled = true
      
      expect(PromptInjector.isValidTarget(textarea)).toBe(false)
    })

    it('returns false for readonly element', () => {
      const textarea = document.createElement('textarea')
      textarea.readOnly = true
      
      expect(PromptInjector.isValidTarget(textarea)).toBe(false)
    })
  })

  describe('insertIntoInput()', () => {
    it('sets element value', () => {
      const input = document.createElement('input')
      input.type = 'text'
      document.body.appendChild(input)
      
      PromptInjector.insertIntoInput(input, 'test value')
      
      expect(input.value).toBe('test value')
    })

    it('focuses element', () => {
      const input = document.createElement('input')
      input.type = 'text'
      document.body.appendChild(input)
      
      PromptInjector.insertIntoInput(input, 'test')
      
      expect(document.activeElement).toBe(input)
    })
  })

  describe('insertIntoContentEditable()', () => {
    it('sets text content', () => {
      const div = document.createElement('div')
      div.setAttribute('contenteditable', 'true')
      document.body.appendChild(div)
      
      PromptInjector.insertIntoContentEditable(div, 'test content')
      
      expect(div.textContent).toBe('test content')
    })

    it('focuses element', () => {
      const div = document.createElement('div')
      div.setAttribute('contenteditable', 'true')
      document.body.appendChild(div)
      
      PromptInjector.insertIntoContentEditable(div, 'test')
      
      expect(document.activeElement).toBe(div)
    })
  })

  describe('copyToClipboard()', () => {
    it('uses Clipboard API when available', async () => {
      const result = await PromptInjector.copyToClipboard('test text')
      
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test text')
      expect(result).toBe(true)
    })
  })
})

describe('showNotification()', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('creates notification element', () => {
    require('../../content.js')
    
    window.showNotification('Test message')
    
    const notification = document.querySelector('[style*="position: fixed"]')
    expect(notification).not.toBeNull()
    expect(notification.textContent).toBe('Test message')
  })

  it('creates error notification', () => {
    require('../../content.js')
    
    window.showNotification('Error', 'error')
    
    const notification = document.querySelector('[style*="position: fixed"]')
    expect(notification.textContent).toBe('Error')
  })

  it('creates success notification', () => {
    require('../../content.js')
    
    window.showNotification('Success', 'success')
    
    const notification = document.querySelector('[style*="position: fixed"]')
    expect(notification.textContent).toBe('Success')
  })

  it('removes notification after timeout', async () => {
    require('../../content.js')
    
    window.showNotification('Temp', 'info', 100)
    
    await new Promise(resolve => setTimeout(resolve, 150))
    
    const notification = document.querySelector('[style*="position: fixed"]')
    expect(notification).toBeNull()
  })
})
