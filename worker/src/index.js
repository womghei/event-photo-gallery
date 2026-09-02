const RELEASE_BASE =
  "https://github.com/womghei/event-photo-gallery/releases/latest/download";

function unauthorized() {
  return new Response("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Event Photo Gallery", charset="UTF-8"',
    },
  });
}

function isAuthorized(request, env) {
  const header = request.headers.get("Authorization");
  if (!header) {
    return false;
  }

  const [scheme, encoded] = header.split(" ");
  if (scheme !== "Basic" || !encoded) {
    return false;
  }

  const decoded = atob(encoded);
  const separator = decoded.indexOf(":");
  if (separator === -1) {
    return false;
  }

  const username = decoded.slice(0, separator);
  const password = decoded.slice(separator + 1);
  return username === env.AUTH_USER && password === env.AUTH_PASS;
}

function buildOriginUrl(request, env) {
  const origin = new URL(env.ORIGIN_URL);
  const incoming = new URL(request.url);
  const basePath = origin.pathname.replace(/\/$/, "");
  const suffix = incoming.pathname === "/" ? "" : incoming.pathname;
  const target = new URL(`${basePath}${suffix}`, origin.origin);
  target.search = incoming.search;
  return target;
}

function buildReleaseUrl(filename) {
  return `${RELEASE_BASE}/${filename}`;
}

function proxyRequest(request, targetUrl) {
  const headers = new Headers(request.headers);
  headers.delete("Authorization");
  headers.set("Host", new URL(targetUrl).host);

  return fetch(targetUrl, {
    method: request.method,
    headers,
    body: request.method === "GET" || request.method === "HEAD" ? undefined : request.body,
    redirect: "follow",
  });
}

export default {
  async fetch(request, env) {
    if (!isAuthorized(request, env)) {
      return unauthorized();
    }

    const url = new URL(request.url);

    if (url.pathname.startsWith("/release/")) {
      const filename = url.pathname.slice("/release/".length);
      if (!filename || filename.includes("/") || filename.includes("..")) {
        return new Response("Not found", { status: 404 });
      }

      return proxyRequest(request, buildReleaseUrl(filename));
    }

    return proxyRequest(request, buildOriginUrl(request, env).toString());
  },
};
