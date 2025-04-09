import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { DailyPushups } from 'src/types';

export default function PushupChart() {
  const [chartData, setChartData] = useState<DailyPushups[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const maxBarHeight = 180; // Maximum height for bars in pixels

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const savedData = localStorage.getItem('pushups');
        
        if (savedData) {
          const parsedData = JSON.parse(savedData) as DailyPushups[];
          // Sort by date and get last 7 days
          const sortedData = [...parsedData].sort((a, b) => a.day.localeCompare(b.day));
          setChartData(sortedData.slice(-7));
        }
      } catch (error) {
        console.error("Error loading chart data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Format date for display (e.g., "Mar 19")
  const formatDate = (dateString: string) => {
    const date = new Date(`${dateString}T12:00:00`);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };

  // Split month and day into separate elements
  const formatMonth = (dateString: string) => {
    const date = new Date(`${dateString}T12:00:00`);
    return date.toLocaleDateString('en-US', { month: 'short' });
  };

  const formatDay = (dateString: string) => {
    const date = new Date(`${dateString}T12:00:00`);
    return date.getDate();
  };

  // Calculate bar height in pixels
  const getBarHeight = (value: number) => {
    const max = 25; // Maximum value that would reach full height
    const ratio = Math.min(1, value / max);
    return Math.max(4, Math.round(ratio * maxBarHeight)); // At least 4px if not zero
  };

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-xl">Weekly Progress</CardTitle>
        <CardDescription>Your pushups over the last 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="h-64">
            <div className="grid grid-cols-7 gap-2 h-full">
              {chartData.map((day) => (
                <div key={day.day} className="flex flex-col items-center justify-end h-full">
                  <div className="flex-grow flex items-end w-full">
                    <div 
                      className="w-4/5 mx-auto bg-primary hover:bg-primary/90 transition-all rounded-t"
                      style={{ 
                        height: `${getBarHeight(day.number)}px`,
                        display: 'block'
                      }}
                    ></div>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground">{formatMonth(day.day)}</div>
                      <div className="text-xs font-medium">{formatDay(day.day)}</div>
                    </div>
                  </div>
                  <div className="mt-1 text-xs font-medium">
                    {day.number}
                  </div>
                </div>
              ))}
              
              {/* If we don't have 7 days of data, fill with empty bars */}
              {Array.from({ length: Math.max(0, 7 - chartData.length) }).map((_, i) => (
                <div key={`empty-${i}`} className="flex flex-col items-center justify-end h-full">
                  <div className="flex-grow flex items-end w-full">
                    <div className="w-4/5 mx-auto bg-muted h-0 rounded-t"></div>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">-</div>
                  <div className="mt-1 text-xs font-medium">0</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}