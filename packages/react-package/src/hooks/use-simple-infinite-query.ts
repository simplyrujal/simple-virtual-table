import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';

const useSimpleInfiniteQuery = () => {
  return useInfiniteQuery({
    queryKey: [],
    queryFn: () => {
      return fetch('https://api.example.com/data').then((res) => res.json());
    },
    getNextPageParam: (lastPage, pages) => {
      return undefined;
    },
    initialPageParam: 0,
    placeholderData: keepPreviousData,
  });
};

export default useSimpleInfiniteQuery;
