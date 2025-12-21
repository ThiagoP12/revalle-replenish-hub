import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatBubbleExpanded } from './ChatBubbleExpanded';

interface ChatBubbleProps {
  unreadCount?: number;
  protocoloId?: string;
  protocoloNumero?: string;
}

export function ChatBubble({ unreadCount = 0, protocoloId, protocoloNumero }: ChatBubbleProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {/* Floating bubble button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center",
          "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105",
          isExpanded && "rotate-180"
        )}
      >
        {isExpanded ? (
          <X className="h-6 w-6" />
        ) : (
          <>
            <MessageCircle className="h-6 w-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </>
        )}
      </button>

      {/* Expanded chat window */}
      {isExpanded && (
        <ChatBubbleExpanded 
          onClose={() => setIsExpanded(false)}
          protocoloId={protocoloId}
          protocoloNumero={protocoloNumero}
        />
      )}
    </>
  );
}
