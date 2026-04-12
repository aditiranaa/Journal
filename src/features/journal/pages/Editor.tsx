import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useJournal } from '@/context/journal-context'
import { encrypt, hashPin } from '@/utils/crypto'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

// Icons
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Highlighter,
  Palette,
} from 'lucide-react'

// Extensions
import Highlight from '@tiptap/extension-highlight'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import Color from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'


const categories = ['Personal', 'Work', 'Ideas', 'Travel']

const Editor = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { entries, addEntry, updateEntry } = useJournal()

  const existingEntry = entries.find(e => e.id === Number(id))

  const [title, setTitle] = useState(existingEntry?.title || '')
  const [content, setContent] = useState(existingEntry?.content || '')
  const [mood, setMood] = useState(existingEntry?.mood || '😊')
  const [category, setCategory] = useState(existingEntry?.category || 'Personal')
  const [image, setImage] = useState<string | null>(existingEntry?.image || null)

  const [locked, setLocked] = useState(existingEntry?.locked || false)
  const [pin, setPin] = useState('')
  const [hint, setHint] = useState(existingEntry?.hint || '')

  // ✅ EDITOR
  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight,
      Underline,
      TextStyle,
      Color,
      CharacterCount.configure({
        limit: 5000,
      }),
      Placeholder.configure({
        placeholder: 'Start writing your thoughts...',
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML())
    },
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
      hint,
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

      {/* ✨ TOOLBAR */}
      <div className="flex items-center gap-2 rounded-xl border bg-gray-900 text-white px-3 py-2 shadow-sm">

        <button
          title="Bold"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={`p-2 rounded ${
            editor?.isActive('bold') ? 'bg-gray-700' : 'hover:bg-gray-700'
          }`}
        >
          <Bold size={18} />
        </button>

        <button
          title="Italic"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={`p-2 rounded ${
            editor?.isActive('italic') ? 'bg-gray-700' : 'hover:bg-gray-700'
          }`}
        >
          <Italic size={18} />
        </button>

        <button
          title="Underline"
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded ${
            editor?.isActive('underline') ? 'bg-gray-700' : 'hover:bg-gray-700'
          }`}
        >
          <UnderlineIcon size={18} />
        </button>

        <button
          title="Strike"
          onClick={() => editor?.chain().focus().toggleStrike().run()}
          className="p-2 hover:bg-gray-700 rounded"
        >
          <Strikethrough size={18} />
        </button>

        <div className="w-px h-5 bg-gray-600" />

        <button
          title="Bullet List"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className="p-2 hover:bg-gray-700 rounded"
        >
          <List size={18} />
        </button>

        <button
          title="Numbered List"
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          className="p-2 hover:bg-gray-700 rounded"
        >
          <ListOrdered size={18} />
        </button>

        <div className="w-px h-5 bg-gray-600" />

        <button
          title="Highlight"
          onClick={() => editor?.chain().focus().toggleHighlight().run()}
          className="p-2 hover:bg-gray-700 rounded"
        >
          <Highlighter size={18} />
        </button>

        {/* 🎨 COLOR PICKER */}
        <label className="p-2 hover:bg-gray-700 rounded cursor-pointer">
          <Palette size={18} />
          <input
            type="color"
            className="hidden"
            onChange={(e) => {
              if (!editor) return

              const { from, to } = editor.state.selection

              if (from === to) {
                alert('Select text first')
                return
              }

              editor.chain().focus().setColor(e.target.value).run()

              setTimeout(() => {
                editor.chain().focus().unsetColor().run()
              }, 0)
            }}
          />
        </label>

      </div>

      {/* ✍️ Editor */}
      <div className="min-h-[250px] rounded-xl border bg-white text-black p-4 shadow-sm focus-within:ring-2 focus-within:ring-gray-400">
        <EditorContent editor={editor} />
      </div>

      {/* Character Count */}
      <div className='text-sm text-gray-500 text-right'>
        {editor?.storage.characterCount.characters()} characters
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

      {/* Lock */}
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