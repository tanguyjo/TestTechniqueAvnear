const STORAGE_KEY = 'trackedIndexes'

export function loadIndexes() {
  const saved = localStorage.getItem(STORAGE_KEY)
  return saved ? JSON.parse(saved) : []
}

export function saveIndexes(indexes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(indexes))
}
