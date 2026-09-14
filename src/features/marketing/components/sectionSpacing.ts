/**
 * The single source of truth for vertical rhythm between marketing sections.
 * Per the brief: 120px between sections on desktop, 64px on mobile. Applied
 * as top+bottom padding on every section so two adjacent sections' padding
 * sums to exactly that gap — nowhere else adds margin/gap on top of this.
 */
export const SECTION_PADDING = 'py-8 md:py-[60px]'
