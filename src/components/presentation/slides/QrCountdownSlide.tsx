/**
 * Slide 03 — Start Your Battery Check (QR Countdown)
 */
'use client';

import { useState, useEffect } from 'react';
import { QrCode } from 'lucide-react';
import { QR_COUNTDOWN_SECONDS } from '@/constants/presentation';
import { usePresentation } from '@/components/presentation/PresentationContext';
import { StandardSlideLayout } from '@/components/presentation/StandardSlideLayout';
import { StaticSlide } from '@/components/presentation/StaticSlide';
import type { BaseSlideProps } from '@/types';

export function QrCountdownSlide({ ...layoutProps }: BaseSlideProps = {}) {
  const pres = usePresentation();
  const qrCodeUrl = pres.qrCodeUrl;
  const batteryCheckUrl = pres.batteryCheckUrl;
  const [seconds, setSeconds] = useState(QR_COUNTDOWN_SECONDS);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const timeFormatted = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

  return (
    <StandardSlideLayout {...layoutProps}>
      <StaticSlide
        headline={
          <div className="flex flex-col">
            <div className="heading-80-black uppercase text-white">
              <span className="text-brand-green-3">START </span>
              <span>YOUR</span>
              <br />
              <span>BATTERY CHECK</span>
            </div>
            <div className="heading-48-bold mt-8 flex flex-col">
              <span className="text-white">60 seconds.</span>
              <span className="text-brand-green-3">Your results are private.</span>
            </div>
          </div>
        }
        rightSlot={
          <div className="flex flex-col items-center justify-center">
            <div className="body-24-bold mb-4 uppercase tracking-widest text-secondary-yellow-1">
              {timeFormatted} REMAINING
            </div>
            <div className="flex items-center justify-center rounded-[32px] bg-white p-6 shadow-2xl">
              {qrCodeUrl ? (
                // QR code URL is runtime data, bypasses next/image optimizer
                // eslint-disable-next-line @next/next/no-img-element
                <img src={qrCodeUrl} alt="QR Code" className="h-64 w-64 object-contain" />
              ) : (
                <div className="flex h-64 w-64 items-center justify-center text-neutral-grey-1">
                  <QrCode className="h-56 w-56 stroke-[1.5]" />
                </div>
              )}
            </div>
            {batteryCheckUrl && (
              <span className="caption-12-regular mt-3 text-white/60">{batteryCheckUrl}</span>
            )}
          </div>
        }
      />
    </StandardSlideLayout>
  );
}
