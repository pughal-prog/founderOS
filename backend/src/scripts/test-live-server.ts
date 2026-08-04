async function testLiveServer() {
  try {
    const res = await fetch('http://localhost:5000/health');
    const data = await res.json();
    console.log('Health Endpoint:', JSON.stringify(data, null, 2));
  } catch (err: any) {
    console.error('Health request failed:', err.message);
  }

  try {
    const res = await fetch('http://localhost:5000/api/data/dashboard');
    const data = await res.json();
    console.log('Dashboard Endpoint MRR:', data.metrics?.mrr);
    console.log('Customers returned from DB:', data.customers?.length);
  } catch (err: any) {
    console.error('Dashboard request failed:', err.message);
  }
}

testLiveServer();
