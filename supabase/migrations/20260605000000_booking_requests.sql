-- ============================================================
-- booking_requests — public session booking intake
-- ============================================================

CREATE TABLE IF NOT EXISTS public.booking_requests (
  id               uuid        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name        text        NOT NULL,
  email            text        NOT NULL,
  phone            text        NOT NULL,
  company          text,
  country          text        NOT NULL,
  session_type     text        NOT NULL,
  preferred_date   date,
  preferred_time   text,
  description      text        NOT NULL,
  status           text        NOT NULL DEFAULT 'pending',
  admin_notes      text,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT booking_requests_status_check
    CHECK (status IN ('pending','approved','scheduled','completed','cancelled'))
);

ALTER TABLE public.booking_requests ENABLE ROW LEVEL SECURITY;

-- Public: insert only (no auth required)
CREATE POLICY "Anyone can submit a booking request"
  ON public.booking_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Authenticated admins: full access (guarded by has_role helper from earlier migration)
CREATE POLICY "Admins can read booking requests"
  ON public.booking_requests FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update booking requests"
  ON public.booking_requests FOR UPDATE
  TO authenticated
  USING  (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete booking requests"
  ON public.booking_requests FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Grant table access
GRANT INSERT                    ON public.booking_requests TO anon;
GRANT INSERT, SELECT, UPDATE, DELETE ON public.booking_requests TO authenticated;
GRANT ALL                       ON public.booking_requests TO service_role;

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER booking_requests_updated_at
  BEFORE UPDATE ON public.booking_requests
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
