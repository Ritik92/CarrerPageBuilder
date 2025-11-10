// app/page.tsx
import { auth } from "@/auth"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { SignOutButton } from "@/components/ui/SignOutButton"
import { 
  ArrowRight, 
  Briefcase, 
  Users, 
  Settings, 
  TrendingUp,
  Sparkles,
  Eye,
  FileText,
  BarChart3
} from "lucide-react"

export default async function Home() {
  const session = await auth()

  if (session?.user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50">
        {/* Header */}
        <header className="border-b bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-slate-900">Talent Hub</span>
              </div>
              <SignOutButton />
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-12">
          {/* Welcome Section */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
              <span className="text-sm font-medium text-teal-700">Active Account</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">
              Welcome back, <span className="text-teal-600">{session.user.name || 'there'}</span>
            </h1>
            <p className="text-lg text-slate-600">{session.user.email}</p>
          </div>

          {session.user.companySlug ? (
            <>
              {/* Quick Actions */}
              <div className="grid md:grid-cols-2 gap-6 mb-12">
                <Link href={`/${session.user.companySlug}/edit`}>
                  <Card className="p-6 hover:shadow-lg transition-all border-2 hover:border-teal-200 cursor-pointer group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="h-12 w-12 rounded-lg bg-teal-100 flex items-center justify-center group-hover:bg-teal-500 transition-colors">
                        <Settings className="h-6 w-6 text-teal-600 group-hover:text-white transition-colors" />
                      </div>
                      <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Manage Dashboard</h3>
                    <p className="text-slate-600">
                      Edit branding, content sections, and job listings
                    </p>
                  </Card>
                </Link>

                <Link href={`/${session.user.companySlug}/careers`}>
                  <Card className="p-6 hover:shadow-lg transition-all border-2 hover:border-cyan-200 cursor-pointer group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="h-12 w-12 rounded-lg bg-cyan-100 flex items-center justify-center group-hover:bg-cyan-500 transition-colors">
                        <Eye className="h-6 w-6 text-cyan-600 group-hover:text-white transition-colors" />
                      </div>
                      <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-cyan-600 group-hover:translate-x-1 transition-all" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">View Live Page</h3>
                    <p className="text-slate-600">
                      See your published careers page as candidates see it
                    </p>
                  </Card>
                </Link>
              </div>
            </>
          ) : (
            <Card className="p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="h-16 w-16 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-6">
                  <Briefcase className="h-8 w-8 text-teal-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  Complete Your Setup
                </h2>
                <p className="text-slate-600 mb-6">
                  Create your company profile to start building your careers page
                </p>
                <Button size="lg">
                  Set Up Company
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-slate-900">Talent Hub</span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" className="hidden sm:inline-flex">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-teal-600 hover:bg-teal-700">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-white to-cyan-50 -z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(20,184,166,0.1),transparent_50%)] -z-10" />
        
        <div className="container mx-auto px-4 pt-20 pb-32">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-100 text-teal-700 text-sm font-medium mb-8">
              <Sparkles className="h-4 w-4" />
              Build your careers page in minutes
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight">
              Attract top talent with a
              <span className="block text-teal-600">stunning careers page</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 mb-10 max-w-2xl">
              Create a branded, mobile-optimized careers page that showcases your company culture and open positions—no coding required.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signup">
                <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-lg h-14 px-8 w-full sm:w-auto">
                  Start Building Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="text-lg h-14 px-8 w-full sm:w-auto">
                  Sign In
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center gap-6 mt-8 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-teal-100 flex items-center justify-center">
                  <span className="text-teal-600 text-xs">✓</span>
                </div>
                <span>Free forever</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-teal-100 flex items-center justify-center">
                  <span className="text-teal-600 text-xs">✓</span>
                </div>
                <span>No credit card</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-teal-100 flex items-center justify-center">
                  <span className="text-teal-600 text-xs">✓</span>
                </div>
                <span>5 min setup</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Everything you need to hire better
            </h2>
            <p className="text-lg text-slate-600">
              Powerful tools to create careers pages that candidates actually want to visit
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group">
              <div className="bg-white p-8 rounded-2xl border-2 border-slate-200 hover:border-teal-300 transition-all h-full">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center mb-6">
                  <Briefcase className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Smart Job Listings</h3>
                <p className="text-slate-600 leading-relaxed">
                  Add unlimited jobs with rich descriptions, filters by location, type, and department. Candidates find what they're looking for instantly.
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-white p-8 rounded-2xl border-2 border-slate-200 hover:border-cyan-300 transition-all h-full">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center mb-6">
                  <Sparkles className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Full Customization</h3>
                <p className="text-slate-600 leading-relaxed">
                  Your brand, your way. Upload logos, banners, videos. Choose colors. Add custom content sections. Make it uniquely yours.
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-white p-8 rounded-2xl border-2 border-slate-200 hover:border-orange-300 transition-all h-full">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-6">
                  <BarChart3 className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Mobile Optimized</h3>
                <p className="text-slate-600 leading-relaxed">
                  Perfect on every device. Your careers page looks stunning whether candidates browse on phone, tablet, or desktop.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-16 text-center">
              Launch in three simple steps
            </h2>

            <div className="space-y-16">
              <div className="flex gap-8 items-start">
                <div className="flex-shrink-0">
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                    1
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">Sign up & create your company</h3>
                  <p className="text-lg text-slate-600">
                    Quick signup with email. Add your company name and you're ready to build.
                  </p>
                </div>
              </div>

              <div className="flex gap-8 items-start">
                <div className="flex-shrink-0">
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                    2
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">Customize your page</h3>
                  <p className="text-lg text-slate-600">
                    Upload branding, write about your culture, add job listings. Drag, drop, done.
                  </p>
                </div>
              </div>

              <div className="flex gap-8 items-start">
                <div className="flex-shrink-0">
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                    3
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">Publish & share</h3>
                  <p className="text-lg text-slate-600">
                    Hit publish and share your unique URL. Start attracting candidates immediately.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(20,184,166,0.15),transparent_50%)]" />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to build your careers page?
            </h2>
            <p className="text-xl text-slate-300 mb-10">
              Join companies already using Talent Hub to attract top talent
            </p>
            <Link href="/signup">
              <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-lg h-14 px-10">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 border-t py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">Talent Hub</span>
            </div>
            <p className="text-sm text-slate-600">
              © {new Date().getFullYear()} Talent Hub. Built for recruiters who care.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}