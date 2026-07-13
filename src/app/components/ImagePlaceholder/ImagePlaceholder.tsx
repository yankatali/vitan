interface ImagePlaceholderProps {
    className?: string;
    iconSize?: number;
}

export const ImagePlaceholder = ({className, iconSize = 36}: ImagePlaceholderProps) => (
    <div className={className}>
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="m21 15-5-5L5 21" />
        </svg>
    </div>
);
