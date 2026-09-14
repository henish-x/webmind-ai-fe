import SiCalendly from '@icons-pack/react-simple-icons/icons/SiCalendly'
import SiGooglesheets from '@icons-pack/react-simple-icons/icons/SiGooglesheets'
import SiHtml5 from '@icons-pack/react-simple-icons/icons/SiHtml5'
import SiHubspot from '@icons-pack/react-simple-icons/icons/SiHubspot'
import SiInstagram from '@icons-pack/react-simple-icons/icons/SiInstagram'
import SiReact from '@icons-pack/react-simple-icons/icons/SiReact'
import SiShopify from '@icons-pack/react-simple-icons/icons/SiShopify'
import SiWebflow from '@icons-pack/react-simple-icons/icons/SiWebflow'
import SiWhatsapp from '@icons-pack/react-simple-icons/icons/SiWhatsapp'
import SiWordpress from '@icons-pack/react-simple-icons/icons/SiWordpress'
import SiX from '@icons-pack/react-simple-icons/icons/SiX'
import SiZapier from '@icons-pack/react-simple-icons/icons/SiZapier'
import SiZendesk from '@icons-pack/react-simple-icons/icons/SiZendesk'

/**
 * Real connector/platform brand marks used across the hero demo and the
 * connectors/SDK marketing sections. Slack, Pipedrive, and LinkedIn aren't
 * published in simple-icons (Slack and LinkedIn asked to be removed over
 * trademark policy; Pipedrive was never added), so those are drawn locally
 * below instead.
 */
export const HubSpotIcon = SiHubspot
export const ZendeskIcon = SiZendesk
export const WhatsAppIcon = SiWhatsapp
export const GoogleSheetsIcon = SiGooglesheets
export const ZapierIcon = SiZapier
export const CalendlyIcon = SiCalendly
export const HtmlIcon = SiHtml5
export const WordpressIcon = SiWordpress
export const ShopifyIcon = SiShopify
export const WebflowIcon = SiWebflow
export const ReactIcon = SiReact
export const XIcon = SiX
export const InstagramIcon = SiInstagram

export function SlackIcon({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
      <title>Slack</title>
      <path
        fill="#E01E5A"
        d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z"
      />
      <path
        fill="#36C5F0"
        d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z"
      />
      <path
        fill="#2EB67D"
        d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312z"
      />
      <path
        fill="#ECB22E"
        d="M15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"
      />
    </svg>
  )
}

const LINKEDIN_DEFAULT_COLOR = '#0A66C2'

/**
 * LinkedIn was removed from simple-icons over trademark policy (same as Slack
 * above), so its "in" badge mark is drawn locally — same prop shape as the
 * generated Si* components, so it's a drop-in wherever those are used.
 */
export function LinkedInIcon({
  title = 'LinkedIn',
  color = 'currentColor',
  size = 24,
  className,
}: {
  title?: string
  color?: string
  size?: number
  className?: string
}) {
  const fill = color === 'default' ? LINKEDIN_DEFAULT_COLOR : color
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} className={className} aria-hidden="true">
      <title>{title}</title>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

/**
 * Pipedrive isn't published in simple-icons, and its exact brand green isn't
 * something we want to guess at and get subtly wrong — so this is drawn as a
 * plain line-art pipeline/funnel mark in `currentColor` instead of a brand-color
 * reproduction, always paired with a "Pipedrive" text label at the call site.
 */
export function PipedriveIcon({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <title>Pipedrive</title>
      <path
        d="M4 5h16l-6 8v6l-4 2v-8L4 5Z"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}
