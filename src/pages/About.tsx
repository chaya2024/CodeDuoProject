import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Target, Award, Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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

export const About = () => {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanyData();
  }, []);

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
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const defaultCompany: Company = {
    id: 'default',
    name: 'Your Company',
    bio: 'Building the future with innovative solutions',
    about: 'We are a forward-thinking company dedicated to delivering exceptional results through cutting-edge technology and unparalleled expertise. Our team combines years of experience with fresh perspectives to tackle complex challenges and create meaningful solutions for our clients.',
    email: 'contact@yourcompany.com',
    phone: '+1 (555) 123-4567',
    address: '123 Business St, City, State 12345',
    website: 'https://yourcompany.com'
  };

  const displayCompany = company || defaultCompany;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-hero-gradient">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-primary-foreground mb-6">
            About {displayCompany.name}
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            {displayCompany.bio}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold mb-8 text-center">Our Story</h2>
            <div className="bg-card-gradient rounded-2xl p-8 shadow-card">
              <p className="text-lg leading-relaxed text-muted-foreground">
                {displayCompany.about}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Users,
                title: "Collaboration",
                description: "We believe in the power of teamwork and open communication to achieve extraordinary results."
              },
              {
                icon: Target,
                title: "Excellence",
                description: "We strive for perfection in every project, constantly pushing boundaries and exceeding expectations."
              },
              {
                icon: Award,
                title: "Innovation",
                description: "We embrace new technologies and creative solutions to solve complex challenges."
              },
              {
                icon: Heart,
                title: "Integrity",
                description: "We operate with honesty, transparency, and ethical practices in all our interactions."
              }
            ].map((value, index) => (
              <Card key={index} className="group hover:shadow-card transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-6 text-center">
                  <div className="mb-4">
                    <value.icon className="h-10 w-10 mx-auto text-primary group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="bg-hero-gradient p-1">
              <CardContent className="bg-background m-1 rounded-lg p-8">
                <Target className="h-12 w-12 text-primary mb-6" />
                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                <p className="text-muted-foreground">
                  To empower businesses with innovative solutions that drive growth, enhance efficiency, 
                  and create lasting value for all stakeholders.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-accent/20 border-accent/50">
              <CardContent className="p-8">
                <Award className="h-12 w-12 text-accent mb-6" />
                <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                <p className="text-muted-foreground">
                  To be the leading partner for businesses seeking transformative solutions, 
                  recognized for our expertise, innovation, and commitment to excellence.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Our Team</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Passionate professionals dedicated to your success
          </p>
          <Card className="bg-background/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <p className="text-lg text-muted-foreground">
                Our diverse team brings together expertise from various fields, creating a powerhouse 
                of knowledge and experience. We're united by our shared commitment to delivering 
                exceptional results and building lasting relationships with our clients.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};