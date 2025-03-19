import React from 'react';
import type { Tally } from '../../utils/localStorage';

interface TallyItemProps {
  tally: Tally;
  onIncrement: () => void;
  onDecrement: () => void;
  onReset: () => void;
  onDelete: () => void;
}

const TallyItem: React.FC<TallyItemProps> = ({
  tally,
  onIncrement,
  onDecrement,
  onReset,
  onDelete
}) => {
  // Format the date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-semibold">{tally.name}</h3>
        <button
          onClick={onDelete}
          className="text-gray-500 hover:text-red-500 transition-colors"
          aria-label="Delete tally"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      <div className="mb-4">
        <span className="text-sm text-gray-500">Last updated: {formatDate(tally.updatedAt)}</span>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onDecrement}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-l disabled:opacity-50"
            disabled={tally.count <= 0}
            aria-label="Decrease count"
          >
            -
          </button>
          
          <span className="text-2xl font-bold">{tally.count}</span>
          
          <button
            onClick={onIncrement}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-r"
            aria-label="Increase count"
          >
            +
          </button>
        </div>
        
        <button
          onClick={onReset}
          className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 px-3 rounded"
          disabled={tally.count === 0}
          aria-label="Reset count"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default TallyItem;