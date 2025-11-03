import Link from 'next/link'

export default function Custom404() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#000',
      color: '#e5e7eb',
      padding: '1.5rem'
    }}>
      <div style={{ maxWidth: '32rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3.75rem', fontWeight: 'bold', color: '#eab308', marginBottom: '1rem' }}>404</h1>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>Page Not Found</h2>
        <p style={{ color: '#9ca3af', marginBottom: '1.5rem' }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link 
          href="/"
          style={{
            display: 'inline-block',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.375rem',
            backgroundColor: '#eab308',
            color: '#422006',
            fontWeight: '500',
            textDecoration: 'none'
          }}
        >
          Go back home
        </Link>
      </div>
    </div>
  )
}

