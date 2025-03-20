import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { MinusIcon, PlusIcon, RotateCcwIcon } from "lucide-react";

interface DailyPushups {
  day: string;
  number: number;
}

export default function DailyTally() {
  const [tallyData, setTallyData] = useState<DailyPushups[]>([]);
  const [todayCount, setTodayCount] = useState(0);
  
  // Get today's date in YYYY-MM-DD format
  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Load tally data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('pushups');
    if (savedData) {
      const parsedData = JSON.parse(savedData) as DailyPushups[];
      setTallyData(parsedData);
      
      // Find today's entry if it exists
      const todayStr = getTodayString();
      const todayEntry = parsedData.find(entry => entry.day === todayStr);
      if (todayEntry) {
        setTodayCount(todayEntry.number);
      }
    }
  }, []);

  // Save tally data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('pushups', JSON.stringify(tallyData));
  }, [tallyData]);

  // Update the count for today
  const updateTodayCount = (newCount: number) => {
    const todayStr = getTodayString();
    setTodayCount(newCount);
    
    setTallyData(prevData => {
      const newData = [...prevData];
      const todayIndex = newData.findIndex(entry => entry.day === todayStr);
      
      if (todayIndex >= 0) {
        // Update existing entry for today
        newData[todayIndex] = { ...newData[todayIndex], number: newCount };
      } else {
        // Create new entry for today
        newData.push({ day: todayStr, number: newCount });
      }
      
      return newData;
    });
  };

  const increment = () => updateTodayCount(todayCount + 1);
  const decrement = () => updateTodayCount(Math.max(0, todayCount - 1));
  const reset = () => updateTodayCount(0);

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl text-center">Today</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="text-center">
          <div className="text-6xl font-bold my-8">{todayCount}</div>
        </div>
        
        <div className="flex justify-center gap-4">
          <Button 
            variant="destructive"
            size="lg"
            onClick={decrement}
            aria-label="Decrease count"
            className="h-14 w-14 rounded-full text-xl p-0"
          >
            <MinusIcon className="h-6 w-6" />
          </Button>
          
          <Button 
            variant="default"
            size="lg"
            onClick={increment}
            aria-label="Increase count"
            className="h-14 w-14 rounded-full text-xl p-0 bg-green-500 hover:bg-green-600"
          >
            <PlusIcon className="h-6 w-6" />
          </Button>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-center">
        <Button 
          variant="outline"
          size="sm"
          onClick={reset}
          className="flex items-center gap-2"
        >
          <RotateCcwIcon className="h-4 w-4" />
          Reset
        </Button>
      </CardFooter>
    </Card>
  );
}