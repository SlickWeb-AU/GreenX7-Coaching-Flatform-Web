import { BaseButton } from '@/components/base';
import { cn } from '@/lib/utils';

export interface PresentationControlsProps {
  currentSlide: number;
  totalSlides: number;
  onNext: () => void;
  onPrev: () => void;
  className?: string;
}

export function PresentationControls({
  currentSlide,
  totalSlides,
  onNext,
  onPrev,
  className,
}: PresentationControlsProps) {
  const canGoPrev = currentSlide > 1;
  const canGoNext = currentSlide < totalSlides;

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {canGoPrev && (
        <BaseButton variant="outline" pill size="presentation" onClick={onPrev}>
          Previous
        </BaseButton>
      )}

      {canGoNext && (
        <BaseButton variant="outline" pill size="presentation" onClick={onNext}>
          Next
        </BaseButton>
      )}
    </div>
  );
}
