import { Input } from "../../ui";

export function SearchWithFilter ({searchInput, setSearchInput, setSearchType}) {
    const options = [
        {
            name: "Profile",
        },
        {
            name: "Group",
        }
    ]

    return (
        <div className="w-fit mx-auto flex items-center gap-2 px-1">
            <select 
                className="p-1 md:p-2 outline-none border rounded-2xl cursor-pointer text-xs min-[400px]:text-sm md:text-lg"
                defaultValue="Profile"
                onChange={(e) =>{
                    setSearchType(e.target.value)
                }}
            >
                {options?.map(({name}) => (
                    <option 
                        className="bg-[#a8a8a8] dark:bg-[#626262]"
                        value ={name}
                        key={name}
                    >
                        {name}
                    </option>
                ))}
            </select>
            <Input 
                value = {searchInput}
                onChange = {(e) => {setSearchInput(e.target.value)}}
                text= "text-sm sm:text-md md:text-lg"
                placeholder = "Search"
                padding = "p-1"
                margin="m-0"

            />
        </div>
    )
}