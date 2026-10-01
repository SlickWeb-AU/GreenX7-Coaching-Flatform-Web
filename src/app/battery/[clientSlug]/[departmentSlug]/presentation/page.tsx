'use client';

import { useMemo, type ReactNode } from 'react';
import { useParams } from 'next/navigation';

import { DeckShell } from '@/components/presentation/DeckShell';
import {
  PresentationProvider,
  usePresentation,
} from '@/components/presentation/PresentationContext';
import { PresentationControls } from '@/components/presentation/PresentationControls';
import { PresentationMobileWarning } from '@/components/presentation/PresentationMobileWarning';
import { SlideLayoutProvider } from '@/components/presentation/StandardSlideLayout';
import {
  ClosingSlide,
  CoverSlide,
  DifferenceAreaSlide,
  EightAreasSlide,
  EnergyAreaSlide,
  MakeItEasySlide,
  MyPromiseSlide,
  QrCountdownSlide,
  ReflectPromptsSlide,
  SmallActionSlide,
  TakeAMomentSlide,
  TeamBatterySlide,
} from '@/components/presentation/slides';
import { PRESENTATION_TITLE_SUFFIX, PRESENTATION_TOTAL_SLIDES } from '@/constants/presentation';
import { usePresentationNav } from '@/lib/presentation-nav';

function PresentationView() {
  const { fullDisplayName, clientName, departmentName, clientLogoUrl } = usePresentation();

  const { currentSlide, totalSlides, direction, nextSlide, prevSlide } =
    usePresentationNav(PRESENTATION_TOTAL_SLIDES);

  const controls = useMemo(
    () => (
      <PresentationControls
        currentSlide={currentSlide}
        totalSlides={totalSlides}
        onNext={nextSlide}
        onPrev={prevSlide}
      />
    ),
    [currentSlide, totalSlides, nextSlide, prevSlide],
  );

  const slideLayoutValue = useMemo(
    () => ({ clientName, departmentName, clientLogoUrl, controls }),
    [clientName, departmentName, clientLogoUrl, controls],
  );

  // Ordered slide components, indexed by currentSlide - 1
  const slides: ReactNode[] = [
    <CoverSlide key="cover" />,
    <EightAreasSlide key="8-areas" />,
    <QrCountdownSlide key="qr" />,
    <TakeAMomentSlide key="moment" />,
    <ReflectPromptsSlide key="reflect" />,
    <EnergyAreaSlide key="energy" />,
    <DifferenceAreaSlide key="difference" />,
    <SmallActionSlide key="action" />,
    <MakeItEasySlide key="easy" />,
    <MyPromiseSlide key="promise" />,
    <TeamBatterySlide key="team" />,
    <ClosingSlide key="closing" />,
  ];

  return (
    <>
      <PresentationMobileWarning
        presentationTitle={`${fullDisplayName.toUpperCase()} — ${PRESENTATION_TITLE_SUFFIX}`}
        clientName={clientName}
        departmentName={departmentName}
        clientLogoUrl={clientLogoUrl}
      />

      <SlideLayoutProvider value={slideLayoutValue}>
        <DeckShell currentSlide={currentSlide} direction={direction}>
          {slides[currentSlide - 1]}
        </DeckShell>
      </SlideLayoutProvider>
    </>
  );
}

export default function PresentationPage() {
  const { clientSlug, departmentSlug } = useParams<{
    clientSlug: string;
    departmentSlug: string;
  }>();

  return (
    <PresentationProvider clientSlug={clientSlug} departmentSlug={departmentSlug}>
      <PresentationView />
    </PresentationProvider>
  );
}
