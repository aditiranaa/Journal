import { useNavigate, useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useJournal } from "@/context/journal-context"
import { decrypt, hashPin } from "@/utils/crypto"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog"

const EntryView = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { entries, deleteEntry } = useJournal()

  const entry = entries.find((e) => e.id === Number(id || 0))

  // 🔐 HOOKS MUST BE HERE (always run)
// 🔐 hooks (ALWAYS first)
const [pinInput, setPinInput] = useState("")
const [unlocked, setUnlocked] = useState(false)
const [decrypted, setDecrypted] = useState("")
const [attempts, setAttempts] = useState(0)

// ✅ useEffects MUST be here too
useEffect(() => {
  if (!entry) return

  const cached = sessionStorage.getItem(`unlocked-${entry.id}`)
  if (cached) setUnlocked(true)
}, [entry])

useEffect(() => {
  if (!entry) return

  return () => {
    sessionStorage.removeItem(`unlocked-${entry.id}`)
  }
}, [entry])

// ⛔ AFTER ALL HOOKS
if (!entry) return <div>Entry not found</div>

  // 🔓 UNLOCK HANDLER
  const handleUnlock = () => {
    if (attempts >= 3) {
      alert("Too many attempts. Try later.")
      return
    }

   if (!entry.pinHash || hashPin(pinInput) !== entry.pinHash) {
  setAttempts((a) => a + 1)
  alert("Wrong PIN")
  return
  }

  if (!entry.encryptedContent) {
  alert("No encrypted content found")
  return
  }

const result = decrypt(entry.encryptedContent, pinInput)
    if (!result) {
      alert("Decryption failed")
      return
    }

    setDecrypted(result)
    setUnlocked(true)

    sessionStorage.setItem(`unlocked-${entry.id}`, "true")
  }

  const isLocked = entry.locked && !unlocked

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">

      {/* Top Actions */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => navigate("/dashboard")}>
          ← Back
        </Button>

        <div className="flex gap-2">
          <Button
            disabled={entry.locked && !unlocked}
            onClick={() => navigate(`/editor/${entry.id}`)}
          >
            Edit
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive">Delete</Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Entry?</DialogTitle>
              </DialogHeader>

              <p className="text-sm text-gray-500">
                Are you sure you want to delete this entry? This action cannot be undone.
              </p>

              <DialogFooter>
                <Button variant="outline">Cancel</Button>

                <Button
                  variant="destructive"
                  onClick={() => {
                    deleteEntry(entry.id)
                    navigate("/dashboard")
                  }}
                >
                  Yes, Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Entry Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {entry.title} {entry.locked && "🔒"}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">

          {/* Meta */}
          <div className="flex gap-4 text-sm text-gray-500">
            <span>{entry.mood}</span>
            <span>{entry.category}</span>
            <span>{entry.date}</span>
          </div>

          {/* 🔒 LOCKED VIEW */}
          {isLocked ? (
            <div className="space-y-3">

              <p>🔒 This entry is locked</p>

              {/* Hint */}
              {entry.hint && (
                <p className="text-sm text-gray-400">
                  Hint: {entry.hint}
                </p>
              )}

              <input
                type="password"
                placeholder="Enter PIN"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="border p-2 rounded w-full"
              />

              <Button onClick={handleUnlock}>
                Unlock
              </Button>

            </div>
          ) : (
            <>
              {/* CONTENT */}
              <p className="whitespace-pre-line leading-relaxed">
                {entry.locked ? decrypted : entry.content}
              </p>

              {/* IMAGE */}
              {entry.image && (
                <img
                  src={entry.image}
                  alt="entry"
                  className="rounded-md max-h-[300px] object-cover"
                />
              )}
            </>
          )}

        </CardContent>
      </Card>

    </div>
  )
}

export default EntryView 