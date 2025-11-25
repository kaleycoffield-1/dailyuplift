import { useState, useCallback } from 'react';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

type UseStreamingChatOptions = {
  type?: 'daily' | 'rewire';
  onError?: (error: Error) => void;
};

export const useStreamingChat = (options: UseStreamingChatOptions = {}) => {
  const { type = 'daily', onError } = options;
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (
    messages: Message[],
    onChunk: (chunk: string) => void,
    onComplete: () => void
  ) => {
    setIsLoading(true);
    
    try {
      const response = await fetch(
        'https://skmfggeirhuanrdiepha.supabase.co/functions/v1/chat',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: messages.map(m => ({
              role: m.role,
              content: m.content
            })),
            type,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response body');
      }

      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            
            if (data === '[DONE]') {
              continue;
            }

            try {
              const parsed = JSON.parse(data);
              
              if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
                onChunk(parsed.delta.text);
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e);
            }
          }
        }
      }

      onComplete();
    } catch (error) {
      console.error('Streaming chat error:', error);
      if (onError && error instanceof Error) {
        onError(error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [type, onError]);

  return { sendMessage, isLoading };
};
