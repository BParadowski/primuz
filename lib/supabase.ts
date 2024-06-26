export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      announcements: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          project_id: string | null;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          project_id?: string | null;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          project_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "announcements_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "announcements_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects_summary";
            referencedColumns: ["id"];
          },
        ];
      };
      availability: {
        Row: {
          message: string | null;
          project_id: string;
          status: Database["public"]["Enums"]["availability_status"];
          user_id: string;
        };
        Insert: {
          message?: string | null;
          project_id: string;
          status?: Database["public"]["Enums"]["availability_status"];
          user_id: string;
        };
        Update: {
          message?: string | null;
          project_id?: string;
          status?: Database["public"]["Enums"]["availability_status"];
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "availability_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "availability_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects_summary";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "availability_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "sorted_musicians_availability";
            referencedColumns: ["user_id"];
          },
          {
            foreignKeyName: "availability_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["user_id"];
          },
        ];
      };
      config: {
        Row: {
          id: string;
          value: string;
        };
        Insert: {
          id: string;
          value: string;
        };
        Update: {
          id?: string;
          value?: string;
        };
        Relationships: [];
      };
      parts: {
        Row: {
          file_name: string;
          id: string;
          instrument: Database["public"]["Enums"]["instrument"];
          name: string;
          piece_id: string;
        };
        Insert: {
          file_name: string;
          id?: string;
          instrument: Database["public"]["Enums"]["instrument"];
          name: string;
          piece_id: string;
        };
        Update: {
          file_name?: string;
          id?: string;
          instrument?: Database["public"]["Enums"]["instrument"];
          name?: string;
          piece_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "parts_piece_id_fkey";
            columns: ["piece_id"];
            isOneToOne: false;
            referencedRelation: "pieces";
            referencedColumns: ["id"];
          },
        ];
      };
      pieces: {
        Row: {
          composer: string;
          id: string;
          name: string;
        };
        Insert: {
          composer: string;
          id?: string;
          name: string;
        };
        Update: {
          composer?: string;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          created_at: string;
          date: string;
          description: string | null;
          google_calendar_description: string | null;
          google_calendar_id: string;
          id: string;
          location: string | null;
          musicians: string[] | null;
          musicians_structure: Json | null;
          name: string;
          pay: string | null;
        };
        Insert: {
          created_at?: string;
          date: string;
          description?: string | null;
          google_calendar_description?: string | null;
          google_calendar_id: string;
          id?: string;
          location?: string | null;
          musicians?: string[] | null;
          musicians_structure?: Json | null;
          name?: string;
          pay?: string | null;
        };
        Update: {
          created_at?: string;
          date?: string;
          description?: string | null;
          google_calendar_description?: string | null;
          google_calendar_id?: string;
          id?: string;
          location?: string | null;
          musicians?: string[] | null;
          musicians_structure?: Json | null;
          name?: string;
          pay?: string | null;
        };
        Relationships: [];
      };
      projects_pieces: {
        Row: {
          piece_id: string;
          project_id: string;
        };
        Insert: {
          piece_id: string;
          project_id: string;
        };
        Update: {
          piece_id?: string;
          project_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "projects_pieces_piece_id_fkey";
            columns: ["piece_id"];
            isOneToOne: false;
            referencedRelation: "pieces";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "projects_pieces_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "projects_pieces_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects_summary";
            referencedColumns: ["id"];
          },
        ];
      };
      rehearsals: {
        Row: {
          created_at: string;
          description: string | null;
          end_datetime: string;
          google_calendar_id: string;
          id: string;
          location: string | null;
          project_id: string;
          start_datetime: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          end_datetime: string;
          google_calendar_id: string;
          id?: string;
          location?: string | null;
          project_id: string;
          start_datetime: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          end_datetime?: string;
          google_calendar_id?: string;
          id?: string;
          location?: string | null;
          project_id?: string;
          start_datetime?: string;
        };
        Relationships: [
          {
            foreignKeyName: "rehearsals_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "rehearsals_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects_summary";
            referencedColumns: ["id"];
          },
        ];
      };
      users: {
        Row: {
          created_at: string;
          first_name: string | null;
          instrument: Database["public"]["Enums"]["instrument"];
          is_admin: boolean;
          last_name: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          first_name?: string | null;
          instrument?: Database["public"]["Enums"]["instrument"];
          is_admin?: boolean;
          last_name?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string;
          first_name?: string | null;
          instrument?: Database["public"]["Enums"]["instrument"];
          is_admin?: boolean;
          last_name?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "users_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      project_repertoire: {
        Row: {
          file_name: string | null;
          instrument: Database["public"]["Enums"]["instrument"] | null;
          part_name: string | null;
          piece_name: string | null;
          project_id: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "projects_pieces_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "projects_pieces_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects_summary";
            referencedColumns: ["id"];
          },
        ];
      };
      projects_summary: {
        Row: {
          date: string | null;
          id: string | null;
          location: string | null;
          message: string | null;
          name: string | null;
          status: Database["public"]["Enums"]["availability_status"] | null;
        };
        Relationships: [];
      };
      sorted_musicians_availability: {
        Row: {
          first_name: string | null;
          instrument: Database["public"]["Enums"]["instrument"] | null;
          last_name: string | null;
          message: string | null;
          project_id: string | null;
          status: Database["public"]["Enums"]["availability_status"] | null;
          user_id: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "availability_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "availability_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects_summary";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "users_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Functions: {
      get_instruments: {
        Args: Record<PropertyKey, never>;
        Returns: string[];
      };
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: {
      availability_status: "available" | "unavailable" | "maybe" | "undeclared";
      instrument: "skrzypce" | "altówka" | "wiolonczela" | "kontrabas";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
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
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
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
  : never;
