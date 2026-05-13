-- Contact-form message storage.
-- Service-role inserts only; reads are gated by server-side authz.
-- Idempotent: safe to re-run.

CREATE TABLE IF NOT EXISTS public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text NOT NULL,
  source_ip text,
  user_agent text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at
  ON public.contact_messages (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_contact_messages_status_created
  ON public.contact_messages (status, created_at DESC);

COMMENT ON TABLE public.contact_messages IS
  'Marketing contact-form submissions. Written by anonymous public requests via the service role; reads are gated by manager-only API routes.';
