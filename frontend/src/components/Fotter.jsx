import logo from "../assets/assets/logo_true_carw.png"

function Fotter() {
    return ( 
        <div className="md:mx-10">
            <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
                {/* {left section} */}
                <div>
                    <img className="mb-5 w-40" src={logo} alt="" />
                    <p className="w-full md:w-2/3 text-gray-600 leading-6">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolor  sunt<br /> repellendus fugiat facilis  voluptatem commodi similique, tempora <br />consequatur  aut laudantium. </p>
                </div>

                {/* center section  */}
                <div>
                    <p className="text-xl font-medium mb-5">Company</p>
                    <ul className="flex flex-col gap-2 text-gray-600">
                        <li>Home</li>
                        <li>About Us</li>
                        <li>Contact Us</li>
                        <li>Privacy Pokicy</li>
                    </ul>

                </div>

                {/* rigth section */}
                <div>
                    <p className="text-xl font-medium mb-5" >GET IN TOUCH</p>
                    <ul className="flex flex-col gap-2 text-gray-600">
                        <li><a href="tel:6394122075">Call Us: 6394122075</a></li>
                        <li> <a href="mailto:ajshukla179@gmail.com">Mail Us: ajshukla179@gmail.com</a></li>
                    </ul>
                </div>
            </div>
            <div>
                {/* copyrigth */}
                <hr />
                <p className="py-5 text-sm text-center">Copyright © 2026 Ajitesh Shukla- TrueCare - All Right Reserved.</p>
            </div>

        </div>
     );
}

export default Fotter;