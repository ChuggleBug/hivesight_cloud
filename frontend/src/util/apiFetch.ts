
// A wrapper for fetch which handles hostname
export default function apiFetch(input: string | URL | globalThis.Request, init?: RequestInit) {
    return fetch(`http://localhost:3000${input}`, init);
}