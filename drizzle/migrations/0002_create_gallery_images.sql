create table public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('lakossagi','ipari')),
  storage_path text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

grant select on public.gallery_images to anon, authenticated;
grant all on public.gallery_images to service_role;

alter table public.gallery_images enable row level security;

create policy "Public read gallery"
  on public.gallery_images for select
  using (true);

create policy "Admins insert gallery"
  on public.gallery_images for insert to authenticated
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins delete gallery"
  on public.gallery_images for delete to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- Storage policies for the gallery bucket
create policy "Public read gallery objects"
  on storage.objects for select
  using (bucket_id = 'gallery');

create policy "Admins upload gallery objects"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'gallery' and public.has_role(auth.uid(), 'admin'));

create policy "Admins delete gallery objects"
  on storage.objects for delete to authenticated
  using (bucket_id = 'gallery' and public.has_role(auth.uid(), 'admin'));
