import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

const Landing = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex flex-col">

      {/* 🌿 Soft background glow */}
      <div className="absolute top-[-150px] left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-green-200 opacity-30 blur-3xl rounded-full" />

      {/* Navbar */}
      <div className="flex justify-between items-center px-8 py-6 z-10">
        <h1 className="text-xl font-semibold text-gray-800">
          🌿 Journal
        </h1>

        <Button variant="outline" onClick={() => navigate("/login")}>
          Login
        </Button>
      </div>

      {/* Hero */}
      <div className="flex flex-1 items-center justify-center px-6 z-10">
        <div className="max-w-2xl text-center space-y-6">

          <h1 className="text-5xl font-bold text-gray-900 leading-tight">
            A calm place  
            <br />
            for your thoughts
          </h1>

          <p className="text-gray-600 text-lg">
            Write your mind freely.  
            Reflect, grow, and stay mindful every day.
          </p>

          <div className="flex justify-center gap-4">
            <Button
              size="lg"
              className="bg-black text-white hover:bg-gray-800"
              onClick={() => navigate("/login")}
            >
              Start Journaling
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/register")}
            >
              Create Account
            </Button>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-400 pb-6 z-10">
        Built for clarity & calm ✨
      </div>
    </div>
  )
}

export default Landing