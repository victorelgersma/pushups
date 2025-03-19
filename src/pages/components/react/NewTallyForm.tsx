import React, { useState } from 'react';
import { addTally } from '../../../utils/localStorage';

const NewTallyForm: React.FC = () => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate input
    if (!name.trim()) {
      setError('Please enter a name for your tally');
      return;
    }

    setIsSubmitting(true);

    try {
      // Add the new tally to localStorage
      addTally(name.trim());
      
      // Reset form and show success message
      setName('');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000); // Hide success message after 3 seconds
    } catch (err) {
      setError('Failed to create tally. Please try again.');
      console.error('Error creating tally:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-5 mb-8 border border-gray-200">
      <h2 className="text-2xl font-semibold mb-4">Create a New Tally</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="tally-name" className="block text-gray-700 mb-2">
            Tally Name
          </label>
          <input
            id="tally-name"
            type="text"
            placeholder="What do you want to count?"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting}
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Creating...' : 'Create Tally'}
        </button>
      </form>
      
      {showSuccess && (
        <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg">
          Tally created successfully! Refresh the page to see your new tally.
        </div>
      )}
    </div>
  );
};

export default NewTallyForm;