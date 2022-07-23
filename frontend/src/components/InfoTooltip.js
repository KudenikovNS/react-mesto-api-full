import { useState, useEffect } from "react";
import successImage from "../vendor/images/acceptRegistration.svg";
import errorImage from "../vendor/images/rejectRegistration.svg";

function InfoTooltip({ isOpen, onClose, success }) {
  const [message, setMessage] = useState("");

  function handleMouseDown(evt) {
    if (evt.target === evt.currentTarget) {
      onClose();
    }
  }

  useEffect(() => {
    if (success) {
      setMessage("Вы успешно зарегистрировались!");
    } else {
      setMessage("Что-то пошло не так! Попробуйте ещё раз.");
    }
  }, [success]);

  return (
    <div
      className={`popup registration-popup ${isOpen && "popup_opened"}`}
      onMouseDown={handleMouseDown}
    >
      <div className='popup__container'>
        <button
          onClick={onClose}
          className='popup__btn-close'
          type='button'
          aria-label='Закрыть'
        />
        <img
          className='authorization__image'
          src={success ? successImage : errorImage}
          alt={success ? "Успех" : "Неудача"}
        />
        <h2 className='popup__title popup__title_margin'>{message}</h2>
      </div>
    </div>
  );
}

export default InfoTooltip;
