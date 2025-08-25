import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BarChart3, TrendingUp, Users, Zap } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Onboarding Analyzer</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button asChild variant="ghost">
              <Link href="/auth/login">Sign in</Link>
            </Button>
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/auth/sign-up">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Optimize Your Onboarding Funnel with <span className="text-blue-600">AI-Powered Insights</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Identify drop-off points, understand user behavior, and get actionable recommendations to improve your
            onboarding conversion rates.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 h-12 px-8">
              <Link href="/auth/sign-up">Start analyzing for free</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 px-8 bg-transparent">
              <Link href="/auth/login">Sign in</Link>
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Funnel Analysis</h3>
            <p className="text-gray-600">
              Track user progression through your onboarding steps and identify where users drop off.
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Insights</h3>
            <p className="text-gray-600">
              Get intelligent recommendations powered by AI to optimize your onboarding flow.
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">User Behavior</h3>
            <p className="text-gray-600">
              Understand user patterns and behaviors to create more effective onboarding experiences.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
