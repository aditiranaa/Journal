import { Button } from "@/components/ui/button"
import EntryCard from "../components/EntryCard"
import { useJournal } from "@/context/journal-context"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { useTheme } from "@/context/theme-context"
import { motion, AnimatePresence } from "framer-motion"

/* 🎨 SETTINGS */
const ThemeSettings = ({
  blur,
  setBlur,
}: {
  blur: number
  setBlur: (v: number) => void
}) => {
  const { setTheme, setFont } = useTheme()

  const btn =
    "border-gray-300 text-gray-800 hover:bg-gray-200 dark:border-white/20 dark:text-white dark:hover:bg-white/20"

  return (
    <div className="w-full p-5 rounded-2xl space-y-4 bg-white/70 dark:bg-white/10 backdrop-blur-xl">
      <h2 className="font-semibold text-lg text-gray-800 dark:text-white">
        🎨 Appearance
      </h2>

      <input
        type="range"
        min="0"
        max="30"
        value={blur}
        onChange={(e) => setBlur(Number(e.target.value))}
      />

      <div className="flex gap-2">
        <Button variant="outline" className={btn} onClick={() => setTheme("light")}>
          Light
        </Button>
        <Button variant="outline" className={btn} onClick={() => setTheme("dark")}>
          Dark
        </Button>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" className={btn} onClick={() => setFont("sans")}>
          Sans
        </Button>
        <Button variant="outline" className={btn} onClick={() => setFont("serif")}>
          Serif
        </Button>
        <Button variant="outline" className={btn} onClick={() => setFont("mono")}>
          Mono
        </Button>
      </div>
    </div>
  )
}

/* 📊 DASHBOARD */
const Dashboard = () => {
  const { entries } = useJournal()

  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")
  const [mood, setMood] = useState("All")
  const [showLocked, setShowLocked] = useState(true)
  const [blur, setBlur] = useState(15)

  /* 🎬 Background */
  const moodVideos: Record<string, string> = {
    "😊": "/videos/happy.mp4",
    "😢": "/videos/rain.mp4",
    "🔥": "/videos/neon.mp4",
    "😌": "/videos/calm.mp4",
  }

  const currentMood = entries[0]?.mood ?? "😊"
  const [videoSrc, setVideoSrc] = useState(moodVideos[currentMood])
  const [fade, setFade] = useState(true)

  useEffect(() => {
    const newVideo = moodVideos[currentMood] || "/videos/calm.mp4"
    if (newVideo !== videoSrc) {
      setFade(false)
      setTimeout(() => {
        setVideoSrc(newVideo)
        setFade(true)
      }, 400)
    }
  }, [currentMood, videoSrc])

  /* 📊 ANALYTICS */
  const streak = (() => {
    if (!entries?.length) return { current: 0, longest: 0 }

    const dates = entries
      .map((e) => new Date(e.date).toDateString())
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())

    let current = 1
    let longest = 1

    for (let i = 1; i < dates.length; i++) {
      const diff =
        (new Date(dates[i]).getTime() -
          new Date(dates[i - 1]).getTime()) /
        (1000 * 60 * 60 * 24)

      if (diff === 1) {
        current++
        longest = Math.max(longest, current)
      } else {
        current = 1
      }
    }

    return { current, longest }
  })()

  
  const monthlyEntries = entries.filter(
    (e) => new Date(e.date).getMonth() === new Date().getMonth()
  )

  /* 🔍 FILTER */
  const filteredEntries = entries.filter((entry) => {
    return (
      (entry.title.toLowerCase().includes(search.toLowerCase()) ||
        (!entry.locked &&
          entry.content.toLowerCase().includes(search.toLowerCase()))) &&
      (category === "All" || entry.category === category) &&
      (mood === "All" || entry.mood === mood) &&
      (showLocked || !entry.locked)
    )
  })

  const glass =
    "bg-white/70 dark:bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl"

  const selectClass =
    "px-3 py-2 rounded-lg bg-black text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"

  return (
    <div className="min-h-screen w-full p-8 space-y-8 text-gray-900 dark:text-white">

      {/* 🎬 VIDEO BACKGROUND */}
      <AnimatePresence mode="wait">
        {fade && (
          <motion.video
            key={videoSrc}
            autoPlay
            loop
            muted
            playsInline
            className="fixed inset-0 w-full h-full object-cover -z-20"
            style={{ filter: `blur(${blur}px)` }}
          >
            <source src={videoSrc} type="video/mp4" />
          </motion.video>
        )}
      </AnimatePresence>

      <ThemeSettings blur={blur} setBlur={setBlur} />

      <Button
        variant="outline"
        className="border-gray-300 text-gray-800 dark:border-white/20 dark:text-white dark:hover:bg-white/20"
        onClick={() => setShowLocked((prev) => !prev)}
      >
        {showLocked ? "Hide Locked 🔒" : "Show Locked 🔓"}
      </Button>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`p-5 rounded-2xl ${glass}`}>
          <p className="text-sm opacity-70">Streak</p>
          <h2 className="text-3xl font-bold">{streak.current} 🔥</h2>
        </div>

        <div className={`p-5 rounded-2xl ${glass}`}>
          <p className="text-sm">Monthly Entries</p>
          <h2 className="text-3xl font-bold">{monthlyEntries.length}</h2>
        </div>

        <div className={`p-5 rounded-2xl ${glass}`}>
          <p className="text-sm">Top Mood</p>
          
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white/70 text-gray-900 dark:bg-white/10 dark:text-white backdrop-blur-md border border-white/20"
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)} className={selectClass}>
          <option value="All">All</option>
          <option value="Personal">Personal</option>
          <option value="Work">Work</option>
        </select>

        <select value={mood} onChange={(e) => setMood(e.target.value)} className={selectClass}>
          <option value="All">All</option>
          <option value="😊">😊</option>
          <option value="😢">😢</option>
          <option value="🔥">🔥</option>
        </select>
      </div>

      {/* Entries */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEntries.map((entry) => (
          <EntryCard key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  )
}

export default Dashboard