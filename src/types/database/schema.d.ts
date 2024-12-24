type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      DailyCostars: {
        Row: {
          date: string
          id: number
          starter: GameEntity
          target: GameEntity
          num_solutions: number,
          day_number: number
        }
        Insert: {
          date: string
          id?: number
          starter: GameEntity
          target: GameEntity
          num_solutions: number
          day_number: number
        }
        Update: {
          date?: string
          id?: number
          starter?: GameEntity
          target?: GameEntity
          num_solutions?: number
          day_number?: number
        }
        Relationships: []
      }
      DailyStats: {
        Row: {
          current_streak: number
          days_played: number
          highest_streak: number
          id: number
          optimal_solutions: number
          user_id: string
          updated_at: string
          last_played?: string
          last_played_id?: number
        }
        Insert: {
          current_streak?: number
          days_played?: number
          highest_streak?: number
          id?: number
          optimal_solutions?: number
          user_id?: string
          last_played?: string
          last_played_id?: number
          updated_at?: string
        }
        Update: {
          current_streak?: number
          days_played?: number
          highest_streak?: number
          id?: number
          optimal_solutions?: number
          user_id?: string
          last_played?: string
          last_played_id?: number
          updated_at?: string
        }
        Relationships: []
      }
      Solutions: {
        Row: {
          daily_id: number | null
          hints: Array<Hint>
          id: string
          is_daily_optimal: boolean
          is_temporary: boolean
          solution: Array<GameEntity>
          user_id: string | null,
          created_at: Date
        }
        Insert: {
          daily_id?: number | null
          hints?: Array<Hint>
          id?: string
          is_daily_optimal?: boolean
          is_temporary?: boolean
          solution: Array<GameEntity>
          user_id?: string | null,
          created_at?: Date
        }
        Update: {
          daily_id?: number | null
          hints?: Array<Hint>
          id?: string
          is_daily_optimal?: boolean
          is_temporary?: boolean
          solution?: Array<GameEntity>
          user_id?: string | null,
          created_at?: Date
        }
        Relationships: [
          {
            foreignKeyName: "Solutions_daily_id_fkey"
            columns: ["daily_id"]
            isOneToOne: false
            referencedRelation: "DailyCostars"
            referencedColumns: ["id"]
          },
        ]
      }
      UnlimitedStats: {
        Row: {
          high_score: number
          hints: Array<Hint>
          history: Array<GameEntity>
          id: number
          user_id: string
          updated_at: string
        }
        Insert: {
          high_score?: number
          hints?: Array<Hint>
          history?: Array<GameEntity>
          id?: number
          user_id?: string
          updated_at?: string
        }
        Update: {
          high_score?: number
          hints?: Array<Hint>
          history?: Array<GameEntity>
          id?: number
          user_id?: string
          updated_at?: string
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

type PublicSchema = Database[Extract<keyof Database, "public">]

type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
