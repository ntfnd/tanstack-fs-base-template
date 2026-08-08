// NOTE: Global 404 page — rendered by the root route when no route matches
import { Link } from "@tanstack/react-router"
import { Button } from "@/components/soft-club/button"
import { Card, CardContent } from "@/components/soft-club/card"

export const NotFoundPage = () => (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col items-center justify-center p-6">
        <Card className="w-full max-w-md">
            <CardContent className="flex flex-col items-center gap-4 py-16">
                <p className="font-mono text-6xl font-bold opacity-40">404</p>
                <h1 className="text-2xl font-bold">Page not found</h1>
                <p className="text-center opacity-70">
                    The page you are looking for does not exist or has been moved.
                </p>
                <Link to="/">
                    <Button variant="outline">Back to Dashboard</Button>
                </Link>
            </CardContent>
        </Card>
    </div>
)
