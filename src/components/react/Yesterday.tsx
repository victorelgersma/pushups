import { useState, useEffect } from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CalendarIcon } from "lucide-react";
import { TallyEntry } from '@/types';

export default function Yesterday() {
  const [yesterdayCount, setYesterdayCount] = useState<number>(0);
  const [yesterdayDate, setYesterdayDate] = useState<string>("");

  // Get yesterday's date in YYYY-MM-DD format
  const getYesterdayString = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
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

  // Load yesterday's data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('pushups');
    const yesterdayStr = getYesterdayString();
    setYesterdayDate(formatDate(yesterdayStr));
    
    if (savedData) {
      const parsedData = JSON.parse(savedData) as TallyEntry[];
      const yesterdayEntry = parsedData.find(entry => entry.day === yesterdayStr);
      
      if (yesterdayEntry) {
        setYesterdayCount(yesterdayEntry.number);
      } else {
        setYesterdayCount(0);
      }
    }
  }, []);

  return (
    <Alert className="max-w-md mx-auto mt-6">
      <CalendarIcon className="h-4 w-4" />
      <AlertTitle className="flex items-center justify-between">
      Yesterday
        <span className="text-2xl font-bold">{yesterdayCount}</span>
      </AlertTitle>
      <AlertDescription className="text-sm text-muted-foreground">
        {yesterdayDate}
      </AlertDescription>
    </Alert>
  );
}