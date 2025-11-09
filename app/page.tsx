// app/page.tsx
import { auth } from "@/auth"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SignOutButton } from "@/components/ui/SignOutButton"

export default async function Home() {
  const session = await auth()

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-4xl font-bold">Careers Page Builder</h1>
        
        {session?.user ? (
          <div className="space-y-4">
            <p className="text-gray-600">
              Welcome back, <span className="font-medium">{session.user.email}</span>
            </p>
            
            {session.user.companySlug && (
              <div className="space-y-2">
                <Link href={`/${session.user.companySlug}/edit`}>
                  <Button size="lg">Go to Dashboard</Button>
                </Link>
                <div>
                  <Link 
                    href={`/${session.user.companySlug}/careers`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View your careers page
                  </Link>
                </div>
              </div>
            )}
            
            <SignOutButton />
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-600">Build beautiful careers pages for your company</p>
            <div className="flex gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline">Login</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}