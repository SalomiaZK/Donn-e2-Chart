import {Link} from "react-router"

export default function NavBar(){

    const buttons = ["page1", "PAge2"]

    return (
        <div className="flex flex-col justify-around">
           <Link to={"/"}> Page1</Link>
           <Link to={"/page2"}> Page2</Link>


        </div>
    )
}