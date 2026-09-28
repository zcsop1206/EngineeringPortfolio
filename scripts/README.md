# scripts

## guard.mjs

Fails (exit 1) if any file that could be pushed is one that must not be published. It checks
the files git tracks and, when run locally (the `CI` variable is unset), untracked files that
are not ignored. It lists each offender as `reason: path (detail)`.

Checks:

- files over 8 MB, unless listed in `scripts/guard-allow.txt` (change the limit with `--max-mb N`);
- GitHub tokens (`ghp_`, `gho_`, `ghu_`, `ghs_`, `ghr_`, `github_pat_`) in text files;
- sync conflict copies, named `name (conflict <device> <date>).ext`;
- `.obsidian/plugins/*/data.json`, which can hold a token;
- anything under a `private/` folder;
- audio files (`.m4a`, `.webm`, `.ogg`, `.mp3`, `.wav`).

Run it from anywhere in the repo, with Node 20 or later and no dependencies:

    node scripts/guard.mjs

In CI it runs before the build. The step for `.github/workflows/deploy.yml`:

```yaml
- name: Guard against files that must not be published
  run: node scripts/guard.mjs
```
