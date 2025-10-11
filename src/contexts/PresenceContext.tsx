import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';
import { RealtimeChannel } from '@supabase/supabase-js';

interface UserPresence {
  user_id: string;
  user_email: string;
  user_name: string;
  online_at: string;
}

interface PresenceContextType {
  onlineUsers: UserPresence[];
  totalOnline: number;
}

const PresenceContext = createContext<PresenceContextType>({
  onlineUsers: [],
  totalOnline: 0,
});

export const usePresence = () => useContext(PresenceContext);

export function PresenceProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState<UserPresence[]>([]);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!user) {
      if (channel) {
        supabase.removeChannel(channel);
        setChannel(null);
      }
      setOnlineUsers([]);
      return;
    }

    // Create presence channel
    const presenceChannel = supabase.channel('online-users', {
      config: {
        presence: {
          key: user.id,
        },
      },
    });

    // Listen to presence changes
    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState();
        const users: UserPresence[] = [];
        
        Object.keys(state).forEach((key) => {
          const presences = state[key] as any[];
          if (presences && presences.length > 0) {
            users.push(presences[0] as UserPresence);
          }
        });
        
        setOnlineUsers(users);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          // Fetch user profile to get name
          const { data: profile } = await supabase
            .from('profiles')
            .select('nome_completo')
            .eq('id', user.id)
            .single();

          // Track user presence
          await presenceChannel.track({
            user_id: user.id,
            user_email: user.email || 'Sem email',
            user_name: profile?.nome_completo || 'Usuário',
            online_at: new Date().toISOString(),
          });
        }
      });

    setChannel(presenceChannel);

    return () => {
      if (presenceChannel) {
        supabase.removeChannel(presenceChannel);
      }
    };
  }, [user]);

  return (
    <PresenceContext.Provider value={{ onlineUsers, totalOnline: onlineUsers.length }}>
      {children}
    </PresenceContext.Provider>
  );
}
