import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { PlusIcon, RotateCcwIcon } from "lucide-react";
import type { DailyPushups } from '@/types';

export default function DailyTally() {
  const [tallyData, setTallyData] = useState<DailyPushups[]>([]);
  const [todayCount, setTodayCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [todayDate, setTodayDate] = useState<string>("");
  
  // Get today's date in YYYY-MM-DD format
  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };
  
  // Format date for display (e.g., "March 19, 2025")
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
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
  
  const reset = () => {
    if (todayCount !== null) {
      updateTodayCount(0);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardContent>
        <div className="text-center">
          <div className="text-6xl font-bold my-8">
            {isLoading ? (
              <div className="h-16 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-t-primary rounded-full animate-spin"></div>
              </div>
            ) : (
              todayCount
            )}
          </div>
        </div>
        
        {/* Large increment button */}
        <Button 
          variant="default"
          size="lg"
          onClick={increment}
          aria-label="Add one push-up"
          className="w-full h-20 rounded-lg text-xl bg-green-500 hover:bg-green-600 transition-all hover:scale-105"
          disabled={isLoading}
        >
          <PlusIcon className="h-12 w-12" />
        </Button>
        
        {/* Small reset button */}
        <div className="mt-6 text-center">
          <Button 
            variant="outline"
            size="sm"
            onClick={reset}
            aria-label="Reset count"
            disabled={isLoading}
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