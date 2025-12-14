import { Motorista } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Truck, LogOut, WifiOff, Cloud } from 'lucide-react';

interface MotoristaHeaderProps {
  motorista: Motorista;
  isOnline: boolean;
  pendingCount: number;
  onLogout: () => void;
}

export function MotoristaHeader({ motorista, isOnline, pendingCount, onLogout }: MotoristaHeaderProps) {
  return (
    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-3 py-3">
      <div className="max-w-lg mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-foreground truncate">{motorista.nome}</h1>
              {!isOnline && (
                <WifiOff className="w-4 h-4 text-destructive shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Cód: {motorista.codigo}</span>
              <span>•</span>
              <span>{motorista.unidade}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {pendingCount > 0 && (
            <Badge variant="secondary" className="bg-orange-500/10 text-orange-600 border-orange-500/30">
              <Cloud className="w-3 h-3 mr-1" />
              {pendingCount}
            </Badge>
          )}
          <Button variant="outline" size="sm" onClick={onLogout} className="shrink-0 h-9 px-3">
            <LogOut className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Sair</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
