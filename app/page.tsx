import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'LEGACY - Redirecting...',
}

export default function RootPage() {
  return (
    <html>
      <head>
        <meta httpEquiv="refresh" content="0; url=/home" />
        <script dangerouslySetInnerHTML={{
          __html: `window.location.replace('/home')`
        }} />
      </head>
      <body>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'monospace',
          backgroundColor: 'white',
          color: 'black'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '32px',
              height: '32px',
              border: '2px solid black',
              borderTop: '2px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px'
            }}></div>
            <p style={{
              fontSize: '14px',
              letterSpacing: '2px',
              textTransform: 'uppercase'
            }}>
              Redirecting...
            </p>
          </div>
        </div>
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `
        }} />
      </body>
    </html>
  )
}
