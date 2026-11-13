// ============================================================
// PingLog – TypeScript types derived from the Supabase schema
// ============================================================

export type Category = 'New' | 'Improvement' | 'Fix'
export type FeedbackStatus = 'Under Review' | 'Planned' | 'In Progress' | 'Completed'
export type SubscriptionPlan = 'free' | 'pro'
export type SubscriptionStatus = 'active' | 'cancelled' | 'past_due'

export type Project = {
  id: string
  user_id: string
  name: string
  domain: string | null
  api_key: string
  accent_color: string
  created_at: string
}

export type Changelog = {
  id: string
  project_id: string
  title: string
  content: string
  category: Category
  published_at: string | null
}

export type FeedbackItem = {
  id: string
  project_id: string
  title: string
  description: string | null
  status: FeedbackStatus
  votes_count: number
  created_at: string
}

export type Vote = {
  id: string
  feedback_id: string
  voter_fingerprint: string
  created_at: string
}

export type Subscription = {
  user_id: string
  plan: SubscriptionPlan
  status: SubscriptionStatus
  lemon_squeezy_customer_id: string | null
  lemon_squeezy_subscription_id: string | null
  updated_at: string
}

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
        Row: Project
        Relationships: []
        Insert: {
          id?: string
          user_id: string
          name: string
          domain?: string | null
          api_key?: string
          accent_color?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          domain?: string | null
          api_key?: string
          accent_color?: string
          created_at?: string
        }
      }
      changelogs: {
        Row: Changelog
        Relationships: []
        Insert: {
          id?: string
          project_id: string
          title: string
          content: string
          category: Category
          published_at?: string | null
        }
        Update: {
          id?: string
          project_id?: string
          title?: string
          content?: string
          category?: Category
          published_at?: string | null
        }
      }
      feedback_items: {
        Row: FeedbackItem
        Relationships: []
        Insert: {
          id?: string
          project_id: string
          title: string
          description?: string | null
          status?: FeedbackStatus
          votes_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          title?: string
          description?: string | null
          status?: FeedbackStatus
          votes_count?: number
          created_at?: string
        }
      }
      votes: {
        Row: Vote
        Relationships: []
        Insert: {
          id?: string
          feedback_id: string
          voter_fingerprint: string
          created_at?: string
        }
        Update: {
          id?: string
          feedback_id?: string
          voter_fingerprint?: string
          created_at?: string
        }
      }
      subscriptions: {
        Row: Subscription
        Relationships: []
        Insert: {
          user_id: string
          plan?: SubscriptionPlan
          status?: SubscriptionStatus
          lemon_squeezy_customer_id?: string | null
          lemon_squeezy_subscription_id?: string | null
          updated_at?: string
        }
        Update: {
          user_id?: string
          plan?: SubscriptionPlan
          status?: SubscriptionStatus
          lemon_squeezy_customer_id?: string | null
          lemon_squeezy_subscription_id?: string | null
          updated_at?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
