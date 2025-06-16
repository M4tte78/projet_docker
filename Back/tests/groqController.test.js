import { jest } from '@jest/globals';

let mockExistsSync, mockStatSync, mockReadFileSync;
let mockFg, mockGroq;

jest.unstable_mockModule('fs', () => ({
  default: {
    existsSync: (...args) => mockExistsSync(...args),
    statSync: (...args) => mockStatSync(...args),
    readFileSync: (...args) => mockReadFileSync(...args)
  }
} ));

jest.unstable_mockModule('fast-glob', () => ({
  default: (...args) => mockFg(...args)
}));

jest.unstable_mockModule('groq-sdk', () => ({
  default: class Groq {
    constructor() {}
    chat = {
      completions: {
        create: (...args) => mockGroq(...args)
      }
    };
  }
}));

const GroqController = (await import('../controllers/groqController.js')).default;

function mockResponse() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('GroqController.analyzeRepository - 404', () => {
  beforeEach(() => {
    mockExistsSync = jest.fn(() => false);
    mockStatSync = jest.fn();
    mockReadFileSync = jest.fn();
    mockFg = jest.fn();
    mockGroq = jest.fn();
  });

  it('doit retourner 404 si le dépôt n\'existe pas', async () => {
    const req = { body: { repoName: 'dossier-inexistant' } };
    const res = mockResponse();

    await GroqController.analyzeRepository(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Le dépôt "dossier-inexistant" n\'existe pas.'
    });
  });
});

describe('GroqController.analyzeRepository - 200', () => {
  beforeEach(() => {
    mockExistsSync = jest.fn(() => true);
    mockStatSync = jest.fn(() => ({ size: 100 }));
    mockReadFileSync = jest.fn((chemin) => `// contenu de ${chemin}`);
    mockFg = jest.fn((pattern) => {
      if (pattern.includes('Dockerfile')) return ['Dockerfile'];
      if (pattern.includes('*.test.js')) return ['tests/demo.test.js'];
      return [];
    });
    mockGroq = jest.fn(() =>
      Promise.resolve({
        choices: [{ message: { content: '<h1>Analyse OK</h1>' } }]
      })
    );
  });

  it('doit retourner 200 avec une réponse HTML générée', async () => {
    const req = { body: { repoName: 'mon-repo' } };
    const res = mockResponse();

    await GroqController.analyzeRepository(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      result: expect.stringContaining('<h1>Analyse OK</h1>')
    });
  });
});

describe('GroqController.analyzeRepository - 500', () => {
  beforeEach(() => {
    mockExistsSync = jest.fn(() => true);
    mockStatSync = jest.fn(() => ({ size: 100 }));
    mockReadFileSync = jest.fn((chemin) => `// contenu de ${chemin}`);
    mockFg = jest.fn((pattern) => {
      if (pattern.includes('Dockerfile')) return ['Dockerfile'];
      if (pattern.includes('*.test.js')) return ['tests/demo.test.js'];
      return [];
    });
    mockGroq = jest.fn(() =>
      Promise.reject(new Error('Erreur Groq simulée'))
    );
  });

  it('doit retourner 500 si Groq échoue', async () => {
    const req = { body: { repoName: 'mon-repo' } };
    const res = mockResponse();

    await GroqController.analyzeRepository(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Échec de l’analyse',
      details: 'Erreur Groq simulée'
    });
  });
});

