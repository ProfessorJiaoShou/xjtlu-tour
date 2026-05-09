
import { User, Mail, Phone, GraduationCap, Briefcase, MapPin, MessageCircle } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  major: string;
  year: string;
  interests: string;
  bio: string;
}

interface BusinessCardProps {
  profile: UserProfile;
}

export function BusinessCard({ profile }: BusinessCardProps) {
  const handleContact = () => {
    const subject = `Hello from XJTLU Campus Explorer`;
    const body = `Hi ${profile.name},\n\nI met you at the campus tour and would like to connect!`;
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <Card className="w-full bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold">{profile.name}</h3>
              <p className="text-sm text-muted-foreground">{profile.major} • {profile.year}</p>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            {profile.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <a href={`mailto:${profile.email}`} className="text-blue-600 hover:underline">
                  {profile.email}
                </a>
              </div>
            )}
            {profile.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <a href={`tel:${profile.phone}`} className="text-blue-600 hover:underline">
                  {profile.phone}
                </a>
              </div>
            )}
            {profile.interests && (
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                <span className="text-muted-foreground">{profile.interests}</span>
              </div>
            )}
          </div>

          {profile.bio && (
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground italic">"{profile.bio}"</p>
            </div>
          )}

          <Button
            onClick={handleContact}
            className="w-full"
            variant="outline"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Contact
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
