
import { useState, useEffect, useRef } from 'react';
import { QrCode, Copy, Check, User as UserIcon, Camera, AlertCircle, Scan } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { BusinessCard, UserProfile } from './BusinessCard';
import { Input } from './ui/input';
import { Html5Qrcode } from 'html5-qrcode';

interface QRCodeExchangeProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QRCodeExchange({ isOpen, onClose }: QRCodeExchangeProps) {
  const [viewMode, setViewMode] = useState<'qr' | 'text' | 'scan'>('qr');
  const [copied, setCopied] = useState(false);
  const [scannedProfile, setScannedProfile] = useState<UserProfile | null>(null);
  const [scanError, setScanError] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [inputCode, setInputCode] = useState('');
  const [showInput, setShowInput] = useState(false);
  
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerId = 'qr-reader-container';

  const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');

  const generateQRCode = () => {
    const qrData = JSON.stringify(userProfile);
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrData)}`;
    return qrUrl;
  };

  const generateTextCode = () => {
    return JSON.stringify(userProfile);
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

  const startScanner = async () => {
    if (scannerRef.current) {
      return;
    }

    const container = document.getElementById(scannerContainerId);
    if (!container) {
      console.error('Scanner container not found');
      return;
    }

    try {
      scannerRef.current = new Html5Qrcode(scannerContainerId);
      
      await scannerRef.current.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        },
        (decodedText: string) => {
          try {
            const profile: UserProfile = JSON.parse(decodedText);
            setScannedProfile(profile);
            stopScanner();
          } catch (error) {
            setScanError('Invalid QR code format');
          }
        },
        () => {}
      );
      
      setIsScanning(true);
      setScanError('');
    } catch (error) {
      console.error('Failed to start scanner:', error);
      setScanError('Failed to access camera. Please check permissions.');
      setIsScanning(false);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
      } catch (error) {
        console.error('Failed to stop scanner:', error);
      }
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      stopScanner();
      setViewMode('qr');
      setScannedProfile(null);
      setScanError('');
      setShowInput(false);
      setInputCode('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (viewMode === 'scan' && isOpen) {
      setTimeout(() => {
        startScanner();
      }, 100);
    } else {
      stopScanner();
    }
  }, [viewMode, isOpen]);

  const handleManualInput = () => {
    try {
      const profile: UserProfile = JSON.parse(inputCode);
      if (profile.name && profile.email) {
        setScannedProfile(profile);
        setShowInput(false);
        setInputCode('');
      } else {
        setScanError('Invalid profile data');
      }
    } catch (error) {
      setScanError('Invalid code format');
    }
  };

  const resetScan = () => {
    setScannedProfile(null);
    setScanError('');
    if (viewMode === 'scan') {
      setTimeout(() => startScanner(), 100);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="w-6 h-6" />
            QR Code Exchange
          </DialogTitle>
          <DialogDescription>
            Share or scan QR codes to connect with others
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={viewMode === 'qr' ? 'default' : 'outline'}
              onClick={() => setViewMode('qr')}
            >
              <QrCode className="w-4 h-4 mr-2" />
              My QR
            </Button>
            <Button
              variant={viewMode === 'text' ? 'default' : 'outline'}
              onClick={() => setViewMode('text')}
            >
              <UserIcon className="w-4 h-4 mr-2" />
              Text
            </Button>
            <Button
              variant={viewMode === 'scan' ? 'default' : 'outline'}
              onClick={() => setViewMode('scan')}
            >
              <Scan className="w-4 h-4 mr-2" />
              Scan
            </Button>
          </div>

          {viewMode === 'qr' && !scannedProfile && (
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

          {viewMode === 'text' && !scannedProfile && (
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

          {viewMode === 'scan' && !scannedProfile && (
            <div className="space-y-4">
              {scanError && (
                <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-md">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{scanError}</span>
                </div>
              )}
              
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <Camera className="w-16 h-16 text-muted-foreground mb-4" />
                </div>
                <p className="text-center text-sm text-muted-foreground">
                  {isScanning ? 'Point camera at a QR code' : 'Click Scan to start scanning'}
                </p>
              </div>

              <div id={scannerContainerId} className="w-full rounded-lg overflow-hidden bg-black" />

              <div className="space-y-2">
                <p className="text-sm font-medium text-center">Or enter code manually</p>
                <div className="flex gap-2">
                  <Input
                    placeholder="Paste the code here..."
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    className="font-mono text-xs"
                  />
                  <Button onClick={handleManualInput} disabled={!inputCode.trim()}>
                    Add
                  </Button>
                </div>
              </div>
            </div>
          )}

          {scannedProfile && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600">
                <UserIcon className="w-5 h-5" />
                <span className="font-medium">Profile Found!</span>
              </div>
              <BusinessCard profile={scannedProfile} />
              <Button onClick={resetScan} className="w-full" variant="outline">
                Scan Another
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}