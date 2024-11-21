
export default function Loading() {
    return (
        <div className="p-5 flex flex-col items-center justify-center space-y-4">
            {/* Spiral Loader */}
            <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
            <p className="animate-pulse">Loading the user...</p>
        </div>
    );
}
