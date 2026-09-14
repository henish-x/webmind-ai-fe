/**
 * Mirrors react-router's NavLink active-path matching, computed manually.
 *
 * NavLink normally takes a `className={({ isActive }) => ...}` function, but
 * in this environment that function prop is somehow reaching the DOM
 * unevaluated — the rendered `class` attribute ends up as the function's
 * literal source text instead of its return value (reproducible with a
 * cleared Vite dependency cache, so it isn't stale-cache related). Passing a
 * plain string computed from the current location sidesteps it entirely.
 */
export function isPathActive(pathname: string, to: string, end = false): boolean {
  const a = pathname.toLowerCase()
  const b = to.toLowerCase()
  if (end) return a === b
  return a === b || a.startsWith(b.endsWith('/') ? b : `${b}/`)
}
