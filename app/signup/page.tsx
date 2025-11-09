// app/signup/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { signIn } from "next-auth/react"

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

  // Auto-generate slug from company name
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

  // Validate slug
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

      // Auto login after signup
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
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 space-y-4">
          <h1 className="text-2xl font-bold text-center mb-6">Create Your Account</h1>
          
          <div>
            <label className="block text-sm font-medium mb-2">Email *</label>
            <Input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password *</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Your Name</label>
            <Input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Company Name *</label>
            <Input
              type="text"
              placeholder="Acme Corp"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Company Slug *</label>
            <Input
              type="text"
              placeholder="acme-corp"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Your careers page will be at: /{slug}/careers
            </p>
            {checkingSlug && <p className="text-xs text-gray-500 mt-1">Checking availability...</p>}
            {slugError && <p className="text-xs text-red-500 mt-1">{slugError}</p>}
            {!checkingSlug && slug && !slugError && (
              <p className="text-xs text-green-600 mt-1">✓ Available</p>
            )}
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <Button type="submit" className="w-full" disabled={loading || checkingSlug || !!slugError}>
            {loading ? "Creating account..." : "Sign Up"}
          </Button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline font-medium">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}