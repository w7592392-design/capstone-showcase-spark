import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Bot, Shield, Key, Lock, AlertTriangle, Smartphone, Mail, Eye, FileText, HelpCircle, RefreshCw } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const FAQ_CATEGORIES = {
  basics: [
    { id: 'strong', label: 'Strong password tips', icon: Shield },
    { id: 'reuse', label: 'Reusing passwords', icon: Key },
    { id: 'length', label: 'Password length', icon: FileText },
    { id: 'remember', label: 'Remembering passwords', icon: HelpCircle },
  ],
  security: [
    { id: 'breach', label: 'Password breached?', icon: AlertTriangle },
    { id: '2fa', label: 'Two-factor auth', icon: Smartphone },
    { id: 'phishing', label: 'Phishing attacks', icon: Mail },
    { id: 'visible', label: 'Making passwords visible', icon: Eye },
  ],
  management: [
    { id: 'change', label: 'Changing passwords', icon: RefreshCw },
    { id: 'storage', label: 'Where to store', icon: Lock },
    { id: 'sharing', label: 'Sharing passwords', icon: Key },
    { id: 'generator', label: 'Password generator', icon: Shield },
  ],
};

const FAQ_ANSWERS: Record<string, string> = {
  strong: 'Use 12+ characters with uppercase, lowercase, numbers, and symbols. Avoid dictionary words and personal info.',
  reuse: 'Never reuse passwords. If one account gets hacked, all accounts with the same password are at risk.',
  length: '12 characters minimum. Longer is better. A 16-character password is much harder to crack.',
  remember: 'Use a password manager like this vault! Store all passwords securely in one place.',
  breach: 'Change it immediately. Enable 2FA. Update other accounts using the same password. Monitor for suspicious activity.',
  '2fa': 'Two-factor authentication adds a second layer of security. Even if someone has your password, they need your phone too.',
  phishing: 'Never click suspicious links or enter passwords on untrusted sites. Check the URL carefully before logging in.',
  visible: 'Only make passwords visible when you\'re alone. Use the eye icon in this vault to safely view your passwords.',
  change: 'Change immediately if breached. Otherwise, change every 3-6 months for sensitive accounts.',
  storage: 'Use a password manager (like this vault!) or write them down and store in a secure physical location.',
  sharing: 'Avoid sharing when possible. If needed, use secure methods and change the password after sharing.',
  generator: 'Use our built-in generator for random, secure passwords. It creates strong passwords instantly.',
};

export const AIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hi! I\'m your vault assistant. Choose a category to explore:'
    }
  ]);
  const [currentView, setCurrentView] = useState<'categories' | 'options'>('categories');
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof FAQ_CATEGORIES | null>(null);

  const handleCategoryClick = (category: keyof typeof FAQ_CATEGORIES) => {
    setSelectedCategory(category);
    setCurrentView('options');
  };

  const handleOptionClick = (optionId: string) => {
    const allOptions = Object.values(FAQ_CATEGORIES).flat();
    const option = allOptions.find(o => o.id === optionId);
    if (!option) return;

    const userMessage: Message = { role: 'user', content: option.label };
    const assistantMessage: Message = { role: 'assistant', content: FAQ_ANSWERS[optionId] };
    
    setMessages(prev => [...prev, userMessage, assistantMessage]);
  };

  const handleBackToCategories = () => {
    setCurrentView('categories');
    setSelectedCategory(null);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bot className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary animate-pulse" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Vault Assistant
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col h-[calc(100vh-8rem)] mt-4">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          <div className="mt-4 space-y-2">
            {currentView === 'categories' ? (
              <>
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto py-3 px-4"
                  onClick={() => handleCategoryClick('basics')}
                >
                  <Shield className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-semibold">Password Basics</div>
                    <div className="text-xs text-muted-foreground">Strength, length, tips</div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto py-3 px-4"
                  onClick={() => handleCategoryClick('security')}
                >
                  <AlertTriangle className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-semibold">Security Threats</div>
                    <div className="text-xs text-muted-foreground">Breaches, phishing, 2FA</div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto py-3 px-4"
                  onClick={() => handleCategoryClick('management')}
                >
                  <Lock className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-semibold">Managing Passwords</div>
                    <div className="text-xs text-muted-foreground">Storage, sharing, tools</div>
                  </div>
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mb-2"
                  onClick={handleBackToCategories}
                >
                  ← Back to categories
                </Button>
                {selectedCategory && FAQ_CATEGORIES[selectedCategory].map((option) => {
                  const Icon = option.icon;
                  return (
                    <Button
                      key={option.id}
                      variant="outline"
                      className="w-full justify-start h-auto py-2 px-4"
                      onClick={() => handleOptionClick(option.id)}
                    >
                      <Icon className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="text-left text-sm">{option.label}</span>
                    </Button>
                  );
                })}
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
