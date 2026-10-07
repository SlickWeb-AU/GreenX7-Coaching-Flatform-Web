'use client';

import { useState, type ReactNode } from 'react';
import { Check, Presentation } from 'lucide-react';
import { BaseButton } from '@/components/base';
import { PRESENTATION_TITLE_SUFFIX } from '@/constants/presentation';
import { DesktopWarningIllustration, GreenX7LogoDark } from '@/components/icons';
import { useOptionalPresentation } from './PresentationContext';

import { cn, resolveImageUrl } from '@/lib/utils';

export interface PresentationMobileWarningProps {
  /** Heading displayed below the illustration */
  title?: string;
  /** Subtitle / descriptive explanation */
  description?: string;
  /** Label for the category/badge inside the info card (e.g. "Presentation", "Live Dashboard") */
  badgeLabel?: string;
  /** Icon displayed in the category/badge, defaults to Monitor */
  badgeIcon?: ReactNode;
  /** Item title / subject displayed in the info card */
  presentationTitle?: string;
  itemTitle?: string;
  /** Explicit URL to copy; falls back to window.location.href in browser */
  presentationUrl?: string;
  url?: string;
  /** Client or organization name shown in the top header */
  clientName?: string;
  /** Department name shown below client logo */
  departmentName?: string;
  /** Dynamic client logo URL */
  clientLogoUrl?: string | null;
  /** Whether to show the copy link CTA button (defaults to true) */
  showCopyButton?: boolean;
  /** Label for the copy CTA button */
  copyButtonText?: string;
  /** Notification text displayed after successful clipboard copy */
  copiedFeedbackText?: string;
  /** Optional informational notice (e.g. viewport / device guidance) */
  helperNotice?: string;
  /** Extra container className */
  className?: string;
}

export function PresentationMobileWarning({
  title = 'Open this presentation on a desktop',
  description = 'Presentation View is designed for desktop screens. Copy this link and open on a larger screen for the best viewing experience.',
  badgeLabel = 'Presentation',
  badgeIcon,
  presentationTitle,
  itemTitle,
  presentationUrl,
  url,
  clientName: propClientName,
  departmentName: propDeptName,
  clientLogoUrl: propLogoUrl,
  showCopyButton = true,
  copyButtonText = 'Copy presentation link',
  copiedFeedbackText = 'Link copied. Open it on a desktop or laptop.',
  helperNotice,
  className,
}: PresentationMobileWarningProps) {
  const [copied, setCopied] = useState(false);
  const pres = useOptionalPresentation();

  const clientName = propClientName ?? pres?.clientName;
  const departmentName = propDeptName ?? pres?.departmentName;
  const clientLogoUrl = propLogoUrl !== undefined ? propLogoUrl : (pres?.clientLogoUrl ?? null);

  // Resolve item title: explicit itemTitle > presentationTitle > derived fallback
  const resolvedTitle =
    itemTitle ??
    presentationTitle ??
    (clientName ? `${clientName} — ${PRESENTATION_TITLE_SUFFIX}` : undefined);

  const targetUrl = url ?? presentationUrl ?? '';
  const canCopy = targetUrl.length > 0;

  const handleCopy = async () => {
    if (!canCopy && typeof window !== 'undefined' && !window.location.href) return;
    const copyTarget = canCopy ? targetUrl : window.location.href;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(copyTarget);
        setCopied(true);
        setTimeout(() => setCopied(false), 3500);
      }
    } catch {
      // Clipboard is best-effort; staying on the warning screen is safe to ignore
    }
  };

  return (
    <div
      className={cn(
        'flex min-h-screen w-full flex-col justify-between bg-white p-6 text-center lg:hidden',
        className,
      )}
    >
      <div className="flex w-full items-center justify-between pt-2">
        <GreenX7LogoDark className="h-[32px] w-auto" />
        <div className="flex flex-col items-end text-right">
          <div className="flex h-[26px] items-center justify-end">
            {clientLogoUrl ? (
              // Dynamic client logo URL bypasses next/image optimizer
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={resolveImageUrl(clientLogoUrl)}
                alt={clientName ?? 'Client logo'}
                className="h-[26px] w-auto object-contain"
              />
            ) : null}
          </div>
          {departmentName && (
            <span className="body-14-medium mt-0.5 text-neutral-grey-2">{departmentName}</span>
          )}
        </div>
      </div>

      <div className="mx-auto my-auto flex max-w-sm flex-col items-center">
        <DesktopWarningIllustration className="mb-6 h-auto w-52 drop-shadow-sm" />

        <div className="mb-[50px] flex flex-col items-center gap-[12px]">
          <h1 className="body-24-bold text-neutral-grey-1">{title}</h1>
          <p className="body-14-medium text-neutral-grey-2">{description}</p>
        </div>

        {resolvedTitle ? (
          <div className="flex w-full flex-col items-center gap-[4px] rounded-2xl border border-neutral-grey-6 bg-neutral-grey-7 px-[16px] py-[12px]">
            <div className="text-neutral-grey-1">
              {badgeIcon ?? <Presentation size={20} aria-hidden="true" />}
            </div>
            {badgeLabel ? (
              <span className="body-14-medium text-neutral-grey-3">{badgeLabel}</span>
            ) : null}
            <span className="body-16-bold text-neutral-grey-1">{resolvedTitle}</span>
          </div>
        ) : null}

        {helperNotice ? (
          <div className="mt-[12px] w-full rounded-xl bg-neutral-grey-7 p-3 text-xs font-medium text-neutral-grey-2">
            {helperNotice}
          </div>
        ) : null}

        {showCopyButton ? (
          <>
            <BaseButton
              variant="primary"
              size="mediumPlus"
              className="mt-[12px] w-full"
              onClick={handleCopy}
            >
              {copyButtonText}
            </BaseButton>

            <div
              className={cn(
                'body-12-medium mt-[8px] flex items-center gap-1.5 text-brand-green-2 transition-opacity duration-200',
                copied ? 'opacity-100' : 'pointer-events-none opacity-0',
              )}
            >
              <Check size={14} aria-hidden="true" />
              <span>{copiedFeedbackText}</span>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
