import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { PlusIcon, MinusIcon, RotateCcwIcon } from "lucide-react";
import type { DailyPushups } from '@/types';

export default function DailyTally() {
  const [tallyData, setTallyData] = useState<DailyPushups[]>([]);
  const [todayCount, setTodayCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [todayDate, setTodayDate] = useState<string>("");
  const [interval, setInterval] = useState<number>(1); // New state for INTERVAL

  // Get today's date in YYYY-MM-DD format
  const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Format date for display (e.g., "March 19, 2025")
  const formatDate = (dateString: string) => {
    const date = new Date(`${dateString}T12:00:00`);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const todayStr = getTodayString();
        setTodayDate(formatDate(todayStr));
        const savedData = localStorage.getItem('pushups');
        if (savedData) {
          const parsedData = JSON.parse(savedData) as DailyPushups[];
          setTallyData(parsedData);
          const todayEntry = parsedData.find(entry => entry.day === todayStr);
          if (todayEntry) {
            setTodayCount(todayEntry.number);
          } else {
            setTodayCount(0);
          }
        } else {
          setTodayCount(0);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        setTodayCount(0);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!isLoading && todayCount !== null) {
      localStorage.setItem('pushups', JSON.stringify(tallyData));
    }
  }, [tallyData, isLoading, todayCount]);

  const updateTodayCount = (newCount: number) => {
    const todayStr = getTodayString();
    setTodayCount(newCount);
    setTallyData(prevData => {
      const newData = [...prevData];
      const todayIndex = newData.findIndex(entry => entry.day === todayStr);
      if (todayIndex >= 0) {
        newData[todayIndex] = { ...newData[todayIndex], number: newCount };
      } else {
        newData.push({ day: todayStr, number: newCount });
      }
      return newData;
    });
  };

  const increment = () => {
    if (todayCount !== null) {
      updateTodayCount(todayCount + interval); // Use INTERVAL
    }
  };

  const decrement = () => {
    if (todayCount !== null && todayCount > 0) {
      updateTodayCount(Math.max(0, todayCount - interval)); // Use INTERVAL
    }
  };

  const reset = () => {
    if (todayCount !== null) {
      updateTodayCount(0);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl text-muted-foreground text-center">Today</CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-6">
        <div className="text-center">
          <div className="text-6xl font-bold my-4">
            {isLoading ? (
              <div className="h-16 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-t-primary rounded-full animate-spin"></div>
              </div>
            ) : (
              todayCount
            )}
          </div>
        </div>

        {/* Interval Picker */}
        <div className="text-center">
          <label htmlFor="interval" className="block text-sm font-medium text-muted-foreground">
            Set Interval
          </label>
          <select
            id="interval"
            value={interval}
            onChange={(e) => setInterval(Number(e.target.value))}
            className="mt-1 block w-1/2 mx-auto rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          >
            <option value={1}>1</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </select>
        </div>
        
        {/* Button row for increment/decrement */}
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline"
            size="lg"
            onClick={decrement}
            aria-label="Remove push-ups"
            className="h-20 rounded-lg text-xl border-red-300 dark:border-red-700 hover:bg-red-100 dark:hover:bg-red-900 transition-all"
            disabled={isLoading || todayCount === 0}
          >
            <MinusIcon className="h-8 w-8" />
          </Button>
          
          <Button 
            variant="default"
            size="lg"
            onClick={increment}
            aria-label="Add push-ups"
            className="h-20 rounded-lg text-xl bg-green-500 hover:bg-green-600 transition-all hover:scale-105"
            disabled={isLoading}
          >
            <PlusIcon className="h-8 w-8" />
          </Button>
        </div>
        
        {/* Small reset button */}
        <div className="text-center pt-2">
          <Button 
            variant="outline"
            size="sm"
            onClick={reset}
            aria-label="Reset count"
            disabled={isLoading || todayCount === 0}
            className="px-3 py-1 text-xs"
          >
            <RotateCcwIcon className="h-3 w-3 mr-1" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}