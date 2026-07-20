const DEFAULT_BASE_URL = 'http://localhost:3333';

export class ChekItCoreError extends Error {
  constructor(message, { status, body } = {}) {
    super(message);
    this.name = 'ChekItCoreError';
    this.status = status;
    this.body = body;
  }
}

export function createChekItCoreClient({ baseUrl = DEFAULT_BASE_URL, fetchImpl = fetch } = {}) {
  const apiBase = baseUrl.replace(/\/$/, '');

  async function request(path, options = {}) {
    const response = await fetchImpl(`${apiBase}${path}`, {
      ...options,
      headers: {
        'content-type': 'application/json',
        ...(options.headers || {})
      }
    });
    const body = await response.json().catch(() => null);

    if (!response.ok) {
      throw new ChekItCoreError(body?.error || `ChekIt Core request failed: ${response.status}`, {
        status: response.status,
        body
      });
    }

    return body;
  }

  return {
    health() {
      return request('/health');
    },

    listIngredients({ limit = 100, offset = 0, faceReality = false } = {}) {
      const params = new URLSearchParams({
        limit: String(limit),
        offset: String(offset)
      });

      if (faceReality) {
        params.set('faceReality', 'true');
      }

      return request(`/ingredients?${params.toString()}`);
    },

    checkIngredients({ ingredientString, ingredients, onlyFaceReality = false }) {
      return request('/api/check', {
        method: 'POST',
        body: JSON.stringify({
          ingredientString,
          ingredients,
          onlyFaceReality
        })
      });
    }
  };
}

// Copy-paste usage:
//
// const chekit = createChekItCoreClient({
//   baseUrl: import.meta.env?.VITE_CHEKIT_CORE_URL || 'http://localhost:3333'
// });
//
// const result = await chekit.checkIngredients({
//   ingredientString: 'Water, Cocos Nucifera, Isopropyl Myristate'
// });
//
// console.log(result.matches);
