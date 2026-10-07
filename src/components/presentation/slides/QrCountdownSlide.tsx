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
        // "BATTERY CHECK" ở 80px rộng hơn max-w-xl — cho cột chữ rộng ra để nằm một dòng
        leftClassName="max-w-none"
        headline={
          <div className="flex flex-col">
            <div className="heading-80-black uppercase text-white">
              <span className="text-brand-green-3">START </span>
              <span>YOUR</span>
              <br />
              <span className="whitespace-nowrap">BATTERY CHECK</span>
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
            {qrCodeUrl ? (
              // QR code URL is runtime data, bypasses next/image optimizer
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrCodeUrl}
                alt="QR Code"
                className="h-[332px] w-[332px] rounded-[36px] object-contain"
              />
            ) : (
              <div className="flex h-[332px] w-[332px] items-center justify-center rounded-[36px] bg-white text-neutral-grey-1">
                <QrCode className="h-72 w-72 stroke-[1.5]" />
              </div>
            )}
          </div>
        }
      />
    </StandardSlideLayout>
  );
}
