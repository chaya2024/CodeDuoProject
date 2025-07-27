import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const DebugAuth = () => {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('TestPassword123!');
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const { toast } = useToast();

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev]);
    console.log(message);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const testBasicSignup = async () => {
    setLoading(true);
    addLog('🚀 Starting basic signup test...');
    
    try {
      addLog(`📧 Email: ${email}`);
      addLog(`🔑 Password length: ${password.length}`);
      addLog(`🌐 Supabase URL: ${supabase.supabaseUrl}`);
      addLog(`🔐 API Key length: ${supabase.supabaseKey?.length}`);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        addLog(`❌ Error: ${error.message}`);
        addLog(`🔍 Error details: ${JSON.stringify(error, null, 2)}`);
        toast({
          title: "Signup Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        addLog(`✅ Success! User created`);
        addLog(`👤 User data: ${JSON.stringify(data.user, null, 2)}`);
        toast({
          title: "Signup Successful",
          description: "User created successfully",
        });
      }
    } catch (error: any) {
      addLog(`💥 Catch error: ${error.message}`);
      addLog(`🔍 Error type: ${error.name}`);
      addLog(`📚 Stack: ${error.stack}`);
      toast({
        title: "Network Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const testDirectFetch = async () => {
    setLoading(true);
    addLog('🌐 Testing direct fetch to auth endpoint...');
    
    try {
      const url = `${supabase.supabaseUrl}/auth/v1/signup`;
      addLog(`📍 URL: ${url}`);
      
      const payload = {
        email,
        password,
      };
      
      addLog(`📦 Payload: ${JSON.stringify(payload, null, 2)}`);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabase.supabaseKey || '',
        },
        body: JSON.stringify(payload),
      });
      
      addLog(`📊 Response status: ${response.status} ${response.statusText}`);
      addLog(`📋 Response headers: ${JSON.stringify(Object.fromEntries(response.headers), null, 2)}`);
      
      const responseText = await response.text();
      addLog(`📄 Response body: ${responseText}`);
      
      if (response.ok) {
        toast({
          title: "Direct Fetch Success",
          description: "Auth endpoint is working",
        });
      } else {
        toast({
          title: "Direct Fetch Failed",
          description: `${response.status}: ${response.statusText}`,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      addLog(`💥 Direct fetch error: ${error.message}`);
      toast({
        title: "Direct Fetch Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>🔍 Authentication Debug Tool</CardTitle>
            <CardDescription>
              Detailed debugging for Supabase authentication issues
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Test Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Test Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <Button 
                onClick={testBasicSignup} 
                disabled={loading}
              >
                {loading ? "Testing..." : "Test Supabase Signup"}
              </Button>
              
              <Button 
                onClick={testDirectFetch} 
                disabled={loading}
                variant="outline"
              >
                {loading ? "Testing..." : "Test Direct Fetch"}
              </Button>
              
              <Button 
                onClick={clearLogs} 
                variant="secondary"
              >
                Clear Logs
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>📋 Debug Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-black text-green-400 p-4 rounded font-mono text-sm max-h-96 overflow-y-auto">
              {logs.length === 0 ? (
                <div className="text-gray-500">No logs yet. Click a test button to start debugging.</div>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="mb-1">
                    {log}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>ℹ️ System Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Supabase URL:</strong><br />
                {supabase.supabaseUrl}
              </div>
              <div>
                <strong>API Key Length:</strong><br />
                {supabase.supabaseKey?.length || 0} characters
              </div>
              <div>
                <strong>Environment:</strong><br />
                {import.meta.env.MODE}
              </div>
              <div>
                <strong>Base URL:</strong><br />
                {window.location.origin}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};