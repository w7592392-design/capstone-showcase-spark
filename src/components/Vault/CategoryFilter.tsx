import { useVault } from '@/contexts/VaultContext';
import { Button } from '@/components/ui/button';
import { Globe, ShoppingBag, Briefcase, Mail, CreditCard, GamepadIcon, Shield } from 'lucide-react';

const categories = [
  { id: 'all', label: 'All', icon: Shield },
  { id: 'social', label: 'Social', icon: Globe },
  { id: 'shopping', label: 'Shopping', icon: ShoppingBag },
  { id: 'work', label: 'Work', icon: Briefcase },
  { id: 'email', label: 'Email', icon: Mail },
  { id: 'finance', label: 'Finance', icon: CreditCard },
  { id: 'gaming', label: 'Gaming', icon: GamepadIcon },
];

export const CategoryFilter = () => {
  const { categoryFilter, setCategoryFilter, credentials } = useVault();

  const getCategoryCount = (categoryId: string) => {
    if (categoryId === 'all') return credentials.length;
    return credentials.filter(c => c.category === categoryId).length;
  };

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const Icon = category.icon;
        const count = getCategoryCount(category.id);
        const isActive = categoryFilter === category.id;

        return (
          <Button
            key={category.id}
            variant={isActive ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCategoryFilter(category.id)}
            className="gap-2"
          >
            <Icon className="w-4 h-4" />
            {category.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              isActive ? 'bg-primary-foreground/20' : 'bg-muted'
            }`}>
              {count}
            </span>
          </Button>
        );
      })}
    </div>
  );
};
