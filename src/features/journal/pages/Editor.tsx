// rebuild trigger

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useJournal } from '@/context/journal-context'
import { encrypt, hashPin } from '@/utils/crypto'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const moods = ['😊', '😢', '😡', '😌', '🔥', '💭']
const categories = ['Personal', 'Work', 'Ideas', 'Travel']

const Editor = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { entries, addEntry, updateEntry } = useJournal()

  const existingEntry = entries.find(e => e.id === Number(id))
  const [title, setTitle] = useState(existingEntry?.title || '')
  const [content, setContent] = useState(existingEntry?.content || '')
  const [mood, setMood] = useState(existingEntry?.mood || '😊')
  const [category, setCategory] = useState(
    existingEntry?.category || 'Personal'
  )
  const [image, setImage] = useState<string | null>(
    existingEntry?.image || null
  )

  const [locked, setLocked] = useState(existingEntry?.locked || false)
  const [pin, setPin] = useState('')
  const [hint, setHint] = useState(existingEntry?.hint || '')

  // ✅ CLEAN EDITOR (NO BUBBLE MENU)
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML())
    }
  })

  useEffect(() => {
    if (existingEntry) {
      setTitle(existingEntry.title)
      setContent(existingEntry.content)
      setMood(existingEntry.mood)
      setCategory(existingEntry.category)
      setImage(existingEntry.image || null)
      setLocked(existingEntry.locked || false)
      setHint(existingEntry.hint || '')
    }
  }, [existingEntry])

  const handleSave = () => {
    if (locked && !pin) {
      alert('PIN required')
      return
    }

    const encryptedContent = locked ? encrypt(content, pin) : undefined

    const entryData = {
      title,
      content: locked ? '' : content,
      encryptedContent,
      mood,
      category,
      date: new Date().toLocaleDateString(),
      image,
      locked,
      pinHash: locked ? hashPin(pin) : undefined,
      hint
    }

    if (id) {
      updateEntry({ id: Number(id), ...entryData })
    } else {
      addEntry({ id: Date.now(), ...entryData })
    }

    navigate('/dashboard')
  }

  return (
    <div className='mx-auto max-w-3xl space-y-6 p-6'>
      {/* Title */}
      <Input
        placeholder='Title...'
        value={title}
        onChange={e => setTitle(e.target.value)}
        className='text-xl font-semibold'
      />

      {/* ✅ STABLE TOOLBAR */}
      <div className='flex flex-wrap gap-2'>
        <Button onClick={() => editor?.chain().focus().toggleBold().run()}>
          Bold
        </Button>

        <Button onClick={() => editor?.chain().focus().toggleItalic().run()}>
          Italic
        </Button>

        <Button
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          H1
        </Button>

        <Button
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          List
        </Button>
      </div>

      {/* ✍️ Editor */}
      <div className='min-h-[200px] rounded-md border p-3'>
        <EditorContent editor={editor} />
      </div>

      {/* Image */}
      {image && (
        <Button variant='outline' onClick={() => setImage(null)}>
          Remove Image
        </Button>
      )}

      <input
        type='file'
        accept='image/*'
        onChange={e => {
          const file = e.target.files?.[0]
          if (!file) return

          const reader = new FileReader()
          reader.onloadend = () => {
            setImage(reader.result as string)
          }
          reader.readAsDataURL(file)
        }}
      />

      {/* 🔒 Lock */}
      <Card>
        <CardContent className='space-y-3 p-4'>
          <label className='flex items-center gap-2'>
            <input
              type='checkbox'
              checked={locked}
              onChange={e => setLocked(e.target.checked)}
            />
            Lock this entry 🔒
          </label>

          {locked && (
            <>
              <Input
                type='password'
                placeholder='Enter PIN'
                value={pin}
                onChange={e => setPin(e.target.value)}
              />

              <Input
                placeholder='Hint'
                value={hint}
                onChange={e => setHint(e.target.value)}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Mood */}
      <Card>
        <CardContent className='flex flex-wrap gap-2 p-4'>
          {moods.map(m => (
            <button
              key={m}
              onClick={() => setMood(m)}
              className={`rounded p-2 text-xl ${mood === m ? 'bg-gray-200' : ''}`}
            >
              {m}
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Category */}
      <select
        value={category}
        onChange={e => setCategory(e.target.value)}
        className='rounded-md border p-2'
      >
        {categories.map(c => (
          <option key={c}>{c}</option>
        ))}
      </select>

      {/* Actions */}
      <div className='flex justify-end gap-2'>
        <Button variant='outline' onClick={() => navigate('/dashboard')}>
          Cancel
        </Button>

        <Button onClick={handleSave}>
          {id ? 'Update Entry' : 'Save Entry'}
        </Button>
      </div>
    </div>
  )
}

export default Editor
