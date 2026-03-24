'use client'

import { Icon } from "@/components/icon";
import { Card, CardContent } from "@/components/ui/card";
import { formatMoney } from "@/lib/utils";
import { useCallback, useEffect } from "react";
import { fetcher, ParamsRequest } from "@/http/api/session";
import useSWRInfinite from "swr/infinite";
import { LoadingCard } from "@/components/loading-card";
import { Category } from "./lib/session";

export default function Page() {
  const getParams = useCallback((pgIndx: number, previousPageData?: any) => {
    if (previousPageData?.nextCursor) {
      const { created_at, id } = previousPageData.nextCursor;
      return `/category?nextCreatedAt=${created_at}&nextId=${id}`;
    } else {
      return `/category`;
    }
  }, [])

  const { data: categories, isLoading, isValidating, size, setSize, mutate, error: errorCategories } = useSWRInfinite<ParamsRequest<Category[]>>(getParams, fetcher, {
    revalidateOnFocus: true,
    parallel: true,
    onErrorRetry(err, key, config, revalidate, revalidateOpts) {
      if (err.status == 401) return;
    },
  })

  useEffect(() => {
    const scrollArea = document?.querySelector('#scroll-area');
    const meta = categories?.at(-1)?.results;

    function handleScroll() {
      if (scrollArea && meta && !isValidating) {
        const { scrollTop, scrollHeight, clientHeight } = scrollArea;

        if (scrollTop + clientHeight >= scrollHeight - 10) {
          setSize(prev => prev + 1);
        }
      }
    }

    const intervalCheckScroll: NodeJS.Timeout = setInterval(() => {
      if (scrollArea && meta && !isValidating) {
        if (
          scrollArea?.clientHeight == scrollArea?.scrollHeight && !errorCategories
        ) {
          setSize(prev => prev + 1);
        } else {
          clearInterval(intervalCheckScroll);
        }
      }
    }, 500);

    scrollArea?.addEventListener('scroll', handleScroll);

    return () => {
      scrollArea?.removeEventListener('scroll', handleScroll);
      clearInterval(intervalCheckScroll);
    };
  }, [categories, setSize, errorCategories, isValidating]);

  return (
    <div className="min-h-screen flex px-4 flex-col gap-5">
      <div className={`relative grid gap-2 ${(isLoading || (categories && categories[0].data?.length)) ? 'sm:grid-cols-2 lg:grid-cols-3' : ''} grid-cols-1`}>
        {isLoading ? <LoadingCard /> :
          (size >= 0 && !errorCategories) ? (
            categories?.length && categories[0] && categories[0]?.data?.length ?
              categories.map(({ data }, index ) => {
                if (data?.length) {
                  return data.map((category, index) => (
                    <Card className="relative overflow-hidden w-full rounded-xl h-full bg-card shadow-lg shadow-muted-foreground/15"
                      onClick={() => {}}
                      key={`${category.name}-${index}`}
                    >
                      <div
                        className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 blur-3xl rounded-full"
                        style={{ background: category.icon_color, opacity: 0.35 }}
                      />
    
                      <CardContent className="p-2 items-center justify-center">
                        <div className="flex items-center justify-start gap-3">
                          <div
                            className="flex shrink-0 items-center justify-center h-12 w-12 ml-3 rounded-xl transition-colors duration-300"
                            style={{ backgroundColor: `${category.icon_color}33`, color: category.icon_color }}
                          >
                            <Icon name={category.icon_name as any} className="size-6" />
                          </div>
                          <div className="flex flex-col items-start min-w-0">
                            <p className="truncate">{category.name}</p>
                            <div className="flex flex-row gap-2 items-center justify-center">
                              <span className="text-sm text-zinc-600 dark:text-zinc-400 break:words">Descrição:</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                }
              })
            : (
              <div className="text-sm text-zinc-400 text-center">
                <p>{"Nenhuma transação encontrado"}</p>
              </div>
            )
          ) : (
            <div className="text-sm text-zinc-400 text-center">
              <p>{errorCategories?.data?.message || "Falha ao buscar transações"}</p>
            </div>
          )
        }
      </div>
    </div>
  )
}