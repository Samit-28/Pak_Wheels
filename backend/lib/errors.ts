export function handleServerError(res: any, error: unknown) {
  const isProd = process.env.NODE_ENV === "production";
  const message = error instanceof Error ? error.message : String(error);
  try {
    if (isProd) {
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.status(500).json({ error: message });
  } catch (e) {
    // Fallback to a safe plain text message
    try { res.status && res.status(500); } catch {}
    if (isProd) {
      if (res.end) res.end("Internal server error");
    } else {
      if (res.end) res.end(String(message));
    }
    return res;
  }
}
