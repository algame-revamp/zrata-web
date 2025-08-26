'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [author, setAuthor] = useState('');
  const [apiStatus, setApiStatus] = useState('');

  // Test API connection on load
  useEffect(() => {
    checkApiHealth();
    fetchMessages();
  }, []);

  const checkApiHealth = async () => {
    try {
      const response = await api.get('/health');
      setApiStatus('✅ Connected to Zrata API');
    } catch (error) {
      setApiStatus('❌ Cannot connect to API');
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await api.get('/messages');
      if (response.success) {
        setMessages(response.data.messages);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const createMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await api.post('/messages', {
        text: newMessage,
        author: author || 'Anonymous'
      });

      if (response.success) {
        setNewMessage('');
        setAuthor('');
        fetchMessages(); // Refresh messages
      }
    } catch (error) {
      console.error('Failed to create message:', error);
    }
  };

  const deleteMessage = async (messageId: number) => {
    try {
      await api.delete(`/messages/${messageId}`);
      fetchMessages(); // Refresh messages
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-600 mb-2">🚀 Zrata</h1>
        <p className="text-gray-600">Learning FastAPI + Next.js</p>
        <p className="text-sm mt-2">{apiStatus}</p>
      </div>

      {/* API Testing Section */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <APITester />
        <QuickTests />
      </div>

      {/* Messages Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Messages</h2>

        {/* Create Message Form */}
        <form onSubmit={createMessage} className="mb-6 space-y-4">
          <div>
            <input
              type="text"
              placeholder="Your name (optional)"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        </form>

        {/* Messages List */}
        <div className="space-y-3">
          {messages.map((message: any) => (
            <div key={message.id} className="bg-gray-50 p-3 rounded flex justify-between items-start">
              <div>
                <p className="font-medium">{message.author}</p>
                <p className="text-gray-700">{message.text}</p>
                <p className="text-xs text-gray-500">
                  {new Date(message.timestamp * 1000).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => deleteMessage(message.id)}
                className="text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          ))}
          {messages.length === 0 && (
            <p className="text-gray-500 text-center py-8">No messages yet. Send the first one!</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Component for testing different API endpoints
function APITester() {
  const [testResults, setTestResults] = useState('');

  const testEndpoint = async (endpoint: string, method: string = 'GET') => {
    try {
      const response = await api.get(endpoint);
      setTestResults(JSON.stringify(response, null, 2));
    } catch (error) {
      setTestResults(`Error: ${error}`);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">API Tester</h3>
      <div className="space-y-2 mb-4">
        <button
          onClick={() => testEndpoint('/')}
          className="block w-full text-left px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded"
        >
          GET /
        </button>
        <button
          onClick={() => testEndpoint('/greet/FastAPI')}
          className="block w-full text-left px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded"
        >
          GET /greet/FastAPI
        </button>
        <button
          onClick={() => testEndpoint('/search?q=zrata&limit=5')}
          className="block w-full text-left px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded"
        >
          GET /search?q=zrata&limit=5
        </button>
      </div>

      {testResults && (
        <pre className="bg-gray-900 text-green-400 p-3 rounded text-xs overflow-auto max-h-40">
          {testResults}
        </pre>
      )}
    </div>
  );
}

function QuickTests() {
  const [greeting, setGreeting] = useState('');

  const getGreeting = async () => {
    try {
      const response = await api.get('/greet/Developer');
      setGreeting(response.message);
    } catch (error) {
      setGreeting('Error connecting to API');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Quick Test</h3>
      <button
        onClick={getGreeting}
        className="w-full mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Test API Connection
      </button>
      {greeting && (
        <div className="p-3 bg-green-50 border border-green-200 rounded">
          {greeting}
        </div>
      )}
    </div>
  );
}