import { Skeleton, SkeletonProps } from "@chakra-ui/react";


export function SkeletonLoader(props: SkeletonProps) {
  return (
    <Skeleton
      {...props}
      startColor="rgba(255,255,255,0.2)"
      endColor="rgba(255,255,255,0.1)"
    />
  );
}

