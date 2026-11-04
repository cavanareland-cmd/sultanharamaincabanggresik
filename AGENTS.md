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

- Public service pages use dedicated TanStack routes with self-contained anchor navigation, preserving index-page CMS ownership.
- Treat the managed backend connection and frontend/server environment as separate audit targets; config.toml alone does not rebind them, so never simulate a switch by editing generated clients or environment files.
- Keep migration-backed schema extensions in local type modules and reuse the managed browser client; generated schema files must remain untouched and local types do not prove the table is deployed.
