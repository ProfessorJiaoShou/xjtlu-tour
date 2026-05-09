
import { useState, useEffect } from 'react';
import { Compass, User, Mail, Phone, GraduationCap, Briefcase, MapPin } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  major: string;
  year: string;
  interests: string;
  bio: string;
}

interface ProfileSetupProps {
  onComplete: (profile: UserProfile) => void;
}

export function ProfileSetup({ onComplete }: ProfileSetupProps) {
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
    major: '',
    year: '',
    interests: '',
    bio: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof UserProfile, string>>>({});

  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setProfile(parsed);
    }
  }, []);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof UserProfile, string>> = {};

    if (!profile.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!profile.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(profile.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!profile.major.trim()) {
      newErrors.major = 'Major is required';
    }
    if (!profile.year.trim()) {
      newErrors.year = 'Year is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      localStorage.setItem('userProfile', JSON.stringify(profile));
      onComplete(profile);
    }
  };

  const handleChange = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="animate-bounce mb-6 inline-block">
            <Compass className="w-20 h-20 text-white mx-auto" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Create Your Profile</h1>
          <p className="text-white/80">Let others know who you are</p>
        </div>

        <Card className="shadow-2xl border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Profile Information</CardTitle>
            <CardDescription className="text-center">
              Fill in your details to create your digital business card
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={profile.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className={errors.name ? 'border-destructive' : ''}
                  />
                  {errors.name && <p className="text-destructive text-sm">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@xjtlu.edu.cn"
                    value={profile.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className={errors.email ? 'border-destructive' : ''}
                  />
                  {errors.email && <p className="text-destructive text-sm">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+86 123 4567 8900"
                    value={profile.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="major" className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    Major <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="major"
                    type="text"
                    placeholder="Computer Science"
                    value={profile.major}
                    onChange={(e) => handleChange('major', e.target.value)}
                    className={errors.major ? 'border-destructive' : ''}
                  />
                  {errors.major && <p className="text-destructive text-sm">{errors.major}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year" className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Year <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="year"
                    type="text"
                    placeholder="Year 2"
                    value={profile.year}
                    onChange={(e) => handleChange('year', e.target.value)}
                    className={errors.year ? 'border-destructive' : ''}
                  />
                  {errors.year && <p className="text-destructive text-sm">{errors.year}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interests" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Interests
                  </Label>
                  <Input
                    id="interests"
                    type="text"
                    placeholder="Photography, Hiking, Technology"
                    value={profile.interests}
                    onChange={(e) => handleChange('interests', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <textarea
                  id="bio"
                  placeholder="Tell us a little about yourself..."
                  value={profile.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  className="w-full min-h-[100px] px-3 py-2 text-base bg-input-background border border-input rounded-md focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none transition-[color,box-shadow] resize-y"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-11 text-base font-medium"
              >
                Create Profile
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-white/60 text-sm mt-6">
          © 2025 XJTLU Campus Explorer
        </p>
      </div>
    </div>
  );
}
