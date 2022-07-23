import { useState, useEffect } from 'react';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import { ImageGallery } from './ImageGallery/ImageGallery';
import { Searchbar } from './Searchbar/Searchbar';
import { getImages } from '../services/api';
import { Button } from './Button/Button';
import { Loader } from './Loader/Loader';

import { AppStyled, ErrorStyled } from './App.styled';
import { Modal } from './Modal/Modal';

const Status = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

export const App = () => {
  const [searchName, setSearchName] = useState('');
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [openModalObject, setOpenModalObject] = useState(null);
  const [status, setStatus] = useState(Status.IDLE);
  const [isFullImage, setIsFullImage] = useState(false);

  useEffect(() => {
    if (searchName === '') {
      return;
    }

    setStatus(Status.PENDING);

    try {
      getImages(searchName, page).then(({ totalImage, images }) => {
        if (totalImage === 0) {
          Notify.failure('Nothing found');
          setStatus(Status.REJECTED);
          return;
        }

        setItems(prevState => {
          if (totalImage === prevState.length) {
            setIsFullImage(true);
            setItems([...prevState, ...images]);
            setStatus(Status.RESOLVED);

            return;
          }

          setItems([...prevState, ...images]);
          setStatus(Status.RESOLVED);

          return;
        });
      });
    } catch (error) {
      setStatus(Status.REJECTED);
    }
  }, [page, searchName]);

  const hendeleSubmitSearchForm = ({ name }) => {
    const validName = name.trim();
    if (validName === '') {
      Notify.failure('The search field must be filled');
      return;
    }

    if (searchName === validName) {
      Notify.failure('Replace the search term');
      return;
    }

    setSearchName(validName);
    setPage(1);
    setItems([]);
    setOpenModalObject(null);
    setStatus(status.IDLE);
    setIsFullImage(false);
  };

  const hendleOpenModal = (url, alt) => {
    const modalObject = {
      url,
      alt,
    };
    setOpenModalObject(modalObject);
  };

  const closeModal = () => {
    setOpenModalObject(null);
  };

  const loadMore = () => {
    setPage(prevState => prevState + 1);
  };

  if (status === Status.IDLE) {
    return (
      <AppStyled>
        <Searchbar onSubmit={hendeleSubmitSearchForm} />
      </AppStyled>
    );
  }

  if (status === Status.PENDING) {
    return (
      <AppStyled>
        <Searchbar onSubmit={hendeleSubmitSearchForm} />

        <ImageGallery items={items} hendleOpenModal={hendleOpenModal} />

        <Loader />
      </AppStyled>
    );
  }

  if (status === Status.RESOLVED) {
    return (
      <AppStyled>
        <Searchbar onSubmit={hendeleSubmitSearchForm} />

        <ImageGallery items={items} hendleOpenModal={hendleOpenModal} />

        {openModalObject && (
          <Modal image={openModalObject} closeModal={closeModal} />
        )}

        {!isFullImage && <Button onClick={loadMore}>Load More</Button>}

        {isFullImage && <ErrorStyled>These are all images</ErrorStyled>}
      </AppStyled>
    );
  }

  if (status === Status.REJECTED) {
    return (
      <AppStyled>
        <Searchbar onSubmit={hendeleSubmitSearchForm} />
        <ErrorStyled>Try again ...</ErrorStyled>
      </AppStyled>
    );
  }
};