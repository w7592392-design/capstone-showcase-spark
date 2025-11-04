import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { generatePassword, calculatePasswordStrength } from '@/lib/encryption';
import { Copy, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface PasswordGeneratorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PasswordGeneratorDialog = ({ open, onOpenChange }: PasswordGeneratorDialogProps) => {
  const [length, setLength] = useState([16]);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [password, setPassword] = useState(() => generatePassword(16, options));

  const strength = calculatePasswordStrength(password);

  const handleGenerate = () => {
    const newPassword = generatePassword(length[0], options);
    setPassword(newPassword);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    toast.success('Password copied to clipboard');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Password Generator</DialogTitle>
          <DialogDescription>
            Generate a strong, random password
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Generated Password */}
          <div className="space-y-2">
            <Label>Generated Password</Label>
            <div className="flex gap-2">
              <div className="flex-1 px-4 py-3 bg-muted rounded-lg font-mono text-sm break-all">
                {password}
              </div>
              <Button variant="outline" size="icon" onClick={handleCopy}>
                <Copy className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleGenerate}>
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>

            {/* Strength Indicator */}
            <div className="space-y-1">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`h-2 flex-1 rounded-full transition-colors ${
                      level <= strength.score ? strength.color : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Strength: <span className="font-medium">{strength.label}</span>
              </p>
            </div>
          </div>

          {/* Length Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Length</Label>
              <span className="text-sm font-medium">{length[0]} characters</span>
            </div>
            <Slider
              value={length}
              onValueChange={setLength}
              min={8}
              max={32}
              step={1}
              className="w-full"
            />
          </div>

          {/* Options */}
          <div className="space-y-3">
            <Label>Character Types</Label>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="uppercase" className="font-normal">
                Uppercase (A-Z)
              </Label>
              <Switch
                id="uppercase"
                checked={options.uppercase}
                onCheckedChange={(checked) => setOptions({ ...options, uppercase: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="lowercase" className="font-normal">
                Lowercase (a-z)
              </Label>
              <Switch
                id="lowercase"
                checked={options.lowercase}
                onCheckedChange={(checked) => setOptions({ ...options, lowercase: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="numbers" className="font-normal">
                Numbers (0-9)
              </Label>
              <Switch
                id="numbers"
                checked={options.numbers}
                onCheckedChange={(checked) => setOptions({ ...options, numbers: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="symbols" className="font-normal">
                Symbols (!@#$...)
              </Label>
              <Switch
                id="symbols"
                checked={options.symbols}
                onCheckedChange={(checked) => setOptions({ ...options, symbols: checked })}
              />
            </div>
          </div>

          <Button onClick={handleGenerate} className="w-full" size="lg">
            <RefreshCw className="w-4 h-4 mr-2" />
            Generate New Password
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
