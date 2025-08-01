
export default function ShopIcon({
                                     size = 24,
                                     className = '',
                                 }: {
    size?: number;
    className?: string;
}) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* ручки пакетa */}
            <path d="M8 7V5a4 4 0 0 1 8 0v2" />
            {/* корпус пакетa */}
            <rect x="4" y="7" width="16" height="13" rx="2" />
        </svg>
    );
}
