export default function CartIcon({
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
            {/* корзина */}
            <circle cx="9" cy="20" r="1.5" />
            <circle cx="17" cy="20" r="1.5" />
            <path d="M3 4h2l2.4 12a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 8H6.4" />
        </svg>
    );
}
