import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Bot, Shield, Key, Lock, AlertTriangle } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const FAQ_OPTIONS = [
  { id: 'strong', label: 'How to create a strong password?', icon: Shield },
  { id: 'reuse', label: 'Why not reuse passwords?', icon: Key },
  { id: 'change', label: 'How often to change passwords?', icon: Lock },
  { id: 'breach', label: 'What if my password is breached?', icon: AlertTriangle },
];

const FAQ_ANSWERS: Record<string, string> = {
  strong: 'A strong password should be at least 12 characters long, include uppercase and lowercase letters, numbers, and special characters. Avoid common words or personal information. Use our password generator for secure passwords!',
  reuse: 'Reusing passwords is dangerous because if one account is compromised, hackers can access all your other accounts. Always use unique passwords for each service.',
  change: 'Change passwords immediately if you suspect a breach. For critical accounts, consider changing them every 3-6 months. Use your vault to keep track of all passwords securely.',
  breach: 'If your password is breached: 1) Change it immediately, 2) Enable two-factor authentication, 3) Check if other accounts use the same password and update them, 4) Monitor your accounts for suspicious activity.',
};

export const AIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hi! I\'m your vault assistant. Choose a topic below to learn about password security:'
    }
  ]);
  const [showOptions, setShowOptions] = useState(true);

  const handleOptionClick = (optionId: string) => {
    const option = FAQ_OPTIONS.find(o => o.id === optionId);
    if (!option) return;

    const userMessage: Message = { role: 'user', content: option.label };
    const assistantMessage: Message = { role: 'assistant', content: FAQ_ANSWERS[optionId] };
    
    setMessages(prev => [...prev, userMessage, assistantMessage]);
    setShowOptions(true);
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
          
          {showOptions && (
            <div className="grid grid-cols-1 gap-2 mt-4">
              {FAQ_OPTIONS.map((option) => {
                const Icon = option.icon;
                return (
                  <Button
                    key={option.id}
                    variant="outline"
                    className="justify-start h-auto py-3 px-4"
                    onClick={() => handleOptionClick(option.id)}
                  >
                    <Icon className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-left text-sm">{option.label}</span>
                  </Button>
                );
              })}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
