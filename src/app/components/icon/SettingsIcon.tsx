interface SettingsIconProps {
    size?: number;
}

export const SettingsIcon = ({size = 18}: SettingsIconProps) => {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
                d="M4 7h7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <path
                d="M15 7h5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <circle cx="13" cy="7" r="2" stroke="currentColor" strokeWidth="2" />
            <path
                d="M4 17h5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <path
                d="M13 17h7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <circle cx="11" cy="17" r="2" stroke="currentColor" strokeWidth="2" />
        </svg>
    );
};
