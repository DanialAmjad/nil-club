export default function Home() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>NIL Club API</h1>
      <p>Welcome to the NIL Club API. The following endpoints are available:</p>

      <h2>Athletes</h2>
      <ul>
        <li>
          <strong>GET /api/athletes</strong> - List all athletes
        </li>
        <li>
          <strong>GET /api/athletes/:id</strong> - Get athlete profile
        </li>
        <li>
          <strong>GET /api/athletes/:id/deals</strong> - Get athlete's deals
        </li>
        <li>
          <strong>GET /api/athletes/:id/earnings</strong> - Get earnings summary
        </li>
      </ul>

      <h2>Payments</h2>
      <ul>
        <li>
          <strong>GET /api/deals/:id/payments</strong> - Get payment history
        </li>
      </ul>

      <h2>Example Requests</h2>
      <p>
        Get all athletes: <code>curl http://localhost:3001/api/athletes</code>
      </p>
      <p>
        Get athlete with ID 1:{' '}
        <code>curl http://localhost:3001/api/athletes/1</code>
      </p>
    </div>
  );
}
