import Link from 'next/link'

function Error({ statusCode }) {
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
        <h1 style={{ fontSize: '3.75rem', fontWeight: 'bold', color: '#eab308', marginBottom: '1rem' }}>
          {statusCode || 'Error'}
        </h1>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>
          {statusCode
            ? `An error ${statusCode} occurred on server`
            : 'An error occurred on client'}
        </h2>
        <p style={{ color: '#9ca3af', marginBottom: '1.5rem' }}>
          Something went wrong. Please try again later.
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

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error

