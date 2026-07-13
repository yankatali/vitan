export default function CartIcon({
    size = 24,
    className = '',
    checked = false,
    strokeWidth = '1.8'
}: {
    size?: number;
    className?: string;
    checked?: boolean;
    strokeWidth?: string;
}) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle cx="9" cy="20" r="1.5" fill="currentColor" stroke="none" />
            <circle cx="17" cy="20" r="1.5" fill="currentColor" stroke="none" />
            <path
                d="M3 4h2l2.4 12a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 8H6.4"
                fill={checked ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth={strokeWidth}
            />
            {checked && (
                <>
                    <circle cx="17" cy="7" r="7" fill="white" stroke="rgba(0,0,0,0.14)" strokeWidth="0.8" />
                    <path
                        d="M13.5 7L15.9 9.4L20.5 4.2"
                        stroke="#1c1c1e"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                    />
                </>
            )}
        </svg>
    );
}
