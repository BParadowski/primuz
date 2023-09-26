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
      availability: {
        Row: {
          message: string | null
          project_id: string
          status: Database["public"]["Enums"]["availability_status"]
          user_id: string
        }
        Insert: {
          message?: string | null
          project_id: string
          status?: Database["public"]["Enums"]["availability_status"]
          user_id: string
        }
        Update: {
          message?: string | null
          project_id?: string
          status?: Database["public"]["Enums"]["availability_status"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "availability_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "availability_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "projects_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "availability_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "availability_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "sorted_musicians_availability"
            referencedColumns: ["user_id"]
          }
        ]
      }
      projects: {
        Row: {
          created_at: string
          date: string
          description: string | null
          google_calendar_description: string | null
          google_calendar_id: string | null
          id: string
          location: string | null
          name: string | null
          pay: string | null
        }
        Insert: {
          created_at?: string
          date: string
          description?: string | null
          google_calendar_description?: string | null
          google_calendar_id?: string | null
          id?: string
          location?: string | null
          name?: string | null
          pay?: string | null
        }
        Update: {
          created_at?: string
          date?: string
          description?: string | null
          google_calendar_description?: string | null
          google_calendar_id?: string | null
          id?: string
          location?: string | null
          name?: string | null
          pay?: string | null
        }
        Relationships: []
      }
      rehearsals: {
        Row: {
          created_at: string
          description: string | null
          end_datetime: string 
          google_calendar_id: string | null
          id: string
          location: string | null
          project_id: string
          start_datetime: string 
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_datetime?: string | null
          google_calendar_id?: string | null
          id?: string
          location?: string | null
          project_id: string
          start_datetime?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          end_datetime?: string | null
          google_calendar_id?: string | null
          id?: string
          location?: string | null
          project_id?: string
          start_datetime?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rehearsals_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rehearsals_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "projects_summary"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          created_at: string
          first_name: string | null
          instrument: Database["public"]["Enums"]["instrument"]
          is_admin: boolean
          last_name: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          first_name?: string | null
          instrument?: Database["public"]["Enums"]["instrument"]
          is_admin?: boolean
          last_name?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          first_name?: string | null
          instrument?: Database["public"]["Enums"]["instrument"]
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
      projects_summary: {
        Row: {
          date: string
          id: string 
          location: string | null
          message: string | null
          name: string
          status: Database["public"]["Enums"]["availability_status"] 
        }
        Relationships: []
      }
      sorted_musicians_availability: {
        Row: {
          first_name: string | null
          instrument: Database["public"]["Enums"]["instrument"] 
          last_name: string | null
          message: string | null
          status: Database["public"]["Enums"]["availability_status"] 
          user_id: string
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
    Functions: {
      [_ in never]: never
    }
    Enums: {
      availability_status: "available" | "unavailable" | "maybe" | "undeclared"
      instrument: "skrzypce" | "altówka" | "wiolonczela" | "kontrabas"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
