export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      cache_metadata: {
        Row: {
          id: string
          last_updated: string
          record_count: number | null
          source: string
          status: string | null
        }
        Insert: {
          id: string
          last_updated: string
          record_count?: number | null
          source: string
          status?: string | null
        }
        Update: {
          id?: string
          last_updated?: string
          record_count?: number | null
          source?: string
          status?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          artist: string | null
          artist_links: Json | null
          created_at: string
          date: string | null
          description: string | null
          genre: string | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          is_hidden: boolean | null
          on_sale_date: string | null
          price: number | null
          raw_data: Json | null
          raw_date: string | null
          subgenre: string | null
          ticket_url: string | null
          time: string | null
          title: string
          type: string | null
          updated_at: string
          venue: string | null
          venue_id: string | null
        }
        Insert: {
          artist?: string | null
          artist_links?: Json | null
          created_at?: string
          date?: string | null
          description?: string | null
          genre?: string | null
          id: string
          image_url?: string | null
          is_featured?: boolean | null
          is_hidden?: boolean | null
          on_sale_date?: string | null
          price?: number | null
          raw_data?: Json | null
          raw_date?: string | null
          subgenre?: string | null
          ticket_url?: string | null
          time?: string | null
          title: string
          type?: string | null
          updated_at?: string
          venue?: string | null
          venue_id?: string | null
        }
        Update: {
          artist?: string | null
          artist_links?: Json | null
          created_at?: string
          date?: string | null
          description?: string | null
          genre?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          is_hidden?: boolean | null
          on_sale_date?: string | null
          price?: number | null
          raw_data?: Json | null
          raw_date?: string | null
          subgenre?: string | null
          ticket_url?: string | null
          time?: string | null
          title?: string
          type?: string | null
          updated_at?: string
          venue?: string | null
          venue_id?: string | null
        }
        Relationships: []
      }
      user_favorite_events: {
        Row: {
          created_at: string
          event_id: string
          id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: number
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorite_events_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_favorite_events_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events_with_venues"
            referencedColumns: ["id"]
          },
        ]
      }
      venues: {
        Row: {
          address: string | null
          city: string | null
          country: string | null
          created_at: string
          id: string
          image_url: string | null
          latitude: number | null
          longitude: number | null
          name: string
          postal_code: string | null
          raw_data: Json | null
          state: string | null
          updated_at: string
          url: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          id: string
          image_url?: string | null
          latitude?: number | null
          longitude?: number | null
          name: string
          postal_code?: string | null
          raw_data?: Json | null
          state?: string | null
          updated_at?: string
          url?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          postal_code?: string | null
          raw_data?: Json | null
          state?: string | null
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      events_with_venues: {
        Row: {
          address: string | null
          artist: string | null
          city: string | null
          date: string | null
          genre: string | null
          id: string | null
          image_url: string | null
          latitude: number | null
          longitude: number | null
          on_sale_date: string | null
          price: number | null
          raw_date: string | null
          subgenre: string | null
          ticket_url: string | null
          time: string | null
          title: string | null
          type: string | null
          venue: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      should_update_cache: {
        Args: { cache_id: string; interval_hours: number }
        Returns: boolean
      }
      update_cache_metadata: {
        Args: {
          cache_id: string
          source: string
          count?: number
          status?: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
