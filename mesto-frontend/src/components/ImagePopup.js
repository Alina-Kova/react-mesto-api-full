export function ImagePopup(props) {
    return (
        <section className={`popup popup_function_show ${props.card ? 'popup_opened' : ''}`}>
            <div className="popup__section">
                <button className="popup__close-button popup__close-image" type="button" onClick={props.onClose}></button>
                <figure className="popup__wrapper">
                    <img src={props.card.link} className="popup__image" alt={props.card.name} />
                    <figcaption className="popup__caption">{props.card.name}</figcaption>
                </figure>
            </div>
        </section>
    )
}