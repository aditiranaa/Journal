import { useNavigate } from "react-router"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Entry } from "@/context/journal-context"

const EntryCard = ({ entry }: { entry: Entry }) => {
  const navigate = useNavigate()

  return (
    <Card
      onClick={() => navigate(`/entry/${entry.id}`)}
      className="cursor-pointer hover:shadow-lg transition"
    >
      <CardHeader>
        <CardTitle>
          {entry.title} {entry.locked && "🔒"}
        </CardTitle>
      </CardHeader>

      {/* IMAGE */}
      {entry.image && (
        <img
          src={entry.image}
          alt="entry"
          className={`w-full h-40 object-cover rounded-md ${
            entry.locked ? "blur-sm" : ""
          }`}
        />
      )}

      <CardContent>
        {/* CONTENT */}
        {entry.locked ? (
          <p className="text-sm text-gray-400 italic">
            🔒 Locked entry
          </p>
        ) : (
          <p className="text-sm text-gray-500 line-clamp-2">
            {entry.content}
          </p>
        )}

        {/* META */}
        <div className="flex justify-between mt-4 text-xs text-gray-400">
          <span>{entry.mood}</span>
          <span>{entry.category}</span>
          <span>{entry.date}</span>
        </div>
      </CardContent>
    </Card>
  )
}

export default EntryCard