import { supabase, NewsletterSignup } from '../lib/supabase';

export class NewsletterService {
  /**
   * Subscribe an email to the newsletter
   */
  static async subscribe(email: string, source?: string): Promise<{ success: boolean; message: string; data?: NewsletterSignup }> {
    try {
      // Normalize email
      const normalizedEmail = email.toLowerCase().trim();
      
      // Check if email already exists
      const { data: existingSignup, error: checkError } = await supabase
        .from('newsletter_signups')
        .select('*')
        .eq('email', normalizedEmail)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        // PGRST116 is "not found" error, which is expected for new emails
        throw checkError;
      }

      if (existingSignup) {
        // Email already exists
        if (existingSignup.is_subscribed) {
          return {
            success: false,
            message: 'This email is already subscribed to our newsletter.'
          };
        } else {
          // Resubscribe
          const { data, error } = await supabase
            .from('newsletter_signups')
            .update({ 
              is_subscribed: true,
              metadata: { ...existingSignup.metadata, resubscribed_at: new Date().toISOString() }
            })
            .eq('email', normalizedEmail)
            .select()
            .single();

          if (error) throw error;

          return {
            success: true,
            message: 'Welcome back! You\'ve been resubscribed to our newsletter.',
            data
          };
        }
      } else {
        // New subscription
        const { data, error } = await supabase
          .from('newsletter_signups')
          .insert([
            {
              email: normalizedEmail,
              source: source || 'unknown',
              is_subscribed: true,
              metadata: { 
                user_agent: navigator.userAgent,
                referrer: document.referrer || 'direct'
              }
            }
          ])
          .select()
          .single();

        if (error) throw error;

        return {
          success: true,
          message: 'Thank you for subscribing! We\'ll keep you updated.',
          data
        };
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      
      // Handle specific error cases
      if (error instanceof Error) {
        if (error.message.includes('duplicate key')) {
          return {
            success: false,
            message: 'This email is already subscribed to our newsletter.'
          };
        }
      }

      return {
        success: false,
        message: 'Sorry, there was an error subscribing you to our newsletter. Please try again.'
      };
    }
  }

  /**
   * Unsubscribe an email from the newsletter
   */
  static async unsubscribe(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const normalizedEmail = email.toLowerCase().trim();
      
      const { error } = await supabase
        .from('newsletter_signups')
        .update({ 
          is_subscribed: false,
          metadata: { unsubscribed_at: new Date().toISOString() }
        })
        .eq('email', normalizedEmail);

      if (error) throw error;

      return {
        success: true,
        message: 'You have been unsubscribed from our newsletter.'
      };
    } catch (error) {
      console.error('Newsletter unsubscribe error:', error);
      return {
        success: false,
        message: 'There was an error unsubscribing. Please try again.'
      };
    }
  }

  /**
   * Get newsletter signups (for admin use)
   */
  static async getSignups(limit = 50, offset = 0) {
    try {
      const { data, error, count } = await supabase
        .from('newsletter_signups')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return { data, count };
    } catch (error) {
      console.error('Error fetching newsletter signups:', error);
      throw error;
    }
  }
} 