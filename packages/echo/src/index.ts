/**
 * @nadi/echo - Laravel Echo integration for Nadi
 */

import { signal, batch, onCleanup } from '@nadi.js/core';
import type Echo from 'laravel-echo';

export interface NadiEcho {
  channel<T = any>(name: string): NadiChannel<T>;
  private<T = any>(name: string): NadiPrivateChannel<T>;
  presence<T = any>(name: string): NadiPresenceChannel<T>;
  leave(name: string): void;
}

export interface NadiChannel<T = any> {
  listen(event: string): () => T | null;
  stopListening(event: string): void;
}

export interface NadiPrivateChannel<T = any> extends NadiChannel<T> {
  whisper(event: string, data: any): void;
}

export interface NadiPresenceChannel<T = any> extends NadiPrivateChannel<T> {
  here: () => any[];
  joining: () => any | null;
  leaving: () => any | null;
}

export function createEcho(echoInstance: Echo): NadiEcho {
  const channels = new Map<string, any>();

  return {
    channel<T = any>(name: string): NadiChannel<T> {
      if (channels.has(name)) {
        return channels.get(name);
      }

      const channel = echoInstance.channel(name);
      const listeners = new Map<string, ReturnType<typeof signal<T | null>>>();

      const nadiChannel: NadiChannel<T> = {
        listen(event: string) {
          if (!listeners.has(event)) {
            const [data, setData] = signal<T | null>(null);

            channel.listen(event, (payload: T) => {
              batch(() => setData(payload));
            });

            listeners.set(event, [data, setData]);
          }

          return listeners.get(event)![0];
        },

        stopListening(event: string) {
          if (listeners.has(event)) {
            channel.stopListening(event);
            listeners.delete(event);
          }
        },
      };

      channels.set(name, nadiChannel);
      return nadiChannel;
    },

    private<T = any>(name: string): NadiPrivateChannel<T> {
      const baseChannel = this.channel<T>(name);
      const privateChannel = echoInstance.private(name);

      return {
        ...baseChannel,
        whisper(event: string, data: any) {
          privateChannel.whisper(event, data);
        },
      };
    },

    presence<T = any>(name: string): NadiPresenceChannel<T> {
      const privateChannel = this.private<T>(name);
      const presenceChannel = echoInstance.join(name);

      const [here, setHere] = signal<any[]>([]);
      const [joining, setJoining] = signal<any | null>(null);
      const [leaving, setLeaving] = signal<any | null>(null);

      presenceChannel
        .here((members: any[]) => {
          batch(() => setHere(members));
        })
        .joining((member: any) => {
          batch(() => {
            setJoining(member);
            setHere([...here(), member]);
          });
        })
        .leaving((member: any) => {
          batch(() => {
            setLeaving(member);
            setHere(here().filter((m) => m.id !== member.id));
          });
        });

      return {
        ...privateChannel,
        here,
        joining,
        leaving,
      };
    },

    leave(name: string) {
      echoInstance.leave(name);
      channels.delete(name);
    },
  };
}

// Convenience hooks
export function useChannel<T = any>(echo: NadiEcho, channelName: string, event: string) {
  const channel = echo.channel<T>(channelName);
  const data = channel.listen(event);

  onCleanup(() => {
    echo.leave(channelName);
  });

  return data;
}

export function usePrivateChannel<T = any>(echo: NadiEcho, channelName: string, event: string) {
  const channel = echo.private<T>(channelName);
  const data = channel.listen(event);

  onCleanup(() => {
    echo.leave(channelName);
  });

  return [data, (e: string, d: any) => channel.whisper(e, d)] as const;
}

export function usePresence<T = any>(echo: NadiEcho, channelName: string) {
  const channel = echo.presence<T>(channelName);

  onCleanup(() => {
    echo.leave(channelName);
  });

  return {
    here: channel.here,
    joining: channel.joining,
    leaving: channel.leaving,
    whisper: (event: string, data: any) => channel.whisper(event, data),
    listen: (event: string) => channel.listen(event),
  };
}
