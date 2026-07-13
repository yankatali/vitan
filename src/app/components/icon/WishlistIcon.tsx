
export default function WishlistIcon({
    size = 24,
    className = "",
    filled = false,
}: {
    size?: number;
    className?: string;
    filled?: boolean;
}) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={filled ? "#ff2d55" : "none"}
            stroke={filled ? "#ff2d55" : "currentColor"}
            strokeWidth={filled ? "0.5" : "1.8"}
            style={filled ? {filter: "drop-shadow(0 0 3px rgba(255,255,255,0.7))"} : undefined}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8Z" />
        </svg>
    );
}
