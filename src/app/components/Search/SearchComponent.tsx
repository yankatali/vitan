import SearchIcon from "@/app/components/icon/SearchIcon";


export const SearchComponent = ()=> {
    return (
        <div className="flex gap-2 items-center text-[#98887e] bg-[#f0ecea] rounded-md px-4 py-3 mx-3 h-8">
            <SearchIcon />
            <input type="text"
                   placeholder="Пошук товару"
                   className="focus:outline-none"/>
            </div>
    )
}