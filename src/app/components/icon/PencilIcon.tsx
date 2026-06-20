export const PencilIcon = ({size = 18}: {size?: number}) => {
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
            aria-hidden="true"
        >
            <path d="M14.5 5.5 18.5 9.5" />
            <path d="m4 20 4.5-1 10-10a2.83 2.83 0 0 0-4-4l-10 10L4 20Z" />
        </svg>
    );
};
