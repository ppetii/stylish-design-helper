<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Home page stays a single anchored page (client-side nav, filters, quote form, no account setup). The "Kiemelt munkáink" gallery lives on its own route `/munkaink` with Lakossági/Ipari tabs; home nav and hero link there via `/munkaink`.

## Quote form
- Az ajánlatkérések a `quote_requests` táblába íródnak service_role-lal (RLS nincs nyitva); a referenciafotók a privát `quote-photos` bucket `requests/` útvonal alá kerülnek.
- A fotó a szerverfüggvényen base64 kódolással utazik (a File objektum nem él át az RPC-n), JPEG/PNG/WEBP, max 10 MB.
- Official contact data and company details are hardcoded in the home page sections (contact, footer imprint).
- Admin access is granted via the user_roles table (first signed-up user becomes admin by trigger); /admin lives under the _authenticated gate and reads quotes with RLS — keeps privileges server-verified.
