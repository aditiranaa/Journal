import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

const Landing = () => {
  const navigate = useNavigate()

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f8fafc] text-gray-900">

      {/* 🌿 Background Glow */}
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-green-200 opacity-30 blur-3xl rounded-full" />
      <div className="absolute bottom-[-150px] right-[-100px] w-[500px] h-[500px] bg-blue-200 opacity-20 blur-3xl rounded-full" />

      {/* Navbar */}
      <div className="relative z-10 flex justify-between items-center px-10 py-6 bg-white/50 backdrop-blur-lg border-b border-white/30">
        <h1 className="text-xl font-semibold tracking-tight">
          🌿 Journal
        </h1>

        <Button
          variant="outline"
          className="rounded-full px-6"
          onClick={() => navigate("/login")}
        >
          Login
        </Button>
      </div>

      {/* Hero */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 mt-20">

        <h1 className="text-5xl md:text-6xl font-semibold leading-tight max-w-3xl">
          A quiet place  
          <br />
          to meet your thoughts
        </h1>

        <p className="mt-6 text-lg text-gray-600 max-w-xl">
          Write freely. Reflect deeply.  
          A calm journaling space designed for clarity and growth.
        </p>

        <div className="mt-8 flex gap-4">
          <Button
            size="lg"
            className="rounded-full px-8 bg-black text-white hover:bg-gray-800 transition-all"
            onClick={() => navigate("/login")}
          >
            Start Writing
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="rounded-full px-8"
            onClick={() => navigate("/register")}
          >
            Create Account
          </Button>
        </div>
      </div>

      {/* ✨ Feature Section */}
      <div className="relative z-10 mt-32 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">

      <div className="bg-white/50 backdrop-blur-lg border border-white/30 p-6 rounded-2xl shadow-sm hover:shadow-md transition">            <h3 className="font-semibold text-lg">Private & Secure</h3>
            <p className="text-sm text-gray-600 mt-2">
              Your thoughts are yours alone. Protected and encrypted.
            </p>
          </div>

          <div className="bg-white/50 backdrop-blur-lg border border-white/30 p-6 rounded-2xl shadow-sm hover:shadow-md transition">            <h3 className="font-semibold text-lg">Beautiful Writing</h3>
            <p className="text-sm text-gray-600 mt-2">
              Clean editor with formatting that feels natural.
            </p>
          </div>

          <div className="bg-white/50 backdrop-blur-lg border border-white/30 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
            <h3 className="font-semibold text-lg">Daily Reflection</h3>
            <p className="text-sm text-gray-600 mt-2">
              Build a habit of mindfulness and clarity.
            </p>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 mt-32 text-center text-sm text-gray-400 pb-8">
        Designed for calm minds ✨
      </div>
    </div>
  )
}

export default Landing