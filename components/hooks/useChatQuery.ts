import qs from 'query-string'
import { useInfiniteQuery } from '@tanstack/react-query';

import { useSocket } from '../socket.io-provider';

interface ChatQueryProps {
    queryKey: string
    apiUrl: string
    paramKey: "channelId" | "conversationId"
    paramValue: string
}

export const useChatQuery = ({apiUrl, queryKey, paramKey, paramValue }: ChatQueryProps) => {
    const { isConnected } = useSocket();

    const fetchMessages = async ({pageParam = undefined}) => {
        const firstPageParam = undefined;

        const url = qs.stringifyUrl({
            url: apiUrl,
            query: {
                cursor: pageParam ? pageParam: firstPageParam,
                [paramKey]: paramValue
            }
        }, { skipNull: true})
        const res = await fetch(url);
        return res.json();
    }
    const { hasNextPage, data, fetchNextPage, isFetchingNextPage, status } = useInfiniteQuery({
        queryKey: [queryKey],
        queryFn: ({pageParam}) =>fetchMessages({pageParam}),
        initialPageParam: undefined,
        getNextPageParam: (lastPage) => {
            return lastPage?.nextCursor
        },
        refetchInterval: isConnected ? false : 1000
    })

    return {
        hasNextPage, data, fetchNextPage, isFetchingNextPage, status
    }
}