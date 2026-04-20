import { Button } from "@/components/ui/button"
import EntryCard from "../components/EntryCard"
import { useNavigate } from "react-router-dom"
import { useJournal } from "@/context/journal-context"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { useTheme } from "@/context/theme-context"
import { motion, AnimatePresence } from "framer-motion"
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer
} from "recharts"

/* 🎨 SETTINGS */
const ThemeSettings = ({ blur, setBlur }: { blur: number; setBlur: (v: number) => void }) => {
  const { setTheme, setFont } = useTheme()

  return (
    <div className="p-5 rounded-2xl space-y-4 bg-white/70 dark:bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl">
      <h2 className="font-semibold text-lg text-gray-800 dark:text-white">🎨 Appearance</h2>

      <input
        type="range"
        min="0"
        max="30"
        value={blur}
        onChange={(e) => setBlur(Number(e.target.value))}
      />

      <div className="flex gap-2">
        <Button onClick={() => setTheme("light")}>Light</Button>
        <Button onClick={() => setTheme("dark")}>Dark</Button>
      </div>

      <div className="flex gap-2">
        <Button onClick={() => setFont("sans")}>Sans</Button>
        <Button onClick={() => setFont("serif")}>Serif</Button>
        <Button onClick={() => setFont("mono")}>Mono</Button>
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
      .map(e => new Date(e.date).toDateString())
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())

    let current = 1
    let longest = 1

    for (let i = 1; i < dates.length; i++) {
      const diff =
        (new Date(dates[i]).getTime() - new Date(dates[i - 1]).getTime()) /
        (1000 * 60 * 60 * 24)

      if (diff === 1) {
        current++
        longest = Math.max(longest, current)
      } else if (diff > 1) {
        current = 1
      }
    }

    return { current, longest }
  })()

  const moodStats = entries.reduce<Record<string, number>>((acc, e) => {
    if (!e.mood) return acc
    acc[e.mood] = (acc[e.mood] || 0) + 1
    return acc
  }, {})

  const moodData = Object.entries(moodStats).map(([name, value]) => ({
    name,
    value
  }))

  const monthlyEntries = entries.filter(
    e => new Date(e.date).getMonth() === new Date().getMonth()
  )

  /* 🔍 FILTER (ORIGINAL LOGIC PRESERVED) */
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

  return (
    <div className="min-h-screen text-gray-900 dark:text-white">

      {/* 🌄 Background */}
      <div
        className="fixed inset-0 -z-20 bg-cover"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1506744038136-46273834b3fb")',
        }}
      />

      <div className="fixed inset-0 bg-black/40 dark:bg-black/60 -z-10" />

      {/* 🎬 VIDEO */}
      <AnimatePresence mode="wait">
        {fade && (
          <motion.video
            key={videoSrc}
            autoPlay
            loop
            muted
            playsInline
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            style={{ filter: `blur(${blur}px)` }}
            className="fixed inset-0 w-full h-full object-cover -z-20"
          >
            <source src={videoSrc} type="video/mp4" />
          </motion.video>
        )}
      </AnimatePresence>

      {/* 🧭 SIDEBAR */}
      <div className="fixed left-0 top-0 h-full w-64 p-5 bg-white/70 dark:bg-black/40 backdrop-blur-xl border-r border-white/20">
        <h2 className="text-xl font-bold mb-6">Journal</h2>

        <div className="flex flex-col gap-3">
          <Button onClick={() => navigate("/editor")}>✍️ New Entry</Button>
          <Button onClick={() => setShowLocked(true)}>🔒 View Locked</Button>
          <Button onClick={() => setShowLocked(false)}>🙈 Hide Locked</Button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="ml-64 p-8 space-y-8">

        <ThemeSettings blur={blur} setBlur={setBlur} />

        {/* 📊 STATS */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white/70 dark:bg-white/10 backdrop-blur-xl shadow-xl">
            <p className="text-sm opacity-70">Streak</p>
            <h2 className="text-3xl font-bold">{streak.current} 🔥</h2>
            <p className="text-xs">Longest: {streak.longest}</p>
          </div>

          <div className="p-5 rounded-2xl bg-white/70 dark:bg-white/10 backdrop-blur-xl shadow-xl">
            <p className="text-sm">Monthly Entries</p>
            <h2 className="text-3xl font-bold">{monthlyEntries.length}</h2>
          </div>

          <div className="p-5 rounded-2xl bg-white/70 dark:bg-white/10 backdrop-blur-xl shadow-xl">
            <p className="text-sm">Top Mood</p>
            <h2 className="text-3xl">
              {Object.entries(moodStats).sort((a, b) => b[1] - a[1])[0]?.[0] || "😊"}
            </h2>
          </div>
        </div>

        {/* 📈 GRAPH */}
        {moodData.length > 0 && (
          <div className="p-5 rounded-2xl bg-white/70 dark:bg-white/10 backdrop-blur-xl shadow-xl">
            <h2 className="mb-4 font-semibold">Mood Distribution</h2>

            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={moodData} dataKey="value" outerRadius={80}>
                  {moodData.map((_, i) => <Cell key={i} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* 🔍 FILTER BAR */}
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/60 dark:bg-white/10 backdrop-blur-md"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-2 rounded-lg bg-white/20"
          >
            <option>All</option>
            <option>Personal</option>
            <option>Work</option>
          </select>

          <select
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="p-2 rounded-lg bg-white/20"
          >
            <option>All</option>
            <option>😊</option>
            <option>😢</option>
            <option>🔥</option>
          </select>
        </div>

        {/* 📚 ENTRIES */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEntries.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </div>

      </div>
    </div>
  )
}

export default Dashboard