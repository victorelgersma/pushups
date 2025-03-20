import { useState, useEffect } from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CalendarIcon } from "lucide-react";
import type { DailyPushups } from 'src/types';

export default function Yesterday() {
  const [yesterdayCount, setYesterdayCount] = useState<number | null>(null);
  const [yesterdayDate, setYesterdayDate] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  // Get yesterday's date in YYYY-MM-DD format
  const getYesterdayString = () => {
    // Create date object for yesterday at noon to avoid timezone edge cases
    const now = new Date();
    now.setHours(12, 0, 0, 0);
    now.setDate(now.getDate() - 1);
    
    // Extract just the date part (YYYY-MM-DD)
    return now.toISOString().split('T')[0];
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

  // Load yesterday's data from localStorage on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      try {
        const yesterdayStr = getYesterdayString();
        setYesterdayDate(formatDate(yesterdayStr));
        
        const savedData = localStorage.getItem('pushups');
        
        if (savedData) {
          const parsedData = JSON.parse(savedData) as DailyPushups[];
          const yesterdayEntry = parsedData.find(entry => entry.day === yesterdayStr);
          
          if (yesterdayEntry) {
            setYesterdayCount(yesterdayEntry.number);
          } else {
            setYesterdayCount(0);
          }
        } else {
          setYesterdayCount(0);
        }
      } catch (error) {
        console.error("Error loading yesterday's data:", error);
        setYesterdayCount(0);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  return (
    <Alert className="max-w-md mx-auto mt-6">
      <CalendarIcon className="h-4 w-4" />
      <AlertTitle className="flex items-center justify-between">
        Yesterday
        <span className="text-2xl font-bold">
          {isLoading ? (
            <div className="h-6 w-6 flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-t-primary rounded-full animate-spin"></div>
            </div>
          ) : (
            yesterdayCount
          )}
        </span>
      </AlertTitle>
      <AlertDescription className="text-sm text-muted-foreground">
        {yesterdayDate}
      </AlertDescription>
    </Alert>
  );
}