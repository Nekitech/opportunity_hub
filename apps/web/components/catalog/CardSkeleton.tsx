export default function CardSkeleton() {
    return (
        <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm animate-pulse">
            <div className="flex items-center justify-between">
                <div className="h-4 w-16 rounded-full bg-gray-200" />
                <div className="h-3 w-20 rounded bg-gray-200" />
            </div>
            <div className="space-y-2">
                <div className="h-3.5 w-full rounded bg-gray-200" />
                <div className="h-3.5 w-4/5 rounded bg-gray-200" />
                <div className="h-3.5 w-3/5 rounded bg-gray-200" />
            </div>
            <div className="h-3 w-2/3 rounded bg-gray-100" />
            <div className="mt-auto h-3 w-1/2 rounded bg-gray-100" />
        </div>
    );
}
