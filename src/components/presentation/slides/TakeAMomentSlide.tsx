/**
 * Slide 04 — Take a Moment (Reflect & Breakdown)
 */
import { useEffect, useState } from 'react';

import { BatteryIcon, BoltIcon, CardDecorBlob, Gx7BadgeLogo, HeartIcon } from '@/components/icons';
import { AreaScoreProgressBar, BatteryWheelChart } from '@/components/dashboard';
import {
  ANIMATION_DURATION_MS,
  AREA_BADGE,
  AREA_BAR_COLORS,
  AREA_COLOR,
  AREA_ICON_MAP,
  AREA_LIGHT_COLOR,
} from '@/constants/dashboard';
import { SCORE_ZONE_COPY, zoneKeyForScore, type ScoreZoneKey } from '@/constants/presentation';
import { useCountUp } from '@/hooks/useCountUp';
import { cn } from '@/lib/utils';
import type { BaseSlideProps } from '@/types';
import { usePresentation } from '@/components/presentation/PresentationContext';
import { StandardSlideLayout } from '@/components/presentation/StandardSlideLayout';
import { StaticSlide } from '@/components/presentation/StaticSlide';

export function TakeAMomentSlide({ ...slideProps }: BaseSlideProps = {}) {
  const [active, setActive] = useState(false);
  const pres = usePresentation();
  const rawScore = pres.score;
  const displayScore = rawScore !== null ? Math.round(rawScore) : null;
  const animatedScore = useCountUp(displayScore, { active, duration: ANIMATION_DURATION_MS });
  const displayItems = pres.items;

  useEffect(() => {
    setActive(false);
    const timer = setTimeout(() => {
      setActive(true);
    }, 50);
    return () => clearTimeout(timer);
  }, [displayScore]);

  const strongest = [...displayItems]
    .filter((i) => i.score !== null && i.score !== undefined)
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    .slice(0, 3);

  // Zone lấy từ API (cùng phép tính với dashboard và slide 11); thiếu thì tự suy từ điểm
  const apiZone = pres.data?.zone?.key?.toUpperCase();
  const zoneKey: ScoreZoneKey | null =
    apiZone && apiZone in SCORE_ZONE_COPY
      ? (apiZone as ScoreZoneKey)
      : displayScore !== null
        ? zoneKeyForScore(displayScore)
        : null;
  const copy = zoneKey ? SCORE_ZONE_COPY[zoneKey] : null;

  return (
    <StandardSlideLayout {...slideProps}>
      <StaticSlide
        category="Reflect."
        headline={
          <div className="heading-80-black uppercase">
            <span className="block text-white">TAKE A</span>
            <span className="block text-brand-green-3">MOMENT</span>
          </div>
        }
        subheadline={
          <span className="heading-48-bold block text-white">Reflect on your result.</span>
        }
        subheadlineClassName="mt-8"
        rightSlot={
          <div className="flex items-center justify-center gap-5">
            <div className="relative h-fit w-80 -translate-y-[100px] overflow-hidden rounded-[20px] border-t-2 border-t-brand-green-1 bg-brand-green-1 p-5 text-white transition-transform duration-500">
              <CardDecorBlob />
              <div className="relative flex flex-col">
                <Gx7BadgeLogo />
                <div className="flex flex-col items-center text-center">
                  <span className="body-20-bold text-brand-green-5">{copy?.intro ?? '—'}</span>
                  <span className="body-20-bold text-brand-green-5">Your battery score:</span>
                  <div className="relative mt-2 flex items-center justify-center">
                    <BatteryIcon
                      percentage={active ? (displayScore ?? 0) : 0}
                      width={132}
                      height={64}
                      className="h-[64px] w-[132px]"
                      aria-hidden="true"
                    />
                    <span className="body-32-black absolute inset-0 flex items-center justify-center pr-3 leading-none text-white drop-shadow-sm">
                      {animatedScore ?? displayScore ?? '—'}
                      {displayScore !== null && (
                        <span className="body-16-black self-start pt-3">%</span>
                      )}
                    </span>
                  </div>
                </div>

                <div className="mt-[85px] flex flex-col gap-2.5">
                  <div className="body-32-black">
                    <span className="block">You are in the</span>
                    {/* Màu chữ giữ như cũ (cam) — chỉ nội dung đổi theo zone (bug 371) */}
                    <span className="block text-secondary-orange-1">{copy?.zone ?? '—'}</span>
                  </div>
                  <p className="body-14-medium text-brand-green-5">{copy?.description}</p>
                </div>

                <span className="body-12-bold mt-[10px] block">Strongest areas</span>
                <div className="mt-2 flex gap-1.5">
                  {strongest.map((item) => {
                    const Icon = AREA_ICON_MAP[item.area] ?? HeartIcon;
                    // Design: chấm tròn màu đặc của vùng, icon trắng, tên vùng đầy đủ
                    return (
                      <div key={item.area} className="flex flex-1 flex-col items-center gap-1.5">
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-full"
                          style={{ backgroundColor: AREA_COLOR[item.area] }}
                        >
                          <Icon
                            size={20}
                            color={AREA_LIGHT_COLOR[item.area] ?? '#FFFFFF'}
                            aria-hidden="true"
                          />
                        </div>
                        <span className="text-center text-[11px] font-medium leading-tight">
                          {item.label ?? item.area}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex h-fit w-80 translate-y-[50px] flex-col rounded-[20px] border border-neutral-grey-6 bg-white p-5 text-neutral-grey-1 transition-transform duration-500">
              <span className="body-16-bold block text-brand-green-1">Score breakdown</span>
              <div className="flex justify-center py-1">
                {active ? (
                  <BatteryWheelChart
                    score={rawScore ?? null}
                    items={displayItems}
                    size={200}
                    animate={true}
                  />
                ) : (
                  <div className="h-[200px] w-[200px]" />
                )}
              </div>

              <div className="flex flex-col border-t border-neutral-grey-6/40 pt-1">
                {displayItems.map((item) => {
                  const Icon = AREA_ICON_MAP[item.area] ?? HeartIcon;
                  const barColor = AREA_BAR_COLORS[item.area] ?? 'bg-brand-green-2';
                  const badgeBg = AREA_BADGE[item.area] ?? 'bg-neutral-grey-7';
                  const iconColor = AREA_COLOR[item.area];
                  const itemScore =
                    item.score === null || item.score === undefined ? null : Math.round(item.score);

                  return (
                    <AreaScoreProgressBar
                      key={item.area}
                      label={item.label ?? item.area}
                      badgeBg={badgeBg}
                      iconColor={iconColor}
                      barColor={barColor}
                      score={itemScore ?? 0}
                      displayValue={itemScore ?? '—'}
                      Icon={Icon}
                      active={active}
                      size="sm"
                      className="py-1.5"
                    />
                  );
                })}
              </div>
            </div>
          </div>
        }
      />
    </StandardSlideLayout>
  );
}
