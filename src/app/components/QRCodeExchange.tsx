
import { useState } from 'react';
import { QrCode, Copy, Check, User as UserIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { BusinessCard, UserProfile } from './BusinessCard';
import { Input } from './ui/input';

interface QRCodeExchangeProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QRCodeExchange({ isOpen, onClose }: QRCodeExchangeProps) {
  const [copied, setCopied] = useState(false);
  const [showText, setShowText] = useState(false);

  const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');

  const generateQRCode = () => {
    const qrData = JSON.stringify(userProfile);
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrData)}`;
    return qrUrl;
  };

  const generateTextCode = () => {
    const qrData = JSON.stringify(userProfile);
    return qrData;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateTextCode());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="w-6 h-6" />
            My QR Code
          </DialogTitle>
          <DialogDescription>
            Share your profile with others
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex gap-2">
            <Button
              variant={!showText ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => setShowText(false)}
            >
              <QrCode className="w-4 h-4 mr-2" />
              QR Code
            </Button>
            <Button
              variant={showText ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => setShowText(true)}
            >
              <UserIcon className="w-4 h-4 mr-2" />
              Text Code
            </Button>
          </div>

          {!showText && (
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <img 
                  src={generateQRCode()} 
                  alt="My QR Code" 
                  className="w-64 h-64"
                />
              </div>
              <p className="text-center text-sm text-muted-foreground">
                Let others scan this QR code to get your contact information
              </p>
              <BusinessCard profile={userProfile} />
            </div>
          )}

          {showText && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Your Profile Code</label>
                <div className="relative">
                  <Input
                    value={generateTextCode()}
                    readOnly
                    className="pr-12 font-mono text-xs"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={handleCopy}
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Share this code with others so they can add you to their contacts
                </p>
              </div>
              <BusinessCard profile={userProfile} />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}