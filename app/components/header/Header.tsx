import next from "next";
import Image from "next/image";

export default function Header() {
    return (
        <header className="header">
            <div className="top-header">
                <div className="container">
                    <ul>
                        <li>Pepsi home delivery</li>
                        <li>Champaign - Urbana - Savoy</li>
                    </ul>
                </div>
            </div>
            <div className="main-header">
                <div className="container">
                    <div className="head-logo">
                        <Image
                            src={'/images/icons/header-logo.svg'}
                            alt={'Pepsi Logo'}
                            width={400}
                            height={400}
                            sizes="(max-width: 768px) 80vw, 25vw"
                            style={{ objectFit: "contain" }}
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}
