import { useEffect, useState } from "react";

const useCheckOverflow = ({
  ref,
}: {
  ref: React.RefObject<HTMLDivElement>;
}) => {
  const [isOverflowing, setIsOverflowing] = useState(false);

  const checkOverflow = () => {
    const element = ref.current;
    if (element) {
      // Check if the content width is greater than the visible width
      setIsOverflowing(element.scrollHeight > element.clientHeight);
    }
  };

  useEffect(() => {
    checkOverflow();
    // Re-check on window resize, as overflow status can change dynamically
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, []); // Add dependencies that might change the content width
  return { overflowY: isOverflowing, overflowX: false };
};

export default useCheckOverflow;
