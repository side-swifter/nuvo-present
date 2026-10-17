// Runs before `npm run deploy`: stops you from deploying a copy that is behind GitHub, so you never overwrite a teammate's live changes by accident.
import { execSync } from 'node:child_process';
const sh = c => execSync(c, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
try {
  sh('git fetch -q origin');
  const behind = sh('git rev-list --count HEAD..origin/main');
  const dirty = sh('git status --porcelain -- presentation wrangler.jsonc');
  if (+behind > 0) { console.error(`\nStop: origin/main has ${behind} commit(s) you do not have.\nRun "git pull --no-rebase", check nothing of theirs gets lost, then deploy again.\n(Skip this check with SKIP_SYNC_CHECK=1 if you really mean it.)\n`); process.exit(process.env.SKIP_SYNC_CHECK ? 0 : 1); }
  if (dirty) console.warn('\nNote: you have uncommitted changes in presentation/. Consider committing and pushing them so the repo matches what is live.\n');
} catch (e) { console.warn('Could not check GitHub (offline?). Continuing.'); }
