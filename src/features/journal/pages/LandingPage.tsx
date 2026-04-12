import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

const Landing = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e0f2fe] flex flex-col">

      {/* Navbar */}
      <div className="flex justify-between items-center px-8 py-4">
        <h1 className="text-xl font-semibold text-gray-800">
          🌿 Journal
        </h1>

        <Button onClick={() => navigate("/dashboard")}>
          Open App
        </Button>
      </div>

      {/* Hero */}
      <div className="flex flex-1 items-center justify-center px-6">
        <div className="max-w-2xl text-center space-y-6">

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            A calm space  
            <br />
            for your thoughts
          </h1>

          <p className="text-gray-600 text-lg">
            Write freely. Reflect deeply.  
            Your private journal, beautifully designed.
          </p>

          <div className="flex justify-center gap-4">
            <Button
              size="lg"
              className="bg-black text-white hover:bg-gray-800"
              onClick={() => navigate("/editor")}
            >
              Start Writing
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/dashboard")}
            >
              View Entries
            </Button>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-400 pb-6">
        Designed for clarity & calm ✨
      </div>
    </div>
  )
}

export default Landing