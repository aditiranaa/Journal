import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
type Entry = {
  id: number
  title: string
  content: string
  mood: string
  category: string
  locked?: boolean
  image?: string
}
    const EntryCard = ({ entry }: { entry: Entry }) => {
    const navigate = useNavigate()

  return (
    <motion.div
      whileHover={{ scale: 1.04, y: -6 }}
      transition={{ type: "spring", stiffness: 200 }}
      onClick={() => navigate(`/entry/${entry.id}`)}
      className="
        group relative overflow-hidden rounded-2xl
        bg-white/10 backdrop-blur-xl border border-white/20
        shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]
        cursor-pointer
      "
    >

      {/* 🖼️ IMAGE */}
      {entry.image && (
        <div className="h-40 overflow-hidden">
          <img
            src={entry.image}
            alt=""
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
      )}

      {/* 🔒 LOCK OVERLAY */}
      {entry.locked && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center text-white text-lg font-semibold z-10">
          🔒 Locked
        </div>
      )}

      {/* 📄 CONTENT */}
      <div className="p-5 space-y-3">

        <h2 className="text-lg font-semibold text-white line-clamp-1">
          {entry.title}
        </h2>

        {!entry.locked && (
          <p className="text-sm text-white/70 line-clamp-3">
            {entry.content.replace(/<[^>]+>/g, "")}
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-white/60 pt-2">
          <span className="text-lg">{entry.mood}</span>

          <span className="px-2 py-1 rounded-full bg-white/20 backdrop-blur">
            {entry.category}
          </span>
        </div>
      </div>

      {/* ✨ HOVER GLOW */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none shadow-[0_0_60px_rgba(255,255,255,0.15)]" />

    </motion.div>
  )
}

export default EntryCard