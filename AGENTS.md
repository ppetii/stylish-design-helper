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

- Keep this business website as a single anchored home page; its navigation, filters, and quote form are client-side interactions so visitors can browse without account setup.

## Quote form
- Az ajánlatkérések a `quote_requests` táblába íródnak service_role-lal (RLS nincs nyitva); a referenciafotók a privát `quote-photos` bucket `requests/` útvonal alá kerülnek.
- A fotó a szerverfüggvényen base64 kódolással utazik (a File objektum nem él át az RPC-n), JPEG/PNG/WEBP, max 10 MB.
- A telefonszám (+36 30 123 4567) és e-mail (info@vasmesteresfiai.hu) placeholder — megerősítendő.
