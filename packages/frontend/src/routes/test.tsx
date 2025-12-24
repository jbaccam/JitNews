import { createFileRoute } from '@tanstack/react-router';
import { trpc } from '../lib/trpc';

export const Route = createFileRoute('/test')({
  component: TestBoth,
});

function TestBoth() {
  const { data, isLoading, error } = trpc.news.testBoth.useQuery({
    query: 'climate'
  });

  if (isLoading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Loading news from NewsAPI and Guardian...</h2>
        <p>Fetching climate articles from both sources...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '40px', color: 'red' }}>
        <h2>Error!</h2>
        <p>{error.message}</p>
        <details>
          <summary>Error Details</summary>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </details>
      </div>
    );
  }

  return (
    <div style={{
      padding: '40px',
      fontFamily: 'Georgia, serif',
      maxWidth: '1400px',
      margin: '0 auto'
    }}>
      <h1 style={{
        fontSize: '48px',
        borderBottom: '3px solid black',
        paddingBottom: '10px',
        marginBottom: '20px'
      }}>
        📰 News Aggregation Test
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '30px',
        marginBottom: '30px'
      }}>
        {/* NewsAPI Summary */}
        <div style={{
          padding: '15px',
          backgroundColor: '#e3f2fd',
          border: '2px solid #1976d2'
        }}>
          <h3 style={{ margin: '0 0 10px 0' }}>NewsAPI</h3>
          <p><strong>Articles Found:</strong> {data?.newsApi.count}</p>
          <p><strong>Showing:</strong> First 5 articles</p>
        </div>

        {/* Guardian Summary */}
        <div style={{
          padding: '15px',
          backgroundColor: '#fff3e0',
          border: '2px solid #f57c00'
        }}>
          <h3 style={{ margin: '0 0 10px 0' }}>The Guardian</h3>
          <p><strong>Articles Found:</strong> {data?.guardian.count}</p>
          <p><strong>Showing:</strong> First 5 articles</p>
        </div>
      </div>

      {/* Side-by-side articles */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '30px'
      }}>
        {/* NewsAPI Articles */}
        <div>
          <h2 style={{
            fontSize: '28px',
            borderBottom: '2px solid #1976d2',
            paddingBottom: '10px',
            color: '#1976d2'
          }}>
            NewsAPI Articles
          </h2>
          {data?.newsApi.articles.map((article, i) => (
            <div
              key={i}
              style={{
                border: '2px solid #1976d2',
                marginTop: '20px',
                padding: '15px',
                backgroundColor: 'white'
              }}
            >
              <div style={{
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: '#1976d2',
                marginBottom: '8px'
              }}>
                {article.sourceName}
              </div>

              <h3 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                marginBottom: '8px',
                lineHeight: '1.3'
              }}>
                {article.title}
              </h3>

              <div style={{
                fontSize: '12px',
                color: '#666',
                marginBottom: '10px'
              }}>
                {new Date(article.publishedAt).toLocaleDateString()}
              </div>

              <p style={{
                lineHeight: '1.5',
                fontSize: '14px',
                marginBottom: '10px'
              }}>
                {article.content.slice(0, 200)}...
              </p>

              {article.imageUrl && (
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  style={{
                    width: '100%',
                    maxHeight: '150px',
                    objectFit: 'cover',
                    marginBottom: '10px'
                  }}
                />
              )}

              <a
                href={article.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  padding: '8px 16px',
                  backgroundColor: '#1976d2',
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}
              >
                Read More →
              </a>
            </div>
          ))}
        </div>

        {/* Guardian Articles */}
        <div>
          <h2 style={{
            fontSize: '28px',
            borderBottom: '2px solid #f57c00',
            paddingBottom: '10px',
            color: '#f57c00'
          }}>
            Guardian Articles
          </h2>
          {data?.guardian.articles.map((article, i) => (
            <div
              key={i}
              style={{
                border: '2px solid #f57c00',
                marginTop: '20px',
                padding: '15px',
                backgroundColor: 'white'
              }}
            >
              <div style={{
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: '#f57c00',
                marginBottom: '8px'
              }}>
                {article.sourceName}
              </div>

              <h3 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                marginBottom: '8px',
                lineHeight: '1.3'
              }}>
                {article.title}
              </h3>

              <div style={{
                fontSize: '12px',
                color: '#666',
                marginBottom: '10px'
              }}>
                {new Date(article.publishedAt).toLocaleDateString()}
              </div>

              <p style={{
                lineHeight: '1.5',
                fontSize: '14px',
                marginBottom: '10px'
              }}>
                {article.content.slice(0, 200)}...
              </p>

              {article.imageUrl && (
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  style={{
                    width: '100%',
                    maxHeight: '150px',
                    objectFit: 'cover',
                    marginBottom: '10px'
                  }}
                />
              )}

              <a
                href={article.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  padding: '8px 16px',
                  backgroundColor: '#f57c00',
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}
              >
                Read More →
              </a>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        marginTop: '40px',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        border: '1px solid #ddd'
      }}>
      </div>
    </div>
  );
}
