import { Users, Building2, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface NewGroupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectUnidade: (unidade: string) => void;
}

export function NewGroupModal({ open, onOpenChange, onSelectUnidade }: NewGroupModalProps) {
  const { user } = useAuth();

  const canJoinGroup = user?.unidade && user.unidade !== 'Todas';

  const handleJoinGroup = () => {
    if (user?.unidade && user.unidade !== 'Todas') {
      onSelectUnidade(user.unidade);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Entrar no Grupo da Unidade
          </DialogTitle>
        </DialogHeader>

        {canJoinGroup ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Você será adicionado ao grupo de chat da sua unidade. Todos os membros da mesma unidade podem participar.
            </p>

            <div className="p-4 rounded-lg border bg-muted/30 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <span className="font-semibold text-lg">{user?.unidade}</span>
                <p className="text-sm text-muted-foreground">Sua unidade</p>
              </div>
            </div>

            <Button onClick={handleJoinGroup} className="w-full">
              <Users className="h-4 w-4 mr-2" />
              Entrar no Grupo
            </Button>
          </div>
        ) : (
          <div className="text-center py-8 space-y-3">
            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">
              Administradores com acesso a "Todas" unidades não podem participar de grupos específicos.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
