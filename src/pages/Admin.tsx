import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Building, User, Settings, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User as SupabaseUser } from "@supabase/supabase-js";

interface Company {
  id: string;
  name: string;
  bio: string;
  about: string;
  email: string;
  phone: string;
  address: string;
  website?: string;
  logo_url?: string;
}

export const Admin = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    about: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    logo_url: ''
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth');
        return;
      }
      
      setUser(user);
      await fetchCompanyData();
    } catch (error) {
      console.error('Error checking auth:', error);
      navigate('/auth');
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanyData = async () => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching company data:', error);
      } else if (data) {
        setCompany(data);
        setFormData({
          name: data.name || '',
          bio: data.bio || '',
          about: data.about || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          website: data.website || '',
          logo_url: data.logo_url || ''
        });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!user) return;
    
    setSaving(true);
    
    try {
      const companyData = {
        user_id: user.id,
        name: formData.name,
        bio: formData.bio,
        about: formData.about,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        website: formData.website || null,
        logo_url: formData.logo_url || null,
        updated_at: new Date().toISOString()
      };

      if (company) {
        // Update existing company
        const { error } = await supabase
          .from('companies')
          .update(companyData)
          .eq('id', company.id);
        
        if (error) throw error;
      } else {
        // Create new company
        const { error } = await supabase
          .from('companies')
          .insert([companyData]);
        
        if (error) throw error;
      }

      toast({
        title: "Changes saved!",
        description: "Your company information has been updated successfully.",
      });
      
      // Refresh data
      await fetchCompanyData();
    } catch (error: any) {
      toast({
        title: "Error saving changes",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="glass"
                size="sm"
                onClick={() => navigate('/')}
                className="text-primary-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Site
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-primary-foreground">Admin Panel</h1>
                <p className="text-primary-foreground/80">Manage your company content</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-primary-foreground/80">Welcome, {user.email}</span>
              <Button variant="glass" onClick={handleSignOut} className="text-primary-foreground hover:text-foreground">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="company" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="company">
              <Building className="w-4 h-4 mr-2" />
              Company Info
            </TabsTrigger>
            <TabsTrigger value="content">
              <Settings className="w-4 h-4 mr-2" />
              Content
            </TabsTrigger>
            <TabsTrigger value="profile">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="company" className="space-y-6">
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>
                  Update your company's basic information and contact details.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Company Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your Company Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="contact@company.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      name="website"
                      type="url"
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="https://yourcompany.com"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="123 Business St, City, State 12345"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="logo_url">Logo URL</Label>
                  <Input
                    id="logo_url"
                    name="logo_url"
                    type="url"
                    value={formData.logo_url}
                    onChange={handleInputChange}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle>Content Management</CardTitle>
                <CardDescription>
                  Update your company's bio and about section that appears on your website.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="bio">Company Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    rows={3}
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="A brief description of your company (appears on the hero section)"
                  />
                  <p className="text-sm text-muted-foreground">
                    This appears as the subtitle on your homepage hero section.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="about">About Section</Label>
                  <Textarea
                    id="about"
                    name="about"
                    rows={8}
                    value={formData.about}
                    onChange={handleInputChange}
                    placeholder="Detailed description of your company, mission, and values"
                  />
                  <p className="text-sm text-muted-foreground">
                    This content appears on your About page and homepage preview section.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle>Admin Profile</CardTitle>
                <CardDescription>
                  Your administrator account information.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={user.email || ''} disabled />
                </div>
                <div className="space-y-2">
                  <Label>User ID</Label>
                  <Input value={user.id} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Last Sign In</Label>
                  <Input 
                    value={user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'Never'} 
                    disabled 
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="flex justify-end pt-6">
          <Button 
            size="lg" 
            onClick={handleSave}
            disabled={saving}
            className="group"
          >
            {saving ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                Saving...
              </div>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};