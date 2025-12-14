import { cn } from '@/lib/utils';
import { AlertTriangle, Clock, X, Eye, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';

interface AlertItem {
  id: string;
  titulo: string;
  descricao: string;
  tipo: 'critico' | 'atencao' | 'recente';
  protocoloNumero?: string;
}

interface AlertCardProps {
  items: AlertItem[];
  className?: string;
  delay?: number;
}

export function AlertCard({ items, className, delay = 0 }: AlertCardProps) {
  const navigate = useNavigate();
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  
  // Carregar IDs dispensados do localStorage
  useEffect(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const key = `dismissed_alerts_${today}`;
    const dismissed = JSON.parse(localStorage.getItem(key) || '[]') as string[];
    setDismissedIds(dismissed);
  }, []);

  const handleDismiss = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const today = format(new Date(), 'yyyy-MM-dd');
    const key = `dismissed_alerts_${today}`;
    const dismissed = JSON.parse(localStorage.getItem(key) || '[]') as string[];
    const updated = [...dismissed, id];
    localStorage.setItem(key, JSON.stringify(updated));
    setDismissedIds(updated);
  };

  const handleClick = (id: string) => {
    navigate(`/protocolos?id=${id}`);
  };

  const visibleItems = items.filter(item => !dismissedIds.includes(item.id));

  const getAlertStyles = (tipo: AlertItem['tipo']) => {
    switch (tipo) {
      case 'critico':
        return {
          bg: 'bg-red-500/5 border-red-500 hover:bg-red-500/10',
          text: 'text-red-700 dark:text-red-400',
          icon: 'text-red-500'
        };
      case 'atencao':
        return {
          bg: 'bg-amber-500/5 border-amber-500 hover:bg-amber-500/10',
          text: 'text-amber-700 dark:text-amber-400',
          icon: 'text-amber-500'
        };
      case 'recente':
        return {
          bg: 'bg-blue-500/5 border-blue-500 hover:bg-blue-500/10',
          text: 'text-blue-700 dark:text-blue-400',
          icon: 'text-blue-500'
        };
    }
  };

  const getAlertIcon = (tipo: AlertItem['tipo']) => {
    switch (tipo) {
      case 'critico':
      case 'atencao':
        return AlertTriangle;
      case 'recente':
        return Sparkles;
    }
  };

  if (visibleItems.length === 0) {
    return (
      <div 
        className={cn('card-stats animate-slide-up', className)}
        style={{ animationDelay: `${delay}ms` }}
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-lg bg-emerald-500/10">
            <AlertTriangle size={20} className="text-emerald-500" />
          </div>
          <h3 className="font-heading text-lg font-semibold">Alertas</h3>
        </div>
        <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
          <div className="p-3 rounded-full bg-emerald-500/10 mb-3">
            <Clock size={24} className="text-emerald-500" />
          </div>
          <p className="text-sm font-medium">Tudo em dia!</p>
          <p className="text-xs">Nenhum alerta no momento</p>
        </div>
      </div>
    );
  }

  const criticalCount = visibleItems.filter(i => i.tipo === 'critico').length;
  const warningCount = visibleItems.filter(i => i.tipo === 'atencao').length;
  const recentCount = visibleItems.filter(i => i.tipo === 'recente').length;

  return (
    <div 
      className={cn('card-stats animate-slide-up', className)}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-red-500/10">
            <AlertTriangle size={20} className="text-red-500" />
          </div>
          <h3 className="font-heading text-lg font-semibold">Alertas</h3>
        </div>
        <div className="flex items-center gap-1">
          {criticalCount > 0 && (
            <span className="flex items-center justify-center min-w-[24px] h-6 px-1.5 rounded-full bg-red-500 text-white text-xs font-bold">
              {criticalCount}
            </span>
          )}
          {warningCount > 0 && (
            <span className="flex items-center justify-center min-w-[24px] h-6 px-1.5 rounded-full bg-amber-500 text-white text-xs font-bold">
              {warningCount}
            </span>
          )}
          {recentCount > 0 && (
            <span className="flex items-center justify-center min-w-[24px] h-6 px-1.5 rounded-full bg-blue-500 text-white text-xs font-bold">
              {recentCount}
            </span>
          )}
        </div>
      </div>
      
      <div className="space-y-3 max-h-[280px] overflow-y-auto">
        {visibleItems.map((item) => {
          const styles = getAlertStyles(item.tipo);
          const Icon = getAlertIcon(item.tipo);
          
          return (
            <div 
              key={item.id}
              onClick={() => handleClick(item.id)}
              className={cn(
                "p-3 rounded-lg border-l-4 transition-all duration-200 cursor-pointer group relative",
                styles.bg
              )}
            >
              <div className="flex items-start gap-2 pr-8">
                <Icon 
                  size={16} 
                  className={cn("mt-0.5 shrink-0", styles.icon)} 
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className={cn("text-sm font-semibold truncate", styles.text)}>
                      {item.titulo}
                    </p>
                    <Eye size={12} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                    {item.descricao}
                  </p>
                </div>
              </div>
              
              {/* Botão X para dispensar */}
              <button
                onClick={(e) => handleDismiss(e, item.id)}
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-foreground/10 transition-colors opacity-0 group-hover:opacity-100"
                title="Dispensar alerta"
              >
                <X size={14} className="text-muted-foreground" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
