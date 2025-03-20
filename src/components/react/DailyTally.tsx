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
  const [todayCount, setTodayCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get today's date in YYYY-MM-DD format
  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Load tally data from localStorage on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      try {
        const savedData = localStorage.getItem('pushups');
        
        if (savedData) {
          const parsedData = JSON.parse(savedData) as DailyPushups[];
          setTallyData(parsedData);
          
          // Find today's entry if it exists
          const todayStr = getTodayString();
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
  
  const decrement = () => {
    if (todayCount !== null) {
      updateTodayCount(Math.max(0, todayCount - 1));
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl text-center">Today</CardTitle>
      </CardHeader>
      
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
        
        <div className="flex justify-center gap-4">
          <Button 
            variant="destructive"
            size="lg"
            onClick={decrement}
            aria-label="Decrease count"
            className="h-14 w-14 rounded-full text-xl p-0"
            disabled={isLoading}
          >
            <MinusIcon className="h-6 w-6" />
          </Button>
          
          <Button 
            variant="default"
            size="lg"
            onClick={increment}
            aria-label="Increase count"
            className="h-14 w-14 rounded-full text-xl p-0 bg-green-500 hover:bg-green-600"
            disabled={isLoading}
          >
            <PlusIcon className="h-6 w-6" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}