import { createClient } from '@supabase/supabase-js'
const supabaseUrl = "https://qspsshbxtgqqxnlajhbu.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzcHNzaGJ4dGdxcXhubGFqaGJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4NTcyMTEsImV4cCI6MjA1NzQzMzIxMX0.A76h3I8B75aEAZbhtFC5IDpjqJc11NBPTZdD3rH1tj4"
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase