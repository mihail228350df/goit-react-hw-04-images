import { useEffect } from 'react';
import PropTypes from 'prop-types';

import { OverlayStyled, ModalStyled } from './Modal.styled';

export const Modal = ({ image, closeModal }) => {
  const { url, alt } = image;

  useEffect(() => {
    const addLisetenerEsc = e => {
      if (e.code === 'Escape') {
        closeModal();
      }
    };

    document.addEventListener('keydown', addLisetenerEsc);

    return () => {
      document.removeEventListener('keydown', addLisetenerEsc);
    };
  }, [closeModal]);

  const onOverlayClick = e => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <OverlayStyled className="overlay" onClick={onOverlayClick}>
      <ModalStyled className="modal">
        <img src={url} alt={alt} />
      </ModalStyled>
    </OverlayStyled>
  );
};

Modal.propTypes = {
  image: PropTypes.object.isRequired,
  closeModal: PropTypes.func.isRequired,
};