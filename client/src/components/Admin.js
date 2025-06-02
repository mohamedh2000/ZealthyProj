import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../config';

const Admin = () => {
  const [config, setConfig] = useState({
    page2: ['aboutMe', 'birthdate'],
    page3: ['address']
  });
  const [validationError, setValidationError] = useState('');

  const availableComponents = [
    { id: 'aboutMe', label: 'About Me' },
    { id: 'birthdate', label: 'Birthdate' },
    { id: 'address', label: 'Address' }
  ];

  useEffect(() => {
    // Fetch current configuration from backend
    fetch(`${API_BASE_URL}/api/admin/config`)
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(err => console.error('Error fetching config:', err));
  }, []);

  const handleComponentMove = (componentId, fromPage, toPage) => {
    setConfig(prev => {
      const newConfig = { ...prev };
      
      // Remove from current page
      newConfig[fromPage] = prev[fromPage].filter(id => id !== componentId);
      
      // Add to new page
      newConfig[toPage] = [...prev[toPage], componentId];
      
      return newConfig;
    });
  };

  const isValidConfig = config.page2.length > 0 && config.page3.length > 0;

  const handleSave = async () => {
    setValidationError('');
    if (!isValidConfig) {
      setValidationError('Both Page 2 and Page 3 must have at least one component.');
      alert('Both Page 2 and Page 3 must have at least one component.');
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });
      
      if (response.ok) {
        alert('Configuration saved successfully!');
      }
    } catch (error) {
      console.error('Error saving configuration:', error);
      alert('Error saving configuration');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Configuration</h1>
        
        <div className="grid grid-cols-2 gap-8">
          {/* Page 2 Configuration */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Page 2 Components</h2>
            <div className="space-y-4">
              {config.page2.map(componentId => {
                const component = availableComponents.find(c => c.id === componentId);
                return (
                  <div key={componentId} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span>{component.label}</span>
                    <button
                      onClick={() => handleComponentMove(componentId, 'page2', 'page3')}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      Move to Page 3
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Page 3 Configuration */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Page 3 Components</h2>
            <div className="space-y-4">
              {config.page3.map(componentId => {
                const component = availableComponents.find(c => c.id === componentId);
                return (
                  <div key={componentId} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span>{component.label}</span>
                    <button
                      onClick={() => handleComponentMove(componentId, 'page3', 'page2')}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      Move to Page 2
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {validationError && (
          <div className="text-red-600 text-sm mt-4 text-right">{validationError}</div>
        )}

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            className={`px-6 py-2 rounded-md ${isValidConfig ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            disabled={!isValidConfig}
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};

export default Admin; 