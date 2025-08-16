"use client";

import { useState } from 'react';

export default function TestBrevoPage() {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testBrevoIntegration = async () => {
    setIsLoading(true);
    setTestResult('');

    const testData = {
      customerName: "Test Customer",
      customerCity: "Test City",
      selectedProducts: {
        borderlineBlack: {
          selected: true,
          size: "M",
          quantity: 1
        },
        spinWhite: {
          selected: true,
          size: "L",
          quantity: 2
        }
      },
      orderTotal: 598,
      subtotal: 748,
      discount: 150
    };

    try {
      const response = await fetch('/api/submit-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      });

      const result = await response.text();
      
      if (response.ok) {
        setTestResult(`✅ Success! Response: ${result}`);
      } else {
        setTestResult(`❌ Error: ${response.status} - ${result}`);
      }
    } catch (error) {
      setTestResult(`❌ Network Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Brevo Integration Test</h1>
        
        <div className="bg-white/10 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Environment Check</h2>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">BREVO_API_KEY:</span>{' '}
              {process.env.NEXT_PUBLIC_BREVO_API_KEY ? 
                <span className="text-green-400">Set ✅</span> : 
                <span className="text-red-400">Not set ❌</span>
              }
            </div>
            <div>
              <span className="font-medium">API Endpoint:</span> /api/submit-order
            </div>
          </div>
        </div>

        <div className="bg-white/10 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Data</h2>
          <pre className="text-sm bg-black/50 p-4 rounded overflow-x-auto">
{JSON.stringify({
  customerName: "Test Customer",
  customerCity: "Test City",
  selectedProducts: {
    borderlineBlack: { selected: true, size: "M", quantity: 1 },
    spinWhite: { selected: true, size: "L", quantity: 2 }
  },
  orderTotal: 598,
  subtotal: 748,
  discount: 150
}, null, 2)}
          </pre>
        </div>

        <button
          onClick={testBrevoIntegration}
          disabled={isLoading}
          className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          {isLoading ? 'Testing...' : 'Test Brevo Integration'}
        </button>

        {testResult && (
          <div className="mt-6 p-4 rounded-lg bg-black/50">
            <h3 className="font-semibold mb-2">Result:</h3>
            <pre className="text-sm whitespace-pre-wrap">{testResult}</pre>
          </div>
        )}

        <div className="mt-8 text-sm text-white/70">
          <h3 className="font-semibold mb-2">Setup Instructions:</h3>
          <ol className="list-decimal list-inside space-y-1">
            <li>Create a <code>.env.local</code> file in your project root</li>
            <li>Add your Brevo API key: <code>BREVO_API_KEY=your_key_here</code></li>
            <li>Add your Brevo list ID: <code>BREVO_LIST_ID=1</code></li>
            <li>Restart your development server</li>
            <li>Click the test button above</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
