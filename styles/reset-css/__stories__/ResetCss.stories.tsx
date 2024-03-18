import React from 'react';
import Frame from 'react-frame-component';
import styles from './ResetCss.stories.module.css';

const ElementsList = () => (
    <>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '1rem' }}>
            <label htmlFor="input">Инпут</label>
            <input id="input" type="text" placeholder="Введите текст" />

            <label htmlFor="link">Ссылка</label>
            <a id="link" href="/">
                Текст ссылки
            </a>

            <label htmlFor="button">Кнопка</label>
            <button id="button">Жми сюда</button>

            <label htmlFor="text">Текст</label>
            <span id="text">
                Lorum <small>ipsum</small> <strong>dolor</strong> <sub>sit</sub> <sup>amet</sup>,{' '}
                <abbr title="абракадабра">consectetur adipiscing elit</abbr>
            </span>

            <label htmlFor="table">Таблица</label>
            <table id="table">
                <thead>
                    <tr>
                        <th>Столбец 1</th>
                        <th>Столбец 2</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Яблоко</td>
                        <td>Апельсин</td>
                    </tr>
                </tbody>
            </table>

            <label htmlFor="image">Картинка</label>
            <img
                id="image"
                src="https://images.unsplash.com/photo-1703622603725-a6a102e12fbc?q=80&w=300"
                alt="Картинка"
            />
        </div>
    </>
);

export const Sandbox = () => (
    <div className={styles.container}>
        <div>
            <h3>reset-css OFF</h3>
            <Frame width={500} height={500}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <ElementsList />
                </div>
            </Frame>
        </div>
        <div>
            <h3>reset-css ON</h3>
            <div className={styles.listContainer}>
                <ElementsList />
            </div>
        </div>
    </div>
);

export default {
    title: 'styles/reset-css'
};
