
function QueuePopup() {

    return (
        <div
            className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden rounded-lg border border-black/5 bg-[rgba(128, 128, 128, 0.7)] backdrop-blur-sm p-4 transition-opacity duration-300"
            id="queue-overlay">
            <div
                className="mx-auto max-w-md rounded-lg border bg-white p-8 text-center shadow-md    "
            >
                <h2
                    className="mb-4 py-3 text-xl font-semibold tracking-tight text-zinc-800 "
                    id="error-title"
                >
                    You're in the Queue
                </h2>
                <p className="text-sm leading-6 text-zinc-600 ">
                    We're facing a high-volume of requests.<br />Please wait or upgrade
                    to get priority access.
                </p>
                <div className="flex justify-center py-3">
                    <svg
                        className="animate-spin h-6 w-6 opacity-70"
                        fill="currentColor"
                        viewBox="0 0 256 256"
                        xmlns="http://www.w3.org/2000/svg"
                    ><path
                        d="M232 128a104 104 0 0 1-208 0c0-41 23.81-78.36 60.66-95.27a8 8 0 0 1 6.68 14.54C60.15 61.59 40 93.27 40 128a88 88 0 0 0 176 0c0-34.73-20.15-66.41-51.34-80.73a8 8 0 0 1 6.68-14.54C208.19 49.64 232 87 232 128Z"
                    ></path></svg>
                </div>
                <div
                    className="flex justify-center gap-2 py-3 text-sm leading-5 text-zinc-600 "
                >
                    <a href='/'
                        className="inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background font-medium shadow-sm hover:bg-accent hover:text-accent-foreground h-8 px-3 py-2"
                    >Home</a>
                    <a href='/queue'
                        className="inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-8 px-3 py-2"
                    >View Queue</a>
                </div>
            </div>
        </div>
    )
}

export default QueuePopup