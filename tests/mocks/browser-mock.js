// Complete mock of browser.* API for Firefox extension tests
import { vi } from 'vitest'

// Mock of local storage system
const createStorageMock = () => {
  let storage = {}

  return {
    get: vi.fn((keys) => {
      if (typeof keys === 'string') {
        return Promise.resolve({ [keys]: storage[keys] })
      }
      if (Array.isArray(keys)) {
        const result = {}
        keys.forEach(key => {
          if (storage[key] !== undefined) {
            result[key] = storage[key]
          }
        })
        return Promise.resolve(result)
      }
      return Promise.resolve(storage)
    }),

    set: vi.fn((items) => {
      Object.assign(storage, items)
      return Promise.resolve()
    }),

    remove: vi.fn((keys) => {
      const keysArray = Array.isArray(keys) ? keys : [keys]
      keysArray.forEach(key => delete storage[key])
      return Promise.resolve()
    }),

    clear: vi.fn(() => {
      storage = {}
      return Promise.resolve()
    }),

    _getStorage: () => storage,
    _setStorage: (newStorage) => { storage = { ...newStorage } },
    _resetMocks: () => {
      storage = {}
      vi.clearAllMocks()
    }
  }
}

// Mock of runtime for component communication
const createRuntimeMock = () => ({
  onMessage: {
    addListener: vi.fn()
  },
  sendMessage: vi.fn(() => Promise.resolve()),
  lastError: null
})

// Mock of tabs for content injection
const createTabsMock = () => ({
  sendMessage: vi.fn(() => Promise.resolve({ success: true })),
  query: vi.fn(() => Promise.resolve([{ id: 1, url: 'https://chatgpt.com' }]))
})

// Mock of action (popup)
const createActionMock = () => ({
  onClicked: {
    addListener: vi.fn()
  },
  openPopup: vi.fn()
})

// Mock clipboard API
const createClipboardMock = () => ({
  writeText: vi.fn(() => Promise.resolve()),
  readText: vi.fn(() => Promise.resolve(''))
})

// Mock for getComputedStyle
const createComputedStyleMock = () => vi.fn((element) => ({
  display: element.style?.display || 'block',
  visibility: element.style?.visibility || 'visible'
}))

// Mock for getSelection
const createSelectionMock = () => ({
  selectAllChildren: vi.fn(),
  removeAllRanges: vi.fn(),
  addRange: vi.fn()
})

// Export of complete browser object
export const browserMock = {
  storage: {
    local: createStorageMock()
  },
  runtime: createRuntimeMock(),
  tabs: createTabsMock(),
  action: createActionMock(),
  
  _resetAllMocks: () => {
    browserMock.storage.local._resetMocks()
    vi.clearAllMocks()
  }
}

// Global DOM mocks
export const installDomMocks = () => {
  // Clipboard mock - use Object.defineProperty to avoid getter issues
  if (!global.navigator) global.navigator = {}
  Object.defineProperty(global.navigator, 'clipboard', {
    value: createClipboardMock(),
    writable: true,
    configurable: true
  })

  // getComputedStyle mock
  global.getComputedStyle = createComputedStyleMock()

  // window.getSelection mock
  if (!global.window) global.window = {}
  global.window.getSelection = vi.fn(() => createSelectionMock())

  // document.execCommand mock
  if (!global.document) global.document = {}
  global.document.execCommand = vi.fn(() => true)

  // window.location mock
  if (!global.window.location) {
    global.window.location = new URL('https://chatgpt.com')
  }

  return {
    resetClipboard: () => {
      global.navigator.clipboard.writeText.mockReset()
      global.navigator.clipboard.readText.mockReset()
    },
    resetAll: () => {
      global.navigator.clipboard.writeText.mockReset()
      global.navigator.clipboard.readText.mockReset()
      global.getComputedStyle.mockClear()
      global.window.getSelection.mockClear()
      global.document.execCommand.mockClear()
    }
  }
}

// Function to install global mock
export const installBrowserMock = () => {
  global.browser = browserMock
  installDomMocks()
  return browserMock
}