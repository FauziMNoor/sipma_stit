import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Client-side Supabase client (with RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // We use JWT cookies instead
    autoRefreshToken: false,
  },
});

// Server-side Supabase client (bypasses RLS)
// Only use this in API routes where you need to bypass RLS
export const supabaseAdmin = supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : supabase; // Fallback to regular client if service role key not available

// Database types
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          password: string;
          nama: string;
          role: 'mahasiswa' | 'dosen_pa' | 'musyrif' | 'waket3' | 'admin';
          foto: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      mahasiswa: {
        Row: {
          id: string;
          user_id: string | null;
          nim: string;
          password: string;
          nama: string;
          prodi: string;
          angkatan: number;
          foto: string | null;
          wali_dosen_id: string | null;
          musyrif_id: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['mahasiswa']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['mahasiswa']['Insert']>;
      };
      kategori_poin: {
        Row: {
          id: string;
          kode: string;
          nama: string;
          jenis: 'positif' | 'negatif';
          bobot: number;
          deskripsi: string | null;
          kategori_utama: string | null;
          requires_verification: boolean;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['kategori_poin']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['kategori_poin']['Insert']>;
      };
      poin_aktivitas: {
        Row: {
          id: string;
          mahasiswa_id: string;
          kategori_id: string;
          bukti: string | null;
          tanggal: string;
          deskripsi_kegiatan: string | null;
          status: 'pending' | 'approved' | 'rejected';
          verifikator_id: string | null;
          notes_verifikator: string | null;
          verified_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['poin_aktivitas']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['poin_aktivitas']['Insert']>;
      };
      poin_summary: {
        Row: {
          mahasiswa_id: string;
          total_poin_positif: number;
          total_poin_negatif: number;
          total_poin: number;
          status_kelulusan: 'lulus' | 'belum_lulus';
          last_updated: string;
        };
        Insert: Database['public']['Tables']['poin_summary']['Row'];
        Update: Partial<Database['public']['Tables']['poin_summary']['Insert']>;
      };
    };
  };
};

