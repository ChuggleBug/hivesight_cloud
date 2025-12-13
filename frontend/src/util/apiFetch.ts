
// A wrapper for fetch which handles hostname
export default function apiFetch(input: string | URL | globalThis.Request, init?: RequestInit) {
    return fetch(`http://ec2-34-238-248-180.compute-1.amazonaws.com${input}`, init);
}

