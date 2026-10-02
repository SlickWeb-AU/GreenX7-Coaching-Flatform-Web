export function BatteryCheckFlow({
  clientSlug,
  departmentSlug,
}: {
  clientSlug: string;
  departmentSlug: string;
}) {
  return (
    <div>
      Battery Check Flow: {clientSlug} / {departmentSlug}
    </div>
  );
}
