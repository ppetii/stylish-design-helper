CREATE TABLE public.quote_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  project_type TEXT NOT NULL,
  dimensions TEXT,
  location TEXT,
  message TEXT,
  photo_path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT quote_requests_contact_required CHECK (email IS NOT NULL OR phone IS NOT NULL)
);

GRANT ALL ON public.quote_requests TO service_role;

ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;
-- No policies: rows are written only through validated server code with the
-- service role; nobody can read other visitors' requests.