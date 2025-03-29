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
  
  // Get today's date in YYYY-MM-DD format
  const getTodayString = () => {
    // Create date object for today
    const today = new Date();
    
    // Get date components in local timezone
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    
    // Format as YYYY-MM-DD
    return `${year}-${month}-${day}`;
  };
  
  // Format date for display (e.g., "March 19, 2025")
  const formatDate = (dateString: string) => {
    // Add time component to ensure consistent parsing
    const date = new Date(`${dateString}T12:00:00`);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Load tally data from localStorage on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      try {
        // Set today's formatted date
        const todayStr = getTodayString();
        setTodayDate(formatDate(todayStr));
        
        const savedData = localStorage.getItem('pushups');
        
        if (savedData) {
          const parsedData = JSON.parse(savedData) as DailyPushups[];
          setTallyData(parsedData);
          
          // Find today's entry if it exists
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

  // Save tally data to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading && todayCount !== null) {
      localStorage.setItem('pushups', JSON.stringify(tallyData));
    }
  }, [tallyData, isLoading, todayCount]);

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

  const increment = () => {
    if (todayCount !== null) {
      updateTodayCount(todayCount + 1);
    }
  };
  
  // New decrement function
  const decrement = () => {
    if (todayCount !== null && todayCount > 0) {
      updateTodayCount(todayCount - 1);
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
        
        {/* Button row for increment/decrement */}
        <div className="grid grid-cols-2 gap-2">
          {/* Decrement button */}
          <Button 
            variant="outline"
            size="lg"
            onClick={decrement}
            aria-label="Remove one push-up"
            className="h-20 rounded-lg text-xl border-red-300 dark:border-red-700 hover:bg-red-100 dark:hover:bg-red-900 transition-all"
            disabled={isLoading || todayCount === 0}
          >
            <MinusIcon className="h-8 w-8" />
          </Button>
          
          {/* Increment button */}
          <Button 
            variant="default"
            size="lg"
            onClick={increment}
            aria-label="Add one push-up"
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