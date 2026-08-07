// NOTE: src/routes/__root.tsx
// NOTE: vite/client types (TS reference directive)
import type { ReactNode } from "react"
import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import {
    HeadContent,
    Outlet,
    Scripts,
    createRootRoute,
} from "@tanstack/react-router"
import { createQueryClient } from "@/lib/query-client"
import { ThemeProvider } from "@/components/theme-provider"
import appCss from "@/styles/app.css?url"

const queryClient = createQueryClient()

const RootComponent = () => (
    <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
            <RootDocument>
                <Outlet />
            </RootDocument>
        </ThemeProvider>
        <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
)

const RootDocument = ({ children }: Readonly<{ children: ReactNode }>) => (
    <html data-sc-theme="green" lang="en">
        <head>
            <HeadContent />
        </head>
        <body>
            {children}
            <Scripts />
        </body>
    </html>
)

export const Route = createRootRoute({
    head: () => ({
        meta: [
            {
                charSet: "utf-8",
            },
            {
                name: "viewport",
                content: "width=device-width, initial-scale=1",
            },
            {
                title: "TanStack Start Starter",
            },
        ],
        links: [{ rel: "stylesheet", href: appCss }],
    }),
    component: RootComponent,
})
