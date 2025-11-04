import { useState } from 'react';
import { Credential } from '@/lib/storage';
import { CredentialCard } from './CredentialCard';
import { EditCredentialDialog } from './EditCredentialDialog';
import { LockKeyhole } from 'lucide-react';

interface CredentialListProps {
  credentials: Credential[];
}

export const CredentialList = ({ credentials }: CredentialListProps) => {
  const [editingCredential, setEditingCredential] = useState<Credential | null>(null);

  if (credentials.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <LockKeyhole className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No credentials found</h3>
        <p className="text-muted-foreground mb-4">
          {credentials.length === 0 ? 'Start by adding your first credential' : 'Try adjusting your search or filters'}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {credentials.map((credential) => (
          <CredentialCard
            key={credential.id}
            credential={credential}
            onEdit={() => setEditingCredential(credential)}
          />
        ))}
      </div>

      {editingCredential && (
        <EditCredentialDialog
          credential={editingCredential}
          open={!!editingCredential}
          onOpenChange={(open) => !open && setEditingCredential(null)}
        />
      )}
    </>
  );
};
