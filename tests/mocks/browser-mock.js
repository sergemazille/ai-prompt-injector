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

    // Utility methods for tests
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

// Export of complete browser object
export const browserMock = {
  storage: {
    local: createStorageMock()
  },
  runtime: createRuntimeMock(),
  tabs: createTabsMock(),
  action: createActionMock(),
  
  // Utility method to reset all mocks
  _resetAllMocks: () => {
    browserMock.storage.local._resetMocks()
    vi.clearAllMocks()
  }
}

// Function to install global mock
export const installBrowserMock = () => {
  global.browser = browserMock
  return browserMock
}