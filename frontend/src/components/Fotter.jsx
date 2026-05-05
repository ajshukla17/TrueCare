import logo from "../assets/assets/logo_true_carw.png"

function Fotter() {
    return (
        <div className="md:mx-10">
            <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
                {/* {left section} */}
                <div>
                    <img className="mb-5 w-40" src={logo} alt="TrueCare Logo" />

                    <p className="w-full md:w-2/3 text-gray-600 leading-6">
                        TrueCare simplifies your healthcare journey by connecting you with trusted doctors
                        in just a few clicks. Book appointments instantly, manage your consultations, and
                        securely store your medical reports in one place — so you never lose important
                        health records again. Your health, our priority.
                    </p>
                </div>

                {/* center section  */}
                <div>
                    <p className="text-xl font-medium mb-5">Company</p>
                    <ul className="flex flex-col gap-2 text-gray-600">
                        <li>Home</li>
                        <li>About Us</li>
                        <li>Contact Us</li>
                        <li>Privacy Policy</li>
                    </ul>

                </div>

                {/* rigth section */}
                <div>
                    <p className="text-xl font-medium mb-5" >GET IN TOUCH</p>
                    <ul className="flex flex-col gap-2 text-gray-600">
                        <li><a href="tel:6394122075">Call Us: 6394122075</a></li>
                        <li> <a href="mailto:truecareinfotechpvtltd@gmail.com">Mail Us: truecareinfotechpvtltd@gmail.com</a></li>
                    </ul>
                </div>
            </div>
            <div>
                {/* copyrigth */}
                <hr />
                <p className="py-5 text-sm text-center">Copyright © 2026 trueCare Infotech PVT. LTD - All Right Reserved.</p>
            </div>

        </div>
    );
}

export default Fotter;