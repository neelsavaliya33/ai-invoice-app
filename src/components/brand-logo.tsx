import Image from "next/image";
import { cn } from "@/lib/utils";

export function BrandLogo({
  className,
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <span className={cn("relative inline-block h-11 w-[190px]", className)}>
      <Image
        src="/brand/koshpilot-logo-light-mode-600x180.png"
        alt="KoshPilot"
        fill
        priority={priority}
        sizes="190px"
        className="object-contain dark:hidden"
      />
      <Image
        src="/brand/koshpilot-logo-dark-mode-600x180.png"
        alt="KoshPilot"
        fill
        priority={priority}
        sizes="190px"
        className="hidden object-contain dark:block"
      />
    </span>
  );
}

export function BrandMark({
  className,
}: {
  className?: string;
}) {
  return (
    <Image
      src="/brand/koshpilot-icon.svg"
      alt="KoshPilot"
      width={42}
      height={42}
      className={cn("rounded-2xl", className)}
    />
  );
}
