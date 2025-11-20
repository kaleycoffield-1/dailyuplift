import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

type ContentType = 'wisdom' | 'affirmation';

export const useGenerateContent = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateContent = async (type: ContentType, userId?: string) => {
    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: { type, userId }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error generating content:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  return { generateContent, isGenerating };
};
