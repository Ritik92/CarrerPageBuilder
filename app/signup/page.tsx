// app/signup/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { Briefcase, CheckCircle2, Loader2 } from "lucide-react"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [slug, setSlug] = useState("")
  const [error, setError] = useState("")
  const [slugError, setSlugError] = useState("")
  const [loading, setLoading] = useState(false)
  const [checkingSlug, setCheckingSlug] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (companyName) {
      const generatedSlug = companyName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim()
      setSlug(generatedSlug)
    }
  }, [companyName])

  useEffect(() => {
    if (!slug) {
      setSlugError("")
      return
    }

    const checkSlug = async () => {
      setCheckingSlug(true)
      try {
        const res = await fetch(`/api/auth/check-slug?slug=${slug}`)
        const data = await res.json()
        
        if (data.available) {
          setSlugError("")
        } else {
          setSlugError("This slug is already taken")
        }
      } catch (err) {
        console.error(err)
      } finally {
        setCheckingSlug(false)
      }
    }

    const timer = setTimeout(checkSlug, 500)
    return () => clearTimeout(timer)
  }, [slug])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (slugError) {
      setError("Please fix the errors before submitting")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          name: name || null,
          companyName,
          slug,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Something went wrong")
        setLoading(false)
        return
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Account created but login failed. Please login manually.")
        setLoading(false)
      } else {
        router.push(`/${slug}/edit`)
        router.refresh()
      }
    } catch (err) {
      setError("Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-teal-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-lg rounded-2xl px-8 py-10 space-y-6">
          {/* Logo */}
          <div className="flex justify-center mb-2">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
              <Briefcase className="h-7 w-7 text-white" />
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
            <p className="text-slate-600 text-sm mt-1">Start building your careers page</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700">Password *</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-700">Your Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-slate-700">Company Name *</Label>
              <Input
                id="companyName"
                type="text"
                placeholder="Acme Corp"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                disabled={loading}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug" className="text-slate-700">Company Slug *</Label>
              <Input
                id="slug"
                type="text"
                placeholder="acme-corp"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                disabled={loading}
                className="h-11"
              />
              <p className="text-xs text-slate-500">
                Your careers page: /{slug || "your-company"}/careers
              </p>
              {checkingSlug && (
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>Checking availability...</span>
                </div>
              )}
              {slugError && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <span>✕</span> {slugError}
                </p>
              )}
              {!checkingSlug && slug && !slugError && (
                <p className="text-xs text-teal-600 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Available
                </p>
              )}
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full h-11 bg-teal-600 hover:bg-teal-700" 
              disabled={loading || checkingSlug || !!slugError}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-600 pt-4 border-t">
            Already have an account?{" "}
            <Link href="/login" className="text-teal-600 hover:text-teal-700 font-medium">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}