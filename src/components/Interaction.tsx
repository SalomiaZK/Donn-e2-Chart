export default function Interaction(){
    const option = ["Oslo", 'Manaus', "Seattle", ""]
    return(
        <>
        <nav className="flex flex-row justify-around w-full h-10 p-2 bg-gray-900 mb-10">

            <h1>Dashboard</h1>
            <div>
                <input type="date" placeholder="start" />
                <input type="date" placeholder="end"/>
                <select>
                    {option.map(o =>
                        <option value={o}>o</option>
                    )}
                </select>
            </div>
        </nav>
        
        
        </>
    )
}