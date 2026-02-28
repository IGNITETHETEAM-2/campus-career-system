import fetch from 'node-fetch';

const API_URL = 'https://backend-rho-neon-47.vercel.app/api';

const testAuth = async () => {
  console.log('🧪 Testing Authentication...\n');

  // Test admin login
  try {
    console.log('Testing Admin Login...');
    const adminResponse = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'mohammedmuzhirtaha@gmail.com',
        password: 'muzhir123'
      })
    });

    const adminData = await adminResponse.json();
    if (adminResponse.ok) {
      console.log('✅ Admin login successful:', adminData.user.role);
    } else {
      console.log('❌ Admin login failed:', adminData.message);
    }
  } catch (error) {
    console.log('❌ Admin login error:', error.message);
  }

  // Test student login
  try {
    console.log('\nTesting Student Login...');
    const studentResponse = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'mohammed@gmail.com',
        password: 'muzhir123'
      })
    });

    const studentData = await studentResponse.json();
    if (studentResponse.ok) {
      console.log('✅ Student login successful:', studentData.user.role);
    } else {
      console.log('❌ Student login failed:', studentData.message);
    }
  } catch (error) {
    console.log('❌ Student login error:', error.message);
  }

  // Test health endpoint
  try {
    console.log('\nTesting Backend Health...');
    const healthResponse = await fetch(`${API_URL}/health`);
    const healthData = await healthResponse.json();
    if (healthResponse.ok) {
      console.log('✅ Backend health check passed:', healthData.status);
    } else {
      console.log('❌ Backend health check failed');
    }
  } catch (error) {
    console.log('❌ Backend health check error:', error.message);
  }
};

testAuth();