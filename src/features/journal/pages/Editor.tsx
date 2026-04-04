import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useNavigate, useParams } from "react-router"
import { useJournal } from "@/context/journal-context"
import { encrypt, hashPin } from "@/utils/crypto"

const moods = ["😊", "😢", "😡", "😌", "🔥", "💭"]
const categories = ["Personal", "Work", "Ideas", "Travel"]

const Editor = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  const { entries, addEntry, updateEntry } = useJournal()

  const existingEntry = entries.find((e) => e.id === Number(id))

  // 🧾 BASIC STATES
  const [title, setTitle] = useState(existingEntry?.title || "")
  const [content, setContent] = useState(existingEntry?.content || "")
  const [mood, setMood] = useState(existingEntry?.mood || "😊")
  const [category, setCategory] = useState(existingEntry?.category || "Personal")
  const [image, setImage] = useState<string | null>(existingEntry?.image || null)

  // 🔒 SECURITY STATES
  const [locked, setLocked] = useState(existingEntry?.locked || false)
  const [pin, setPin] = useState("")
  const [hint, setHint] = useState(existingEntry?.hint || "")

  // 🤖 AI
  const [aiResult, setAiResult] = useState("")

  // ================= AI =================
  const handleImprove = () => {
    if (!content) return setAiResult("Write something first.")
    setAiResult(`✨ Improved Version:\n\n${content}`)
  }

  const handleFeedback = () => {
    if (!content) return setAiResult("Write something first.")
    setAiResult("💬 Try adding more detail and structure.")
  }

  const handleRate = () => {
    if (!content) return setAiResult("Write something first.")
    setAiResult("⭐ Rating: 8/10")
  }

  useEffect(() => {
    setAiResult("")
  }, [content])

  // ================= LOAD EXISTING =================
  useEffect(() => {
    if (existingEntry) {
      setTitle(existingEntry.title)
      setContent(existingEntry.content)
      setMood(existingEntry.mood)
      setCategory(existingEntry.category)
      setImage(existingEntry.image || null)
      setLocked(existingEntry.locked || false)
      setHint(existingEntry.hint || "")
    }
  }, [existingEntry])

  // ================= SAVE =================
  const handleSave = () => {
    if (locked && !pin) {
      alert("PIN required")
      return
    }

    const encryptedContent = locked
      ? encrypt(content, pin)
      : undefined

    const entryData = {
      title,
      content: locked ? "" : content,
      encryptedContent,
      mood,
      category,
      date: new Date().toLocaleDateString(),
      image,
      locked,
      pinHash: locked ? hashPin(pin) : undefined,
      hint,
    }

    if (id) {
      updateEntry({
        id: Number(id),
        ...entryData,
      })
    } else {
      addEntry({
        id: Date.now(),
        ...entryData,
      })
    }

    navigate("/dashboard")
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">

      {/* Title */}
      <Input
        placeholder="Title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="text-xl font-semibold"
      />

      {/* Content */}
      <textarea
        placeholder="Start writing your thoughts..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full min-h-[200px] p-3 border rounded-md"
      />

      {/* Image */}
      {image && (
        <Button variant="outline" onClick={() => setImage(null)}>
          Remove Image
        </Button>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (!file) return

          const reader = new FileReader()
          reader.onloadend = () => {
            setImage(reader.result as string)
          }
          reader.readAsDataURL(file)
        }}
      />

      {/* 🔒 LOCK SYSTEM */}
      <Card>
        <CardContent className="p-4 space-y-3">

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={locked}
              onChange={(e) => setLocked(e.target.checked)}
            />
            Lock this entry 🔒
          </label>

          {locked && (
            <>
              <Input
                type="password"
                placeholder="Enter PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
              />

              <Input
                placeholder="Hint (optional)"
                value={hint}
                onChange={(e) => setHint(e.target.value)}
              />
            </>
          )}

        </CardContent>
      </Card>

      {/* 🤖 AI */}
      <Card>
        <CardContent className="space-y-4 p-4">
          <h2 className="font-semibold text-lg">AI Assistant</h2>

          <div className="flex gap-2 flex-wrap">
            <Button onClick={handleImprove}>Improve</Button>
            <Button onClick={handleFeedback}>Feedback</Button>
            <Button onClick={handleRate}>Rate</Button>
          </div>

          {aiResult && (
            <div className="p-3 border rounded-md bg-gray-50 whitespace-pre-line">
              {aiResult}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mood */}
      <Card>
        <CardContent className="flex gap-2 p-4 flex-wrap">
          {moods.map((m) => (
            <button
              key={m}
              onClick={() => setMood(m)}
              className={`text-xl p-2 rounded ${
                mood === m ? "bg-gray-200" : ""
              }`}
            >
              {m}
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Category */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="p-2 border rounded-md"
      >
        {categories.map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => navigate("/dashboard")}>
          Cancel
        </Button>

        <Button onClick={handleSave}>
          {id ? "Update Entry" : "Save Entry"}
        </Button>
      </div>

    </div>
  )
}

export default Editor