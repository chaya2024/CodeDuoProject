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
      const { data, error } = await supabase.from('companies').select('count').limit(1);
      
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

  const testAuthConfig = async () => {
    setTesting(true);
    setResult("");
    
    try {
      console.log('Testing auth configuration...');
      
      // Try to get auth config/settings
      const response = await fetch(`${supabase.supabaseUrl}/auth/v1/settings`, {
        headers: {
          'apikey': supabase.supabaseKey || '',
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        const config = await response.json();
        console.log('Auth config:', config);
        setResult(`✅ Auth enabled. Sign-up: ${config.sign_up_enabled ? 'Enabled' : 'Disabled'}`);
      } else {
        console.error('Auth config error:', response.status, response.statusText);
        setResult(`❌ Auth config error: ${response.status} ${response.statusText}`);
      }
    } catch (error: any) {
      console.error('Test auth config error:', error);
      setResult(`Auth Config Error: ${error.message}`);
    } finally {
      setTesting(false);
    }
  };

  const testSignUpDirect = async () => {
    setTesting(true);
    setResult("");
    
    try {
      console.log('Testing direct signup...');
      
      // Try a test signup with fake email
      const testEmail = `test-${Date.now()}@example.com`;
      const testPassword = 'TestPassword123!';
      
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
      });
      
      if (error) {
        console.error('Direct signup error:', error);
        setResult(`❌ Signup Error: ${error.message}`);
        
        // Additional error info
        if (error.message.includes('Email rate limit exceeded')) {
          setResult(prev => prev + '\nℹ️ This means auth is working but rate limited');
        } else if (error.message.includes('signup is disabled')) {
          setResult(prev => prev + '\nℹ️ Signup is disabled in Supabase settings');
        }
      } else {
        console.log('Direct signup result:', data);
        setResult(`✅ Signup works! User: ${data.user?.email || 'Created'}`);
      }
    } catch (error: any) {
      console.error('Test signup error:', error);
      setResult(`Signup Network Error: ${error.message}`);
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

          <Button 
            onClick={testAuthConfig} 
            disabled={testing}
            variant="secondary"
            className="w-full"
          >
            {testing ? "Testing Config..." : "Test Auth Configuration"}
          </Button>

          <Button 
            onClick={testSignUpDirect} 
            disabled={testing}
            variant="destructive"
            className="w-full"
          >
            {testing ? "Testing Signup..." : "Test Signup (Debug)"}
          </Button>
        </div>
        
        {result && (
          <div className="p-3 rounded bg-muted text-sm whitespace-pre-line">
            <strong>Result:</strong><br />
            {result}
          </div>
        )}
        
        <div className="text-xs text-muted-foreground">
          <p><strong>Supabase URL:</strong> {supabase.supabaseUrl}</p>
          <p><strong>Key Length:</strong> {supabase.supabaseKey?.length || 0} chars</p>
          <p><strong>Environment:</strong> {import.meta.env.MODE}</p>
        </div>
      </CardContent>
    </Card>
  );
};