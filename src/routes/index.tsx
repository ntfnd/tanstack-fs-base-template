// NOTE: src/routes/index.tsx
import type { ReactNode } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { getCounter } from "@/presentation/controllers"
import { useCounter, useIncrementCounter } from "@/hooks/use-counter"
import { Badge } from "@/components/soft-club/badge"
import { Button } from "@/components/soft-club/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/soft-club/card"

const Home = () => {
    const { data: counter, error, isLoading, isRefetching } = useCounter()
    const incrementMutation = useIncrementCounter()

    function handleIncrement() {
        incrementMutation.mutate(1)
    }

    if (error) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4">
                <h1 className="text-4xl font-bold">Error</h1>
                <p className="text-xl">Failed to load counter: {error.message}</p>
                <Button onClick={() => window.location.reload()} variant="danger">
                    Retry
                </Button>
            </div>
        )
    }

    const badgeVariantMap: Readonly<Record<string, "warning" | "green">> = {
        true: "warning",
        false: "green",
    }
    const badgeLabelMap: Readonly<Record<string, string>> = {
        true: "syncing",
        false: "online",
    }
    const buttonLabelMap: Readonly<Record<string, string>> = {
        true: "Adding...",
        false: "Add 1",
    }
    const counterDisplayMap: Readonly<Record<string, ReactNode>> = {
        true: <span className="opacity-50">...</span>,
        false: counter,
    }

    const badgeVariant = badgeVariantMap[String(isRefetching)] || "green"
    const badgeLabel = badgeLabelMap[String(isRefetching)] || "online"
    const buttonLabel =
        buttonLabelMap[String(incrementMutation.isPending)] || "Add 1"

    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Clean Architecture Counter</CardTitle>
                        <Badge variant={badgeVariant}>
                            {badgeLabel}
                        </Badge>
                    </div>
                    <CardDescription>
                        Increment the counter with instant feedback
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-6">
                    <div className="font-mono text-5xl tabular-nums">
                        {counterDisplayMap[String(isLoading)] || counter}
                    </div>
                    <Button
                        disabled={incrementMutation.isPending || isLoading}
                        onClick={handleIncrement}
                        size="lg"
                    >
                        {buttonLabel}
                    </Button>
                    {incrementMutation.isError && (
                        <p className="text-sm">
                            Failed to increment counter: {incrementMutation.error.message}
                        </p>
                    )}
                </CardContent>
            </Card>

            <div className="max-w-md text-center text-xs opacity-60">
                <p>✨ Powered by TanStack with optimistic updates</p>
                <p>🔄 Auto-refresh • ⚡ Instant feedback • 🚫 Smart error handling</p>
            </div>
        </div>
    )
}

export const Route = createFileRoute("/")({
    component: Home,
    loader: async () => await getCounter(),
})
