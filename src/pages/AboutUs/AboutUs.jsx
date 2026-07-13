

export default function AboutUs() {
    return(
        <>
            <main>
                <div className="wrapper">
                    <div className="requisites-container">
                        <div className="requisites-header">
                            <h2>Информация о компании</h2>
                            <p>Это тестовая информация</p>
                            {/*<p>ИП Киселева Олимпиада Владимировна</p>*/}
                        </div>

                        <div className="requisites-content">
                            <div><span className="label">ИНН</span></div>
                            {/*<div><span className="value">190118320421</span></div>*/}
                            <div><span className="value">1955346456421</span></div>

                            <div><span className="label">ОГРН</span></div>
                            {/*<div><span className="value">1111901001376</span></div>*/}
                            <div><span className="value">1111324326</span></div>

                            <div><span className="label">Дата регистрации</span></div>
                            <div><span className="value">4 февраля 2004 г.</span></div>

                            <div><span className="label">Юридический адрес организации</span></div>
                            {/*<div><span className="value">Республика Хакасия, Абакан, проспект <br/> Дружбы народов, 49, 1 этаж</span>*/}
                            <div><span className="value">Это тестовый сайт <br/> и информация является не действительной</span>
                            </div>

                            <div><span className="label">Наш номер телефона</span></div>
                            <div><span className="value">+7 (923) 356-54-14</span></div>
                            {/*<div><span className="value">+7 (923) 215-54-14</span></div>*/}

                            <div><span className="label">Наша почта</span></div>
                            <div><span className="value">test@mail.ru</span></div>
                            {/*<div><span className="value">kiselev-7@mail.ru</span></div>*/}

                            <div><span className="label">ч</span></div>
                            <div><span className="value">432342342324324</span></div>
                            {/*<div><span className="value">30101810145250000974</span></div>*/}


                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}