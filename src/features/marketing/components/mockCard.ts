/**
 * Shared "product mockup" card treatment for the newer sections that show a real
 * screen (dashboard, inbox, SDK panels) — a border + soft shadow + a small hover
 * lift so these read as touchable product surfaces, not flat screenshots. Reserved
 * for actual product mockups; ordinary content cards don't use this.
 */
export const MOCK_CARD = 'overflow-hidden rounded-2xl border border-hairline bg-white shadow-overlay transition-transform duration-300 ease-out hover:scale-[1.01]'
