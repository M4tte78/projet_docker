import simpleGit from 'simple-git';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

const cloneRepo = async (repoUrl) => {
  const repoName = repoUrl.split('/').pop().replace('.git', '');
  const targetPath = join(__dirname, '..', 'clonedRepositories', repoName);

  if (fs.existsSync(targetPath)) {
    fs.rmSync(targetPath, { recursive: true, force: true });
  }

  const git = simpleGit();
  await git.clone(repoUrl, targetPath);
  return { success: true, repoName };
};

export { cloneRepo };
