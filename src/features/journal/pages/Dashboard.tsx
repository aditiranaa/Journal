import { Button } from "@/components/ui/button"
import EntryCard from "../components/EntryCard"
import { useNavigate } from "react-router-dom"
import { useJournal } from "@/context/journal-context"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { useTheme } from "@/context/theme-context"

/* 🎨 THEME SETTINGS PANEL */
const ThemeSettings = () => {
  const { setTheme, setFont, setWallpaper } = useTheme()
   
  return (
    <div className="p-4 border rounded-xl shadow-sm space-y-4 bg-white/50 backdrop-blur">

      <h2 className="font-semibold text-lg">🎨 Appearance</h2>

      {/* THEMES */}
      <div>
        <p className="text-sm mb-2">Theme</p>
        <div className="flex gap-2">
          <Button onClick={() => setTheme("light")}>Light</Button>
          <Button onClick={() => setTheme("dark")}>Dark</Button>
        </div>
      </div>

      {/* FONTS */}
      <div>
        <p className="text-sm mb-2">Font</p>
        <div className="flex gap-2">
          <Button onClick={() => setFont("sans")}>Sans</Button>
          <Button onClick={() => setFont("serif")}>Serif</Button>
          <Button onClick={() => setFont("mono")}>Mono</Button>
        </div>
      </div>

      {/* WALLPAPERS */}
      <div>
        <p className="text-sm mb-2">Wallpaper</p>
        <div className="flex gap-2 flex-wrap">

          <Button variant="outline" onClick={() => setWallpaper(null)}>
            None
          </Button>

          <Button
            variant="outline"
            onClick={() =>
              setWallpaper("https://images.unsplash.com/photo-1501785888041-af3ef285b470")
            }
          >
            🌿 Nature
          </Button>

          <Button
            variant="outline"
            onClick={() =>
              setWallpaper("https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d")
            }
          >
            🧘 Minimal
          </Button>

        </div>
      </div>

    </div>
  )
}

/* 📊 DASHBOARD */
const Dashboard = () => {
  const navigate = useNavigate()
  const { entries } = useJournal()

  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")
  const [mood, setMood] = useState("All")
  const [showLocked, setShowLocked] = useState(true)

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.title.toLowerCase().includes(search.toLowerCase()) ||
      (!entry.locked &&
        entry.content.toLowerCase().includes(search.toLowerCase()))

    const matchesCategory =
      category === "All" || entry.category === category

    const matchesMood =
      mood === "All" || entry.mood === mood

    const matchesLocked =
      showLocked || !entry.locked

    return matchesSearch && matchesCategory && matchesMood && matchesLocked
  })

  return (
    <div className="p-6 space-y-6">

      {/* 🎨 THEME PANEL */}
      <ThemeSettings />

      {/* 🔍 Filters */}
      <div className="flex flex-col md:flex-row gap-4">

        <Input
          placeholder="Search entries..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option>All</option>
          <option>Personal</option>
          <option>Work</option>
          <option>Ideas</option>
          <option>Travel</option>
        </select>

        <select
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option>All</option>
          <option>😊</option>
          <option>😢</option>
          <option>😡</option>
          <option>😌</option>
          <option>🔥</option>
          <option>💭</option>
        </select>

        {/* 🔒 Toggle */}
        <Button
          variant="outline"
          onClick={() => setShowLocked((prev) => !prev)}
        >
          {showLocked ? "Hide Locked 🔒" : "Show Locked 🔓"}
        </Button>

      </div>

      {/* 📌 Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Your Journal</h1>

        <Button onClick={() => navigate("/editor")}>
          + New Entry
        </Button>
      </div>

      {/* 🧾 Entries */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEntries.map((entry) => (
          <EntryCard key={entry.id} entry={entry} />
        ))}
      </div>

      {/* 🚫 Empty state */}
      {filteredEntries.length === 0 && (
        <p className="text-center text-gray-400 mt-10">
          No entries found
        </p>
      )}

    </div>
  )
}

export default Dashboard