// components/EventCardSkeleton.tsx
"use client";

import { Card, CardBody, CardFooter } from "@heroui/card";
import { Skeleton } from "@heroui/skeleton";

export default function EventCardSkeleton() {
  return (
    <Card className="border-none shadow-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
      <CardBody className="p-0 overflow-hidden">
        {/* Image skeleton */}
        <Skeleton className="rounded-none">
          <div className="w-full h-40 sm:h-44 md:h-48 bg-default-300" />
        </Skeleton>

        <div className="p-3 sm:p-4 md:p-5 lg:p-6 space-y-2 sm:space-y-2.5 md:space-y-3 lg:space-y-4">
          {/* Title skeleton */}
          <div className="space-y-2">
            <Skeleton className="rounded-lg">
              <div className="h-5 sm:h-6 md:h-7 w-4/5 bg-default-300" />
            </Skeleton>
            <Skeleton className="rounded-lg">
              <div className="h-5 sm:h-6 md:h-7 w-3/5 bg-default-300" />
            </Skeleton>
          </div>

          {/* Description skeleton */}
          <div className="space-y-1.5">
            <Skeleton className="rounded-lg">
              <div className="h-3 sm:h-3.5 md:h-4 w-full bg-default-300" />
            </Skeleton>
            <Skeleton className="rounded-lg">
              <div className="h-3 sm:h-3.5 md:h-4 w-4/5 bg-default-300" />
            </Skeleton>
          </div>

          {/* Info items skeleton */}
          <div className="space-y-2">
            <Skeleton className="rounded-lg">
              <div className="h-3 sm:h-4 w-2/3 bg-default-300" />
            </Skeleton>
            <Skeleton className="rounded-lg">
              <div className="h-3 sm:h-4 w-1/2 bg-default-300" />
            </Skeleton>
            <Skeleton className="rounded-lg">
              <div className="h-3 sm:h-4 w-3/5 bg-default-300" />
            </Skeleton>
          </div>

          {/* Tags skeleton */}
          <div className="flex gap-1.5 sm:gap-2 pt-2">
            <Skeleton className="rounded-full">
              <div className="h-6 w-16 bg-default-300" />
            </Skeleton>
            <Skeleton className="rounded-full">
              <div className="h-6 w-20 bg-default-300" />
            </Skeleton>
            <Skeleton className="rounded-full">
              <div className="h-6 w-14 bg-default-300" />
            </Skeleton>
          </div>
        </div>
      </CardBody>

      <CardFooter className="px-3 sm:px-4 md:px-5 lg:px-6 pb-3 sm:pb-4 md:pb-5 lg:pb-6 pt-0">
        <div className="flex flex-col gap-2 sm:gap-2.5 md:gap-3 w-full">
          {/* Price skeleton */}
          <Skeleton className="rounded-lg">
            <div className="h-8 w-24 bg-default-300" />
          </Skeleton>

          {/* Button skeleton */}
          <Skeleton className="rounded-lg">
            <div className="h-10 w-full bg-default-300" />
          </Skeleton>
        </div>
      </CardFooter>
    </Card>
  );
}

// Export a function to render multiple skeletons
export function EventCardSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <EventCardSkeleton key={index} />
      ))}
    </>
  );
}
