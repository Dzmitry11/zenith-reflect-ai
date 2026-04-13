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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      check_ins: {
        Row: {
          created_at: string
          energy_score: number | null
          id: string
          mood_score: number | null
          notes: string | null
          primary_emotion: string | null
          session_id: string | null
          stress_score: number | null
          support_need: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          energy_score?: number | null
          id?: string
          mood_score?: number | null
          notes?: string | null
          primary_emotion?: string | null
          session_id?: string | null
          stress_score?: number | null
          support_need?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          energy_score?: number | null
          id?: string
          mood_score?: number | null
          notes?: string | null
          primary_emotion?: string | null
          session_id?: string | null
          stress_score?: number | null
          support_need?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "check_ins_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_usage_events: {
        Row: {
          created_at: string
          event_name: string
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          created_at?: string
          event_name: string
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          created_at?: string
          event_name?: string
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          content: string
          created_at: string
          id: string
          session_id: string | null
          template_type: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          session_id?: string | null
          template_type: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          session_id?: string | null
          template_type?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "journal_entries_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      memory_items: {
        Row: {
          confidence: string
          content: string
          created_at: string
          id: string
          last_used_at: string | null
          origin: string
          sensitive: boolean | null
          source_session_id: string | null
          status: string
          type: string
          updated_at: string
          user_confirmed: boolean | null
          user_id: string
        }
        Insert: {
          confidence?: string
          content: string
          created_at?: string
          id?: string
          last_used_at?: string | null
          origin?: string
          sensitive?: boolean | null
          source_session_id?: string | null
          status?: string
          type: string
          updated_at?: string
          user_confirmed?: boolean | null
          user_id: string
        }
        Update: {
          confidence?: string
          content?: string
          created_at?: string
          id?: string
          last_used_at?: string | null
          origin?: string
          sensitive?: boolean | null
          source_session_id?: string | null
          status?: string
          type?: string
          updated_at?: string
          user_confirmed?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "memory_items_source_session_id_fkey"
            columns: ["source_session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          metadata: Json | null
          role: string
          session_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          metadata?: Json | null
          role: string
          session_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          role?: string
          session_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          locale: string | null
          onboarding_completed: boolean | null
          timezone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id: string
          locale?: string | null
          onboarding_completed?: boolean | null
          timezone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          locale?: string | null
          onboarding_completed?: boolean | null
          timezone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      safety_events: {
        Row: {
          action_taken: string | null
          created_at: string
          id: string
          session_id: string | null
          severity: string
          signals: Json | null
          user_id: string
        }
        Insert: {
          action_taken?: string | null
          created_at?: string
          id?: string
          session_id?: string | null
          severity: string
          signals?: Json | null
          user_id: string
        }
        Update: {
          action_taken?: string | null
          created_at?: string
          id?: string
          session_id?: string | null
          severity?: string
          signals?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "safety_events_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      session_insights: {
        Row: {
          created_at: string
          emotion_labels: Json | null
          helpful_interventions: Json | null
          id: string
          next_step: string | null
          session_id: string
          trigger_labels: Json | null
          user_id: string
        }
        Insert: {
          created_at?: string
          emotion_labels?: Json | null
          helpful_interventions?: Json | null
          id?: string
          next_step?: string | null
          session_id: string
          trigger_labels?: Json | null
          user_id: string
        }
        Update: {
          created_at?: string
          emotion_labels?: Json | null
          helpful_interventions?: Json | null
          id?: string
          next_step?: string | null
          session_id?: string
          trigger_labels?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_insights_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          created_at: string
          ended_at: string | null
          id: string
          mode: string
          risk_level: string | null
          started_at: string
          status: string
          summary: string | null
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          ended_at?: string | null
          id?: string
          mode: string
          risk_level?: string | null
          started_at?: string
          status?: string
          summary?: string | null
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          ended_at?: string | null
          id?: string
          mode?: string
          risk_level?: string | null
          started_at?: string
          status?: string
          summary?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          current_period_end: string | null
          id: string
          plan_tier: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          id?: string
          plan_tier?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          id?: string
          plan_tier?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      therapy_prep_notes: {
        Row: {
          created_at: string
          emotions: string | null
          generated_summary: string | null
          hard_to_say: string | null
          id: string
          key_events: string | null
          questions_for_therapist: string | null
          repeated_triggers: string | null
          session_id: string | null
          upcoming_session_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          emotions?: string | null
          generated_summary?: string | null
          hard_to_say?: string | null
          id?: string
          key_events?: string | null
          questions_for_therapist?: string | null
          repeated_triggers?: string | null
          session_id?: string | null
          upcoming_session_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          emotions?: string | null
          generated_summary?: string | null
          hard_to_say?: string | null
          id?: string
          key_events?: string | null
          questions_for_therapist?: string | null
          repeated_triggers?: string | null
          session_id?: string | null
          upcoming_session_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "therapy_prep_notes_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          companion_avatar: string | null
          created_at: string
          id: string
          main_goal: string | null
          memory_enabled: boolean | null
          preferred_session_length: string | null
          response_length_preference: string | null
          tone_preference: string | null
          updated_at: string
          user_id: string
          weekly_summary_enabled: boolean | null
        }
        Insert: {
          companion_avatar?: string | null
          created_at?: string
          id?: string
          main_goal?: string | null
          memory_enabled?: boolean | null
          preferred_session_length?: string | null
          response_length_preference?: string | null
          tone_preference?: string | null
          updated_at?: string
          user_id: string
          weekly_summary_enabled?: boolean | null
        }
        Update: {
          companion_avatar?: string | null
          created_at?: string
          id?: string
          main_goal?: string | null
          memory_enabled?: boolean | null
          preferred_session_length?: string | null
          response_length_preference?: string | null
          tone_preference?: string | null
          updated_at?: string
          user_id?: string
          weekly_summary_enabled?: boolean | null
        }
        Relationships: []
      }
      weekly_summaries: {
        Row: {
          created_at: string
          helpful_patterns: Json | null
          id: string
          recurring_emotions: Json | null
          recurring_triggers: Json | null
          summary: string
          user_id: string
          week_end_date: string
          week_start_date: string
        }
        Insert: {
          created_at?: string
          helpful_patterns?: Json | null
          id?: string
          recurring_emotions?: Json | null
          recurring_triggers?: Json | null
          summary: string
          user_id: string
          week_end_date: string
          week_start_date: string
        }
        Update: {
          created_at?: string
          helpful_patterns?: Json | null
          id?: string
          recurring_emotions?: Json | null
          recurring_triggers?: Json | null
          summary?: string
          user_id?: string
          week_end_date?: string
          week_start_date?: string
        }
        Relationships: []
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
