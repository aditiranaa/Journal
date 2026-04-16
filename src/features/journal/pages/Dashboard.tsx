import { Button } from "@/components/ui/button"
import EntryCard from "../components/EntryCard"
import { useNavigate } from "react-router-dom"
import { useJournal } from "@/context/journal-context"
import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { useTheme } from "@/context/theme-context"
import { motion, AnimatePresence } from "framer-motion"

/* ✅ Props */
type ThemeSettingsProps = {
  blur: number
  setBlur: (value: number) => void
  sound: string
  setSound: (value: string) => void
}

/* 🎨 SETTINGS */
const ThemeSettings = ({
  blur,
  setBlur,
  
}: ThemeSettingsProps) => {
  const { setTheme, setFont } = useTheme()

  return (
    <div className="p-4 rounded-2xl space-y-4 bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl">
      <h2 className="font-semibold text-lg text-white">🎨 Appearance</h2>

      {/* Blur */}
      <div>
        <p className="text-sm text-white/80 mb-2">Blur</p>
        <input
          type="range"
          min="0"
          max="30"
          value={blur}
          onChange={(e) => setBlur(Number(e.target.value))}
          className="w-full"
        />
      </div>

     

      {/* Theme */}
      <div>
        <p className="text-sm mb-2 text-white/80">Theme</p>
        <div className="flex gap-2">
          <Button onClick={() => setTheme("light")}>Light</Button>
          <Button onClick={() => setTheme("dark")}>Dark</Button>
        </div>
      </div>

      {/* Font */}
      <div>
        <p className="text-sm mb-2 text-white/80">Font</p>
        <div className="flex gap-2">
          <Button onClick={() => setFont("sans")}>Sans</Button>
          <Button onClick={() => setFont("serif")}>Serif</Button>
          <Button onClick={() => setFont("mono")}>Mono</Button>
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

  const [blur, setBlur] = useState(15)
  const [sound, setSound] = useState("none")

  /* 🎬 Mood Videos */
  const moodVideos: Record<string, string> = {
    "😊": "/videos/happy.mp4",
    "😢": "/videos/rain.mp4",
    "🔥": "/videos/neon.mp4",
    "😌": "/videos/calm.mp4",
  }

  const currentMood = entries[0]?.mood ?? "😊"

  const [videoSrc, setVideoSrc] = useState(moodVideos[currentMood])
  const [fade, setFade] = useState(true)

  /* 🎬 Smooth video transition */
  useEffect(() => {
    const newVideo = moodVideos[currentMood] || "/videos/calm.mp4"

    if (newVideo !== videoSrc) {
      setFade(false)
      setTimeout(() => {
        setVideoSrc(newVideo)
        setFade(true)
      }, 400)
    }
  }, [currentMood])

  /* 🎵 Ambient Sound */
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (audioRef.current) audioRef.current.pause()

    if (sound === "none") return

    const audio = new Audio(
      sound === "rain" ? "/sounds/rain.mp3" : "/sounds/cafe.mp3"
    )

    audio.loop = true
    audio.volume = 0.4
    audio.play()

    audioRef.current = audio

    return () => audio.pause()
  }, [sound])

  /* 🔍 Filter */
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
    <div className="min-h-screen text-white relative overflow-hidden">

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
            className="fixed top-0 left-0 w-full h-full object-cover -z-20"
          >
            <source src={videoSrc} type="video/mp4" />
          </motion.video>
        )}
      </AnimatePresence>

      <div className="fixed inset-0 bg-black/40 -z-10" />

      {/* CONTENT */}
      <div className="relative z-10 max-w-6xl mx-auto p-6 space-y-10">

  {/* 🎨 SETTINGS CARD */}
  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5 shadow-xl">
    <ThemeSettings
      blur={blur}
      setBlur={setBlur}
      sound={sound}
      setSound={setSound}
    />
  </div>

  {/* 🔍 FILTER BAR (UPGRADED) */}
  <div className="
    flex flex-col md:flex-row gap-4
    bg-white/10 backdrop-blur-xl border border-white/20
    rounded-2xl p-4 shadow-lg
  ">

    {/* Search */}
    <Input
      placeholder="Search your thoughts..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="bg-white/20 border-none focus:ring-2 focus:ring-white/40"
    />

    {/* Category */}
    <select
      value={category}
      onChange={(e) => setCategory(e.target.value)}
      className="p-2 rounded-lg bg-white/20 backdrop-blur border border-white/20 text-white"
    >
      <option className="text-black">All</option>
      <option className="text-black">Personal</option>
      <option className="text-black">Work</option>
    </select>

    {/* Mood */}
    <select
      value={mood}
      onChange={(e) => setMood(e.target.value)}
      className="p-2 rounded-lg bg-white/20 backdrop-blur border border-white/20 text-white"
    >
      <option className="text-black">All</option>
      <option className="text-black">😊</option>
      <option className="text-black">😢</option>
      <option className="text-black">🔥</option>
    </select>

    {/* 🔒 Toggle */}
    <Button
      variant="outline"
      className="border-white/30 text-white hover:bg-white/20"
      onClick={() => setShowLocked((prev) => !prev)}
    >
      {showLocked ? "Hide Locked 🔒" : "Show Locked 🔓"}
    </Button>

  </div>

</div>

        {/* Header */}
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">Your Journal</h1>
          <Button onClick={() => navigate("/editor")}>+ New Entry</Button>
        </div>

        {/* Entries */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEntries.map((entry) => (
            <motion.div
              key={entry.id}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-xl"
            >
              <EntryCard entry={entry} />
            </motion.div>
          ))}
        </div>
      </div>
  )
}

export default Dashboard