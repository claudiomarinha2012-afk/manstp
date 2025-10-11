import { usePresence } from '@/contexts/PresenceContext';
import { useUserRole } from '@/hooks/useUserRole';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Users, Circle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function OnlineUsers() {
  const { onlineUsers, totalOnline } = usePresence();
  const { role } = useUserRole();
  const { t } = useTranslation();

  // Only show for coordinators (admins)
  if (role !== 'coordenador') {
    return null;
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 relative">
          <Users className="h-4 w-4" />
          <Badge variant="secondary" className="rounded-full">
            {totalOnline}
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-background" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm">Usuários Online</h4>
            <Badge variant="secondary">{totalOnline} online</Badge>
          </div>
          
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {onlineUsers.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhum usuário online
              </p>
            ) : (
              onlineUsers.map((user) => (
                <div
                  key={user.user_id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {getInitials(user.user_name)}
                      </AvatarFallback>
                    </Avatar>
                    <Circle
                      className="absolute -bottom-0.5 -right-0.5 h-3 w-3 fill-green-500 text-green-500"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {user.user_name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.user_email}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
