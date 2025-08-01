import { IncomingHttpHeaders } from "http";

export function getAPIKey(headers: IncomingHttpHeaders): string | null {
  const authHeader = headers["authorization"];
  if (typeof authHeader !== "string") {
    return null;
  }

  const splitAuth = authHeader.trim().split(/\s+/);
  if (splitAuth.length < 2 || splitAuth[0] !== "ApiKey") {
    return null;
  }

  return splitAuth[1];
}
