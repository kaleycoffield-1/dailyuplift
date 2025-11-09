-- ============================================
-- CORE TABLES
-- ============================================

-- Users/Profiles table
CREATE TABLE public.users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  notification_morning_time time DEFAULT '08:00:00',
  notification_evening_time time DEFAULT '20:00:00',
  notification_feelings_time time DEFAULT '14:00:00'
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Daily check-ins
CREATE TABLE public.daily_checkins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  morning_completed_at timestamp with time zone,
  intention_text text,
  actions_list text[],
  vibration_method text,
  affirmation_text text,
  evening_completed_at timestamp with time zone,
  day_reflection_text text,
  grateful_text text,
  UNIQUE (user_id, date)
);

CREATE INDEX idx_daily_checkins_user_date ON public.daily_checkins(user_id, date DESC);

ALTER TABLE public.daily_checkins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own daily checkins"
  ON public.daily_checkins FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily checkins"
  ON public.daily_checkins FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily checkins"
  ON public.daily_checkins FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own daily checkins"
  ON public.daily_checkins FOR DELETE
  USING (auth.uid() = user_id);

-- Feelings check-ins
CREATE TABLE public.feelings_checkins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  feeling_score integer NOT NULL CHECK (feeling_score >= 1 AND feeling_score <= 10),
  feeling_labels text[],
  note text
);

CREATE INDEX idx_feelings_checkins_user_created ON public.feelings_checkins(user_id, created_at DESC);

ALTER TABLE public.feelings_checkins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own feelings checkins"
  ON public.feelings_checkins FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own feelings checkins"
  ON public.feelings_checkins FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own feelings checkins"
  ON public.feelings_checkins FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own feelings checkins"
  ON public.feelings_checkins FOR DELETE
  USING (auth.uid() = user_id);

-- Weekly reflections
CREATE TABLE public.weekly_reflections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  week_start_date date NOT NULL,
  week_end_date date NOT NULL,
  went_well_text text,
  manifestations_text text,
  resistance_text text,
  grateful_text text,
  future_self_message text,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX idx_weekly_reflections_user_week ON public.weekly_reflections(user_id, week_start_date DESC);

ALTER TABLE public.weekly_reflections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own weekly reflections"
  ON public.weekly_reflections FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own weekly reflections"
  ON public.weekly_reflections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own weekly reflections"
  ON public.weekly_reflections FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own weekly reflections"
  ON public.weekly_reflections FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- VISION BOARDS (created before goals for FK)
-- ============================================

CREATE TABLE public.vision_boards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  category text NOT NULL,
  title text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX idx_vision_boards_user ON public.vision_boards(user_id, created_at DESC);

ALTER TABLE public.vision_boards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own vision boards"
  ON public.vision_boards FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own vision boards"
  ON public.vision_boards FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own vision boards"
  ON public.vision_boards FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own vision boards"
  ON public.vision_boards FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- GOALS
-- ============================================

CREATE TABLE public.goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  completed boolean DEFAULT false NOT NULL,
  vision_board_id uuid REFERENCES public.vision_boards(id) ON DELETE SET NULL
);

CREATE INDEX idx_goals_user ON public.goals(user_id, created_at DESC);
CREATE INDEX idx_goals_vision_board ON public.goals(vision_board_id);

ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own goals"
  ON public.goals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goals"
  ON public.goals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals"
  ON public.goals FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals"
  ON public.goals FOR DELETE
  USING (auth.uid() = user_id);

-- Goal subgoals
CREATE TABLE public.goal_subgoals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id uuid REFERENCES public.goals(id) ON DELETE CASCADE NOT NULL,
  text text NOT NULL,
  completed boolean DEFAULT false NOT NULL,
  order_index integer NOT NULL
);

CREATE INDEX idx_goal_subgoals_goal ON public.goal_subgoals(goal_id, order_index);

ALTER TABLE public.goal_subgoals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view subgoals of own goals"
  ON public.goal_subgoals FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.goals
    WHERE goals.id = goal_subgoals.goal_id
    AND goals.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert subgoals for own goals"
  ON public.goal_subgoals FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.goals
    WHERE goals.id = goal_subgoals.goal_id
    AND goals.user_id = auth.uid()
  ));

CREATE POLICY "Users can update subgoals of own goals"
  ON public.goal_subgoals FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.goals
    WHERE goals.id = goal_subgoals.goal_id
    AND goals.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete subgoals of own goals"
  ON public.goal_subgoals FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.goals
    WHERE goals.id = goal_subgoals.goal_id
    AND goals.user_id = auth.uid()
  ));

-- Goal inspired actions
CREATE TABLE public.goal_inspired_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id uuid REFERENCES public.goals(id) ON DELETE CASCADE NOT NULL,
  text text NOT NULL,
  completed boolean DEFAULT false NOT NULL,
  order_index integer NOT NULL
);

CREATE INDEX idx_goal_inspired_actions_goal ON public.goal_inspired_actions(goal_id, order_index);

ALTER TABLE public.goal_inspired_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view actions of own goals"
  ON public.goal_inspired_actions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.goals
    WHERE goals.id = goal_inspired_actions.goal_id
    AND goals.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert actions for own goals"
  ON public.goal_inspired_actions FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.goals
    WHERE goals.id = goal_inspired_actions.goal_id
    AND goals.user_id = auth.uid()
  ));

CREATE POLICY "Users can update actions of own goals"
  ON public.goal_inspired_actions FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.goals
    WHERE goals.id = goal_inspired_actions.goal_id
    AND goals.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete actions of own goals"
  ON public.goal_inspired_actions FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.goals
    WHERE goals.id = goal_inspired_actions.goal_id
    AND goals.user_id = auth.uid()
  ));

-- Vision board images
CREATE TABLE public.vision_board_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vision_board_id uuid REFERENCES public.vision_boards(id) ON DELETE CASCADE NOT NULL,
  image_url text NOT NULL,
  image_source text NOT NULL CHECK (image_source IN ('upload', 'ai_generated', 'url')),
  ai_prompt text,
  order_index integer NOT NULL
);

CREATE INDEX idx_vision_board_images_board ON public.vision_board_images(vision_board_id, order_index);

ALTER TABLE public.vision_board_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view images of own vision boards"
  ON public.vision_board_images FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.vision_boards
    WHERE vision_boards.id = vision_board_images.vision_board_id
    AND vision_boards.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert images for own vision boards"
  ON public.vision_board_images FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.vision_boards
    WHERE vision_boards.id = vision_board_images.vision_board_id
    AND vision_boards.user_id = auth.uid()
  ));

CREATE POLICY "Users can update images of own vision boards"
  ON public.vision_board_images FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.vision_boards
    WHERE vision_boards.id = vision_board_images.vision_board_id
    AND vision_boards.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete images of own vision boards"
  ON public.vision_board_images FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.vision_boards
    WHERE vision_boards.id = vision_board_images.vision_board_id
    AND vision_boards.user_id = auth.uid()
  ));

-- Vision board prompts
CREATE TABLE public.vision_board_prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vision_board_id uuid REFERENCES public.vision_boards(id) ON DELETE CASCADE NOT NULL,
  prompt_text text NOT NULL,
  response_text text,
  order_index integer NOT NULL
);

CREATE INDEX idx_vision_board_prompts_board ON public.vision_board_prompts(vision_board_id, order_index);

ALTER TABLE public.vision_board_prompts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view prompts of own vision boards"
  ON public.vision_board_prompts FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.vision_boards
    WHERE vision_boards.id = vision_board_prompts.vision_board_id
    AND vision_boards.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert prompts for own vision boards"
  ON public.vision_board_prompts FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.vision_boards
    WHERE vision_boards.id = vision_board_prompts.vision_board_id
    AND vision_boards.user_id = auth.uid()
  ));

CREATE POLICY "Users can update prompts of own vision boards"
  ON public.vision_board_prompts FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.vision_boards
    WHERE vision_boards.id = vision_board_prompts.vision_board_id
    AND vision_boards.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete prompts of own vision boards"
  ON public.vision_board_prompts FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.vision_boards
    WHERE vision_boards.id = vision_board_prompts.vision_board_id
    AND vision_boards.user_id = auth.uid()
  ));

-- ============================================
-- CHAT
-- ============================================

CREATE TABLE public.chat_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('daily', 'rewire')),
  title text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX idx_chat_conversations_user ON public.chat_conversations(user_id, updated_at DESC);

ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own conversations"
  ON public.chat_conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversations"
  ON public.chat_conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations"
  ON public.chat_conversations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own conversations"
  ON public.chat_conversations FOR DELETE
  USING (auth.uid() = user_id);

-- Chat messages
CREATE TABLE public.chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES public.chat_conversations(id) ON DELETE CASCADE NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX idx_chat_messages_conversation ON public.chat_messages(conversation_id, created_at);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages of own conversations"
  ON public.chat_messages FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.chat_conversations
    WHERE chat_conversations.id = chat_messages.conversation_id
    AND chat_conversations.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert messages in own conversations"
  ON public.chat_messages FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.chat_conversations
    WHERE chat_conversations.id = chat_messages.conversation_id
    AND chat_conversations.user_id = auth.uid()
  ));

CREATE POLICY "Users can update messages in own conversations"
  ON public.chat_messages FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.chat_conversations
    WHERE chat_conversations.id = chat_messages.conversation_id
    AND chat_conversations.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete messages in own conversations"
  ON public.chat_messages FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.chat_conversations
    WHERE chat_conversations.id = chat_messages.conversation_id
    AND chat_conversations.user_id = auth.uid()
  ));

-- ============================================
-- CONTENT LIBRARY
-- ============================================

-- Daily wisdom (public content)
CREATE TABLE public.daily_wisdom (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX idx_daily_wisdom_category ON public.daily_wisdom(category);

ALTER TABLE public.daily_wisdom ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can view wisdom
CREATE POLICY "Authenticated users can view daily wisdom"
  ON public.daily_wisdom FOR SELECT
  TO authenticated
  USING (true);

-- Learning modules (public content)
CREATE TABLE public.learning_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  content text NOT NULL,
  category text NOT NULL,
  order_index integer NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX idx_learning_modules_category_order ON public.learning_modules(category, order_index);

ALTER TABLE public.learning_modules ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can view modules
CREATE POLICY "Authenticated users can view learning modules"
  ON public.learning_modules FOR SELECT
  TO authenticated
  USING (true);

-- Bookmarks
CREATE TABLE public.bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX idx_bookmarks_user ON public.bookmarks(user_id, created_at DESC);

ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bookmarks"
  ON public.bookmarks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookmarks"
  ON public.bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookmarks"
  ON public.bookmarks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookmarks"
  ON public.bookmarks FOR DELETE
  USING (auth.uid() = user_id);

-- Affirmations (user-specific or system-wide)
CREATE TABLE public.affirmations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  text text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX idx_affirmations_user ON public.affirmations(user_id, created_at DESC);

ALTER TABLE public.affirmations ENABLE ROW LEVEL SECURITY;

-- Users can view their own affirmations and system affirmations (where user_id is null)
CREATE POLICY "Users can view own and system affirmations"
  ON public.affirmations FOR SELECT
  USING (user_id IS NULL OR auth.uid() = user_id);

CREATE POLICY "Users can insert own affirmations"
  ON public.affirmations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own affirmations"
  ON public.affirmations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own affirmations"
  ON public.affirmations FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- ANALYTICS
-- ============================================

-- Daily feeling summary
CREATE TABLE public.daily_feeling_summary (
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  avg_score decimal NOT NULL,
  high_score integer NOT NULL,
  low_score integer NOT NULL,
  checkin_count integer NOT NULL,
  PRIMARY KEY (user_id, date)
);

CREATE INDEX idx_daily_feeling_summary_date ON public.daily_feeling_summary(user_id, date DESC);

ALTER TABLE public.daily_feeling_summary ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own feeling summary"
  ON public.daily_feeling_summary FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own feeling summary"
  ON public.daily_feeling_summary FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own feeling summary"
  ON public.daily_feeling_summary FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own feeling summary"
  ON public.daily_feeling_summary FOR DELETE
  USING (auth.uid() = user_id);

-- User feeling baseline
CREATE TABLE public.user_feeling_baseline (
  user_id uuid PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  baseline_score decimal,
  baseline_calculated_at timestamp with time zone,
  total_checkins integer DEFAULT 0 NOT NULL,
  first_checkin_date date
);

ALTER TABLE public.user_feeling_baseline ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own feeling baseline"
  ON public.user_feeling_baseline FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own feeling baseline"
  ON public.user_feeling_baseline FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own feeling baseline"
  ON public.user_feeling_baseline FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own feeling baseline"
  ON public.user_feeling_baseline FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- TRIGGER: Auto-create user profile on signup
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name')
  );
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();