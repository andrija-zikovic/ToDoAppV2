export const localStorageWrapper = {
  getItem: <T = any>(key: string | null): T | null => {
    console.log('getItem')
    if (!key) {
      return null
    }

    const storage = localStorage.getItem(key)
    try {
      return storage ? JSON.parse(storage) : null
    } catch (error) {
      console.error('Error parsing ToDo data:', error)
      return null
    }
  },
  setItem: (key: string, data: any) => {
    console.log('setItem')
    if (!key) {
      return
    }

    try {
      const stringifiedData = JSON.stringify(data)
      localStorage.setItem(key, stringifiedData)
    } catch (error) {
      console.error(`Error setting ${key} in localStorage:`, error)
    }
  },
  removeItem: (key: string | null) => {
    if (!key) {
      return
    }

    localStorage.removeItem(key)
  },
  removeAllCacheItems: () => {
    localStorage.clear()
  }
}
