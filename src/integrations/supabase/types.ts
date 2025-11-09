export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      affirmations: {
        Row: {
          created_at: string
          id: string
          text: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          text: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          text?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affirmations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      bookmarks: {
        Row: {
          content: string
          created_at: string
          id: string
          type: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          type: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_conversations: {
        Row: {
          created_at: string
          id: string
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          title: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_conversations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          role: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_checkins: {
        Row: {
          actions_list: string[] | null
          affirmation_text: string | null
          date: string
          day_reflection_text: string | null
          evening_completed_at: string | null
          grateful_text: string | null
          id: string
          intention_text: string | null
          morning_completed_at: string | null
          user_id: string
          vibration_method: string | null
        }
        Insert: {
          actions_list?: string[] | null
          affirmation_text?: string | null
          date: string
          day_reflection_text?: string | null
          evening_completed_at?: string | null
          grateful_text?: string | null
          id?: string
          intention_text?: string | null
          morning_completed_at?: string | null
          user_id: string
          vibration_method?: string | null
        }
        Update: {
          actions_list?: string[] | null
          affirmation_text?: string | null
          date?: string
          day_reflection_text?: string | null
          evening_completed_at?: string | null
          grateful_text?: string | null
          id?: string
          intention_text?: string | null
          morning_completed_at?: string | null
          user_id?: string
          vibration_method?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "daily_checkins_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_feeling_summary: {
        Row: {
          avg_score: number
          checkin_count: number
          date: string
          high_score: number
          low_score: number
          user_id: string
        }
        Insert: {
          avg_score: number
          checkin_count: number
          date: string
          high_score: number
          low_score: number
          user_id: string
        }
        Update: {
          avg_score?: number
          checkin_count?: number
          date?: string
          high_score?: number
          low_score?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_feeling_summary_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_wisdom: {
        Row: {
          category: string
          content: string
          created_at: string
          id: string
          title: string
        }
        Insert: {
          category: string
          content: string
          created_at?: string
          id?: string
          title: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          id?: string
          title?: string
        }
        Relationships: []
      }
      feelings_checkins: {
        Row: {
          created_at: string
          feeling_labels: string[] | null
          feeling_score: number
          id: string
          note: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          feeling_labels?: string[] | null
          feeling_score: number
          id?: string
          note?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          feeling_labels?: string[] | null
          feeling_score?: number
          id?: string
          note?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feelings_checkins_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      goal_inspired_actions: {
        Row: {
          completed: boolean
          goal_id: string
          id: string
          order_index: number
          text: string
        }
        Insert: {
          completed?: boolean
          goal_id: string
          id?: string
          order_index: number
          text: string
        }
        Update: {
          completed?: boolean
          goal_id?: string
          id?: string
          order_index?: number
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "goal_inspired_actions_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
        ]
      }
      goal_subgoals: {
        Row: {
          completed: boolean
          goal_id: string
          id: string
          order_index: number
          text: string
        }
        Insert: {
          completed?: boolean
          goal_id: string
          id?: string
          order_index: number
          text: string
        }
        Update: {
          completed?: boolean
          goal_id?: string
          id?: string
          order_index?: number
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "goal_subgoals_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
        ]
      }
      goals: {
        Row: {
          completed: boolean
          created_at: string
          description: string | null
          id: string
          title: string
          user_id: string
          vision_board_id: string | null
        }
        Insert: {
          completed?: boolean
          created_at?: string
          description?: string | null
          id?: string
          title: string
          user_id: string
          vision_board_id?: string | null
        }
        Update: {
          completed?: boolean
          created_at?: string
          description?: string | null
          id?: string
          title?: string
          user_id?: string
          vision_board_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "goals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "goals_vision_board_id_fkey"
            columns: ["vision_board_id"]
            isOneToOne: false
            referencedRelation: "vision_boards"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_modules: {
        Row: {
          category: string
          content: string
          created_at: string
          description: string
          id: string
          order_index: number
          title: string
        }
        Insert: {
          category: string
          content: string
          created_at?: string
          description: string
          id?: string
          order_index: number
          title: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          description?: string
          id?: string
          order_index?: number
          title?: string
        }
        Relationships: []
      }
      user_feeling_baseline: {
        Row: {
          baseline_calculated_at: string | null
          baseline_score: number | null
          first_checkin_date: string | null
          total_checkins: number
          user_id: string
        }
        Insert: {
          baseline_calculated_at?: string | null
          baseline_score?: number | null
          first_checkin_date?: string | null
          total_checkins?: number
          user_id: string
        }
        Update: {
          baseline_calculated_at?: string | null
          baseline_score?: number | null
          first_checkin_date?: string | null
          total_checkins?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_feeling_baseline_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string | null
          notification_evening_time: string | null
          notification_feelings_time: string | null
          notification_morning_time: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          name?: string | null
          notification_evening_time?: string | null
          notification_feelings_time?: string | null
          notification_morning_time?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          notification_evening_time?: string | null
          notification_feelings_time?: string | null
          notification_morning_time?: string | null
        }
        Relationships: []
      }
      vision_board_images: {
        Row: {
          ai_prompt: string | null
          id: string
          image_source: string
          image_url: string
          order_index: number
          vision_board_id: string
        }
        Insert: {
          ai_prompt?: string | null
          id?: string
          image_source: string
          image_url: string
          order_index: number
          vision_board_id: string
        }
        Update: {
          ai_prompt?: string | null
          id?: string
          image_source?: string
          image_url?: string
          order_index?: number
          vision_board_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vision_board_images_vision_board_id_fkey"
            columns: ["vision_board_id"]
            isOneToOne: false
            referencedRelation: "vision_boards"
            referencedColumns: ["id"]
          },
        ]
      }
      vision_board_prompts: {
        Row: {
          id: string
          order_index: number
          prompt_text: string
          response_text: string | null
          vision_board_id: string
        }
        Insert: {
          id?: string
          order_index: number
          prompt_text: string
          response_text?: string | null
          vision_board_id: string
        }
        Update: {
          id?: string
          order_index?: number
          prompt_text?: string
          response_text?: string | null
          vision_board_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vision_board_prompts_vision_board_id_fkey"
            columns: ["vision_board_id"]
            isOneToOne: false
            referencedRelation: "vision_boards"
            referencedColumns: ["id"]
          },
        ]
      }
      vision_boards: {
        Row: {
          category: string
          created_at: string
          id: string
          title: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          title: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vision_boards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      weekly_reflections: {
        Row: {
          created_at: string
          future_self_message: string | null
          grateful_text: string | null
          id: string
          manifestations_text: string | null
          resistance_text: string | null
          user_id: string
          week_end_date: string
          week_start_date: string
          went_well_text: string | null
        }
        Insert: {
          created_at?: string
          future_self_message?: string | null
          grateful_text?: string | null
          id?: string
          manifestations_text?: string | null
          resistance_text?: string | null
          user_id: string
          week_end_date: string
          week_start_date: string
          went_well_text?: string | null
        }
        Update: {
          created_at?: string
          future_self_message?: string | null
          grateful_text?: string | null
          id?: string
          manifestations_text?: string | null
          resistance_text?: string | null
          user_id?: string
          week_end_date?: string
          week_start_date?: string
          went_well_text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "weekly_reflections_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
