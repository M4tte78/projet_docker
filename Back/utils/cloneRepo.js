import simpleGit from 'simple-git';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

const cloneRepo = async (repoUrl) => {
  const partiesUrl = repoUrl.split("/");
  const nomDuOwner = partiesUrl[partiesUrl.length - 2];
  const nomAvecGit = partiesUrl[partiesUrl.length - 1];
  const nomProjet = nomAvecGit.replace(".git", "");
  const targetPath = join(__dirname, "..", "clonedRepositories", nomProjet);

  if (fs.existsSync(targetPath)) {
    fs.rmSync(targetPath, { recursive: true, force: true });
  }

  const git = simpleGit();
  await git.clone(repoUrl, targetPath);
  return { success: true, nomProjet, nomDuOwner };
};

export { cloneRepo };
