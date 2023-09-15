export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          created_at: string
          id: number
          name: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          name?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          first_name: string | null
          instrument: Database["public"]["Enums"]["instrument"] | null
          is_admin: boolean
          last_name: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          first_name?: string | null
          instrument?: Database["public"]["Enums"]["instrument"] | null
          is_admin?: boolean
          last_name?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          first_name?: string | null
          instrument?: Database["public"]["Enums"]["instrument"] | null
          is_admin?: boolean
          last_name?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
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
      instrument: "skrzypce" | "altówka" | "wiolonczela" | "kontrabas"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
