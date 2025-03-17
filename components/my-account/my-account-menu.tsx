'use client';

import { useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Camera, User } from 'lucide-react';

export default function MyAccountMenu() {
  const [name, setName] = useState('John Doe');
  const [avatarUrl, setAvatarUrl] = useState('/default-avatar.png');

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex-1 bg-gradient-to-br from-background to-primary/10 p-4 md:p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-4xl font-bold text-foreground">My Account</h1>

        <Card className="border-border bg-card shadow-sm">
          <CardContent className="space-y-6 p-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={avatarUrl} alt="User Avatar" />
                  <AvatarFallback className="bg-secondary text-secondary-foreground">
                    <User className="h-12 w-12" />
                  </AvatarFallback>
                </Avatar>
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-primary p-2 text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
                >
                  <Camera className="h-4 w-4" />
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                  id="avatar-upload"
                />
              </div>
            </div>

            {/* Name Section */}
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-medium text-foreground"
              >
                Display Name
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={handleNameChange}
                className="bg-background"
              />
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button className="w-full sm:w-auto">Save Changes</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
