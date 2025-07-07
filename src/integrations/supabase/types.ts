export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
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
          country: string | null
          created_at: string
          date: string | null
          description: string | null
          genre: string | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          is_festival: boolean | null
          is_hidden: boolean | null
          max_price: number | null
          on_sale_date: string | null
          price: number | null
          raw_data: Json | null
          raw_date: string | null
          start_price: number | null
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
          country?: string | null
          created_at?: string
          date?: string | null
          description?: string | null
          genre?: string | null
          id: string
          image_url?: string | null
          is_featured?: boolean | null
          is_festival?: boolean | null
          is_hidden?: boolean | null
          max_price?: number | null
          on_sale_date?: string | null
          price?: number | null
          raw_data?: Json | null
          raw_date?: string | null
          start_price?: number | null
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
          country?: string | null
          created_at?: string
          date?: string | null
          description?: string | null
          genre?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          is_festival?: boolean | null
          is_hidden?: boolean | null
          max_price?: number | null
          on_sale_date?: string | null
          price?: number | null
          raw_data?: Json | null
          raw_date?: string | null
          start_price?: number | null
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
      festival_reviews: {
        Row: {
          additional_images: string[] | null
          artist: string
          content: string
          created_at: string
          end_date: string
          id: string
          image_url: string | null
          start_date: string
          title: string
          updated_at: string
          venue: string
        }
        Insert: {
          additional_images?: string[] | null
          artist: string
          content: string
          created_at?: string
          end_date: string
          id?: string
          image_url?: string | null
          start_date: string
          title: string
          updated_at?: string
          venue: string
        }
        Update: {
          additional_images?: string[] | null
          artist?: string
          content?: string
          created_at?: string
          end_date?: string
          id?: string
          image_url?: string | null
          start_date?: string
          title?: string
          updated_at?: string
          venue?: string
        }
        Relationships: []
      }
      news_items: {
        Row: {
          author: string | null
          category: string | null
          content: string
          created_at: string
          date: string
          excerpt: string | null
          id: string
          image_url: string | null
          tags: string[] | null
          title: string
          updated_at: string
          url: string | null
        }
        Insert: {
          author?: string | null
          category?: string | null
          content: string
          created_at?: string
          date: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          author?: string | null
          category?: string | null
          content?: string
          created_at?: string
          date?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          additional_images: string[] | null
          artist: string
          content: string
          created_at: string
          date: string
          id: string
          image_url: string | null
          title: string
          updated_at: string
          venue: string
        }
        Insert: {
          additional_images?: string[] | null
          artist: string
          content: string
          created_at?: string
          date: string
          id?: string
          image_url?: string | null
          title: string
          updated_at?: string
          venue: string
        }
        Update: {
          additional_images?: string[] | null
          artist?: string
          content?: string
          created_at?: string
          date?: string
          id?: string
          image_url?: string | null
          title?: string
          updated_at?: string
          venue?: string
        }
        Relationships: []
      }
      rss_feeds: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          last_fetched: string | null
          name: string
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_fetched?: string | null
          name: string
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_fetched?: string | null
          name?: string
          url?: string
        }
        Relationships: []
      }
      rss_items: {
        Row: {
          author: string | null
          content: string | null
          created_at: string
          excerpt: string | null
          feed_id: string | null
          id: string
          image_url: string | null
          is_deleted: boolean | null
          is_published: boolean | null
          published_date: string | null
          title: string
          url: string | null
        }
        Insert: {
          author?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          feed_id?: string | null
          id?: string
          image_url?: string | null
          is_deleted?: boolean | null
          is_published?: boolean | null
          published_date?: string | null
          title: string
          url?: string | null
        }
        Update: {
          author?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          feed_id?: string | null
          id?: string
          image_url?: string | null
          is_deleted?: boolean | null
          is_published?: boolean | null
          published_date?: string | null
          title?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rss_items_feed_id_fkey"
            columns: ["feed_id"]
            isOneToOne: false
            referencedRelation: "rss_feeds"
            referencedColumns: ["id"]
          },
        ]
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
      admin_add_event: {
        Args: { event_data: Json } | { event_data: string }
        Returns: undefined
      }
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
