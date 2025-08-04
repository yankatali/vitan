
interface ItemComponentProps {
    image: string,
    title: string,
}

export const ItemComponent = ({ image, title}: ItemComponentProps) => {
    return (
        <div className="flex flex-col items-center text-[#2c2b2a]">
            <img
                src={image}
                alt={title}
                className="w-full h-48 object-cover rounded-lg mb-2"
            />
            <h3 className="text-sm font-medium text-center">Name</h3>
            <p className="text-sm">Descriptions</p>
        </div>
    )
}