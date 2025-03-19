import React, { useState, useEffect } from 'react';
import { getTallies, updateTallyCount, removeTally, resetTally } from '../../../utils/localStorage';
import type { Tally } from '../../../utils/localStorage';
import TallyItem from './TallyItem';

const TallyList: React.FC = () => {
  const [tallies, setTallies] = useState<Tally[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Load tallies on component mount
  useEffect(() => {
    try {
      const loadedTallies = getTallies();
      setTallies(loadedTallies);
    } catch (error) {
      console.error('Failed to load tallies:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle incrementing a tally
  const handleIncrement = (id: string) => {
    const tally = tallies.find(t => t.id === id);
    if (tally) {
      const updatedTally = updateTallyCount(id, tally.count + 1);
      if (updatedTally) {
        setTallies(tallies.map(t => t.id === id ? updatedTally : t));
      }
    }
  };

  // Handle decrementing a tally
  const handleDecrement = (id: string) => {
    const tally = tallies.find(t => t.id === id);
    if (tally && tally.count > 0) {
      const updatedTally = updateTallyCount(id, tally.count - 1);
      if (updatedTally) {
        setTallies(tallies.map(t => t.id === id ? updatedTally : t));
      }
    }
  };

  // Handle resetting a tally
  const handleReset = (id: string) => {
    const updatedTally = resetTally(id);
    if (updatedTally) {
      setTallies(tallies.map(t => t.id === id ? updatedTally : t));
    }
  };

  // Handle deleting a tally
  const handleDelete = (id: string) => {
    removeTally(id);
    setTallies(tallies.filter(t => t.id !== id));
  };

  if (loading) {
    return <div className="text-center py-4">Loading tallies...</div>;
  }

  if (tallies.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">You don't have any tallies yet. Create one to get started!</p>
      </div>
    );
  }

   return (
    <div className="space-y-4">
      {tallies.map((tally) => (
        <TallyItem
          key={tally.id}
          tally={tally}
          onIncrement={() => handleIncrement(tally.id)}
          onDecrement={() => handleDecrement(tally.id)}
          onReset={() => handleReset(tally.id)}
          onDelete={() => handleDelete(tally.id)}
        />
      ))}
    </div>
  );
};

export default TallyList;