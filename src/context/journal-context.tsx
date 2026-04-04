import { createContext, useContext, useState, useEffect } from "react"

export type Entry = {
  id: number
  title: string
  content: string
  mood: string
  category: string
  date: string
  image?: string | null
  locked?: boolean
  password?: string
  pinHash?: string
  encryptedContent?: string
  hint?: string
}

type JournalContextType = {
  entries: Entry[]
  addEntry: (entry: Entry) => void
  deleteEntry: (id: number) => void
  updateEntry: (entry: Entry) => void
}

const JournalContext = createContext<JournalContextType | null>(null)

export const JournalProvider = ({ children }: { children: React.ReactNode }) => {
  const [entries, setEntries] = useState<Entry[]>(() => {
  try {
    const saved = localStorage.getItem("entries")
    const parsed = saved ? JSON.parse(saved) : []

    return parsed.map((e: Entry) => ({
      ...e,
      locked: e.locked ?? false,
    }))
  } catch {
    return []
  }
})

  useEffect(() => {
    localStorage.setItem("entries", JSON.stringify(entries))
  }, [entries])

  const addEntry = (entry: Entry) => {
    setEntries((prev) => [...prev, entry])
  }

  const deleteEntry = (id: number) => {
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }

  const updateEntry = (updated: Entry) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === updated.id ? updated : e))
    )
  }

  return (
    <JournalContext.Provider
      value={{ entries, addEntry, deleteEntry, updateEntry }}
    >
      {children}
    </JournalContext.Provider>
  )
}

export const useJournal = () => {
  const context = useContext(JournalContext)
  if (!context) {
    throw new Error("useJournal must be used inside JournalProvider")
  }
  return context
}