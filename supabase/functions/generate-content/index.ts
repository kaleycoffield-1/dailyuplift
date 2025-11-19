import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type } = await req.json();
    
    // Validate input type
    if (!type || (type !== 'wisdom' && type !== 'affirmation')) {
      return new Response(
        JSON.stringify({ error: 'Invalid type. Must be "wisdom" or "affirmation"' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract authenticated user ID from JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify the JWT and get user
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');
    if (!ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is not configured');
    }

    let systemPrompt = '';
    let userPrompt = '';

    if (type === 'wisdom') {
      systemPrompt = "You are a wise mentor sharing daily insights. Generate a short, inspiring piece of wisdom (2-3 sentences) that helps people live more intentionally and joyfully.";
      userPrompt = "Generate a daily wisdom message with a short title (2-3 words) and content (2-3 sentences).";
    } else if (type === 'affirmation') {
      systemPrompt = "You are a supportive coach creating personalized affirmations. Generate a powerful, present-tense affirmation that builds confidence and positive self-belief.";
      userPrompt = "Generate a personal affirmation (1-2 sentences, starting with 'I am' or 'I have').";
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Anthropic API error:', response.status, error);
      throw new Error('Failed to generate content');
    }

    const data = await response.json();
    const content = data.content[0].text;

    // Store in database (supabase client already created above)
    if (type === 'wisdom') {
      // Parse title and content from the response
      const lines = content.split('\n').filter((line: string) => line.trim());
      const title = lines[0]
        .replace(/^(Title:|#)\s*/i, '')
        .replace(/\*\*/g, '')  // Remove bold markdown
        .replace(/\*/g, '')     // Remove italic markdown
        .replace(/_/g, '')      // Remove underscores
        .trim();
      const bodyContent = lines.slice(1).join(' ').trim();

      const { data: wisdom, error } = await supabase
        .from('daily_wisdom')
        .insert({
          title,
          content: bodyContent,
          category: 'mindfulness',
        })
        .select()
        .single();

      if (error) throw error;
      return new Response(JSON.stringify(wisdom), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else if (type === 'affirmation') {
      const { data: affirmation, error } = await supabase
        .from('affirmations')
        .insert({
          text: content,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return new Response(JSON.stringify(affirmation), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ content }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Generate content error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), 
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
