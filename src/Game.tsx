import React, { useEffect, useState } from 'react';
import styles from './Game.module.css';

const clearBoard: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0];

const winningCombinations = [
    // horizontal
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // vertical
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // diagonal
    [0, 4, 8],
    [2, 4, 6],
];

const randomNum = (num: number): number => {
    return Math.floor(1 + Math.random() * num);
};

const Game: React.FC = function () {
    // 1 for X, 2 for O, 3 for Nodody
    const [winner, setWinner] = useState<0 | 1 | 2 | 3>(0);

    const [gameOver, setGameOver] = useState<boolean>(false);
    const [board, setBoard] = useState<number[]>(clearBoard);

    useEffect(() => {
        if (!gameOver) {
            const arr = newRandomMove(clearBoard);
            setBoard(arr!);
        }
    }, [gameOver]);

    const newPlayerMove = (cell: number): number[] => {
        const newArr = [...board];
        newArr[cell] = 1;
        return newArr;
    };

    const checkTheWinner = (arr: number[]): boolean => {
        const wc = winningCombinations;
        const players = [1, 2];

        for (const i in wc) {
            for (const p in players) {
                if (arr[wc[i][0]] === players[p] && arr[wc[i][0]] === arr[wc[i][1]] && arr[wc[i][1]] === arr[wc[i][2]]) {
                    setWinner(players[p] as 1 | 2);
                    setGameOver(true);
                    return true;
                }
            }
        }

        if (arr.every((value) => value !== 0)) {
            setWinner(3);
            setGameOver(true);
            return true;
        }

        return false;
    };

    const newRandomMove = (arr: number[]): number[] | undefined => {
        const newArr = [...arr];

        while (!gameOver) {
            const randomCell = randomNum(9);

            if (newArr[randomCell - 1] === 0) {
                newArr[randomCell - 1] = 2;
                return newArr;
            }
        }
    };

    const newMoveHandler = (cell: number): void => {
        if (gameOver || board[cell] === 1 || board[cell] === 2) return;

        const newMoveArr = newPlayerMove(cell);
        const isWinner = checkTheWinner(newMoveArr);

        const rndMoveArr = newRandomMove(newMoveArr);

        if (!isWinner) checkTheWinner(rndMoveArr!);

        setBoard(rndMoveArr!);
    };

    const restartGameHandler = () => {
        setWinner(0);
        setGameOver(false);
    };

    return (
        <div className={styles.main}>
            <Board board={board} gameOver={gameOver} newMoveHandler={newMoveHandler} />
            {gameOver && (
                <div className={styles.menu}>
                    <h2>Game Over</h2>
                    <h3>Winner: {winner === 1 ? 'x' : winner === 2 ? 'o' : 'nobody'}</h3>
                    <button onClick={restartGameHandler}>Restart</button>
                </div>
            )}
        </div>
    );
};

interface IBoardProps {
    board: number[];
    gameOver: boolean;
    newMoveHandler: (i: number) => void;
}

const Board: React.FC<IBoardProps> = function ({ board, gameOver, newMoveHandler }) {
    return (
        <div className={styles.board}>
            <>
                {board?.map((cell, index) => {
                    return (
                        <div key={index} className={`${styles.cell} ${gameOver && styles.inactive}`} onClick={() => newMoveHandler(index)}>
                            <h1>{cell === 1 ? 'x' : cell === 2 ? 'o' : ''}</h1>
                        </div>
                    );
                })}
            </>
        </div>
    );
};

export default Game;
