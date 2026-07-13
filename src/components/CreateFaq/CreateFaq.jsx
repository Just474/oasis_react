import React, {useState} from "react";
import {createFaq} from "../../services/faqService.jsx";


const fieldsForm = [
    {
        name: 'question',
        label: 'Вопрос',
        type: 'text',
        placeholder: 'Как оформить бронирование?',
        autocomplete: 'question'
    },
]


export default function CreateFaq() {
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        question: '',
        answer: '',
    })

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                data.append(key, formData[key]);
            });

            await createFaq(data)

            setFormData({
                question: '',
                answer: '',
            })
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors || {});
            } else if (error.response?.status === 403) {
                setErrors({general: ["Нет доступа"]});
            } else {
                console.log(error);
                setErrors({general: ["Ошибка сервера"]});
            }
        } finally {
            setLoading(false);
        }
    }


    return (<>
        <main>
            <div className="wrapper">
                <h2>Добавление вопроса</h2>
                <form action="" onSubmit={handleSubmit}>
                    {fieldsForm.map((item, index) => (
                        <div key={index} className='container-input'>
                            <label htmlFor={item.name}>{item.label}</label>
                            <input
                                id={item.name}
                                type={item.type}
                                name={item.name}
                                placeholder={item.placeholder}
                                autoComplete={item.autocomplete}
                                value={formData[item.name]}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    ))}
                    <div className="container-input">
                        <label htmlFor="answer">Ответ</label>
                         <textarea
                             name="answer"
                             id="answer"
                             cols="50"
                             rows="10"
                             required
                             value={formData["answer"]}
                             onChange={handleChange}
                             placeholder='Заполните форму поиска квартиры. Выберите количество взрослых и детей и даты проживания. Выберите подходящую квартиру в результатах поиска. Воспользуйтесь фильтрами для легкого поиска подходящего предложения. Выберите квартиру. Вы можете выбрать категорию квартиры по разным параметрам. Оформите заказ и оплатите его, внесите предоплату. Не забудьте указать всех гостей. Ознакомьтесь с условиями, правилами проживания в арендованной квартире, офертой и политикой конфиденциальности. После завершения оформления заказа на указанный вами адрес электронной почты будет отправлено письмо с подтверждением бронирования. Статус заказа «Бронирование подтверждено» означает успешное оформление номера. Если вы видите другой статус, то, пожалуйста, обратитесь в службу поддержки. Приобрести номер в Апартаментах "Оазис" с максимальной выгодой можно, обратившись по телефону.'>
                    </textarea>
                    </div>
                    {Object.keys(errors).length > 0 && (
                        <div className="errors">
                            {Object.entries(errors).map(([field, messages]) => (
                                <span key={field} className="error">
                                       {messages.join(", ")}
                                    </span>
                            ))}
                        </div>
                    )}
                    <input type="submit" className='btn' disabled={loading} value={loading ? "Создаем вопрос..." : "Создать вопрос"}   />
                </form>
            </div>
        </main>
    </>)
}