export default function TestPage() {
  return (
    <div className="min-h-screen bg-white text-black font-mono p-8">
      <h1 className="text-2xl font-bold mb-4">LEGACY Test Page</h1>
      <p className="mb-4">If you can see this page, your deployment is working!</p>
      <div className="space-y-2">
        <p>✅ Next.js App Router is working</p>
        <p>✅ Vercel deployment is successful</p>
        <p>✅ Static files are being served</p>
      </div>
      <div className="mt-8">
        <a 
          href="/" 
          className="bg-black text-white px-4 py-2 hover:bg-gray-800 transition-colors"
        >
          Go to Home Page
        </a>
      </div>
    </div>
  )
}
