import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const SupabaseTest = () => {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<string>("");
  const { toast } = useToast();

  const testConnection = async () => {
    setTesting(true);
    setResult("");
    
    try {
      console.log('Testing Supabase connection...');
      
      // Test 1: Basic connection
      const { data, error } = await supabase.from('profiles').select('count').limit(1);
      
      if (error) {
        console.error('Supabase test error:', error);
        setResult(`Connection Error: ${error.message}`);
        toast({
          title: "Connection Test Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        console.log('Supabase connection successful:', data);
        setResult("✅ Connection successful!");
        toast({
          title: "Connection Test Passed",
          description: "Supabase is working correctly",
        });
      }
    } catch (error: any) {
      console.error('Test connection error:', error);
      setResult(`Network Error: ${error.message}`);
      toast({
        title: "Network Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setTesting(false);
    }
  };

  const testAuth = async () => {
    setTesting(true);
    setResult("");
    
    try {
      console.log('Testing auth...');
      
      // Get current user
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('Auth test error:', error);
        setResult(`Auth Error: ${error.message}`);
      } else {
        console.log('Auth test result:', user);
        setResult(user ? `✅ User logged in: ${user.email}` : "ℹ️ No user logged in");
      }
    } catch (error: any) {
      console.error('Test auth error:', error);
      setResult(`Auth Network Error: ${error.message}`);
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Supabase Connection Test</CardTitle>
        <CardDescription>
          Test the connection to Supabase database and auth
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Button 
            onClick={testConnection} 
            disabled={testing}
            className="w-full"
          >
            {testing ? "Testing Connection..." : "Test Database Connection"}
          </Button>
          
          <Button 
            onClick={testAuth} 
            disabled={testing}
            variant="outline"
            className="w-full"
          >
            {testing ? "Testing Auth..." : "Test Auth Status"}
          </Button>
        </div>
        
        {result && (
          <div className="p-3 rounded bg-muted text-sm">
            <strong>Result:</strong><br />
            {result}
          </div>
        )}
        
        <div className="text-xs text-muted-foreground">
          <p><strong>Supabase URL:</strong> {supabase.supabaseUrl}</p>
          <p><strong>Key Length:</strong> {supabase.supabaseKey?.length || 0} chars</p>
        </div>
      </CardContent>
    </Card>
  );
};