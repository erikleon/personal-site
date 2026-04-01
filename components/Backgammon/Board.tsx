import { useState, useCallback, useEffect, useRef } from "react";
import type { GameState, Move } from "../../lib/backgammon/types";
import {
  createInitialState,
  startTurn,
  endTurn,
  applyMove,
  getLegalMoves,
  remainingDice,
} from "../../lib/backgammon/engine";
import { pickBestTurn } from "../../lib/backgammon/ai";
import PointComponent from "./Point";
import Dice from "./Dice";
import GameStatus from "./GameStatus";
import GameControls from "./GameControls";
import styles from "../../styles/Backgammon.module.css";

const HUMAN_PLAYER = "white" as const;

export default function Board() {
  const [state, setState] = useState<GameState>(createInitialState);
  const [selected, setSelected] = useState<number | "bar" | null>(null);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const aiTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean up AI timeout on unmount
  useEffect(() => {
    return () => {
      if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current);
    };
  }, []);

  const isPlayerTurn = state.currentPlayer === HUMAN_PLAYER;

  // Get legal moves from the selected source
  const legalMoves = getLegalMoves(state);
  const movesFromSelected =
    selected !== null
      ? legalMoves.filter((m) => m.from === selected)
      : [];

  // Legal target indices for the selected checker
  const legalTargets = new Set(
    movesFromSelected.map((m) => m.to)
  );

  // Which points have checkers the player can move
  const movableSources = new Set(
    isPlayerTurn && state.phase === "moving"
      ? legalMoves.map((m) => m.from)
      : []
  );

  const handleRoll = useCallback(() => {
    if (!isPlayerTurn || state.phase !== "rolling") return;
    const next = startTurn(state);
    setState(next);
    setSelected(null);

    // If turn was skipped (no legal moves), AI goes
    if (next.currentPlayer !== HUMAN_PLAYER && next.phase === "rolling") {
      runAiTurn(next);
    }
  }, [state, isPlayerTurn]);

  const handleEndTurn = useCallback(() => {
    if (remainingDice(state).length > 0) return;
    const next = endTurn(state);
    setState(next);
    setSelected(null);

    if (next.phase !== "finished" && next.currentPlayer !== HUMAN_PLAYER) {
      runAiTurn(next);
    }
  }, [state]);

  const handleNewGame = useCallback(() => {
    if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current);
    setState(createInitialState());
    setSelected(null);
    setIsAiThinking(false);
  }, []);

  const runAiTurn = useCallback((s: GameState) => {
    setIsAiThinking(true);

    // Small delay so the player can see what's happening
    const rolled = startTurn(s);
    setState(rolled);

    // If AI's turn was skipped
    if (rolled.currentPlayer === HUMAN_PLAYER) {
      setIsAiThinking(false);
      return;
    }

    aiTimeoutRef.current = setTimeout(() => {
      const turn = pickBestTurn(rolled);
      let current = rolled;

      // Apply moves with staggered delays for visual effect
      if (turn.length === 0) {
        const ended = endTurn(current);
        setState(ended);
        setIsAiThinking(false);
        return;
      }

      let i = 0;
      const applyNext = () => {
        if (i < turn.length) {
          current = applyMove(current, turn[i]);
          setState(current);
          i++;
          aiTimeoutRef.current = setTimeout(applyNext, 400);
        } else {
          const ended = endTurn(current);
          setState(ended);
          setIsAiThinking(false);
        }
      };
      applyNext();
    }, 600);
  }, []);

  const handlePointClick = useCallback(
    (index: number) => {
      if (!isPlayerTurn || state.phase !== "moving" || isAiThinking) return;

      // If clicking a legal target, make the move
      if (selected !== null && legalTargets.has(index)) {
        const move = movesFromSelected.find((m) => m.to === index);
        if (move) {
          applyPlayerMove(move);
          return;
        }
      }

      // If clicking own checker that has legal moves, select it
      if (movableSources.has(index)) {
        setSelected(index);
        return;
      }

      setSelected(null);
    },
    [state, selected, isPlayerTurn, isAiThinking, legalTargets, movableSources, movesFromSelected]
  );

  const handleBarClick = useCallback(() => {
    if (!isPlayerTurn || state.phase !== "moving" || isAiThinking) return;
    if (state.bar[HUMAN_PLAYER] > 0 && movableSources.has("bar")) {
      setSelected("bar");
    }
  }, [state, isPlayerTurn, isAiThinking, movableSources]);

  const handleBearOffClick = useCallback(() => {
    if (!isPlayerTurn || state.phase !== "moving" || isAiThinking) return;
    if (selected !== null && legalTargets.has("off")) {
      const move = movesFromSelected.find((m) => m.to === "off");
      if (move) applyPlayerMove(move);
    }
  }, [state, selected, isPlayerTurn, isAiThinking, legalTargets, movesFromSelected]);

  const applyPlayerMove = useCallback(
    (move: Move) => {
      const next = applyMove(state, move);
      setState(next);
      setSelected(null);

      // Auto-end turn if no dice remaining
      const remaining = remainingDice(next);
      if (remaining.length === 0) {
        const ended = endTurn(next);
        setState(ended);
        if (ended.phase !== "finished" && ended.currentPlayer !== HUMAN_PLAYER) {
          runAiTurn(ended);
        }
      } else {
        // Check if any moves remain
        const nextMoves = getLegalMoves(next);
        if (nextMoves.length === 0) {
          const ended = endTurn(next);
          setState(ended);
          if (
            ended.phase !== "finished" &&
            ended.currentPlayer !== HUMAN_PLAYER
          ) {
            runAiTurn(ended);
          }
        }
      }
    },
    [state, runAiTurn]
  );

  const handleAutoMove = useCallback(
    (from: number | "bar") => {
      if (!isPlayerTurn || state.phase !== "moving" || isAiThinking) return;
      const moves = legalMoves.filter((m) => m.from === from);
      if (moves.length === 0) return;

      // Prefer bear-off, then largest die move
      const bearOff = moves.find((m) => m.to === "off");
      if (bearOff) {
        applyPlayerMove(bearOff);
        return;
      }
      const best = moves.reduce((a, b) => (b.die > a.die ? b : a));
      applyPlayerMove(best);
    },
    [state, isPlayerTurn, isAiThinking, legalMoves, applyPlayerMove]
  );

  // Board layout: top row is points 13-24 (left to right), bottom row is 12-1
  // Top row: indices 12..23 (left half 12-17, bar, right half 18-23)
  // Bottom row: indices 11..0 (left half 11-6, bar, right half 5-0)
  const topLeft = [12, 13, 14, 15, 16, 17]; // points 13-18
  const topRight = [18, 19, 20, 21, 22, 23]; // points 19-24
  const bottomLeft = [11, 10, 9, 8, 7, 6]; // points 12-7
  const bottomRight = [5, 4, 3, 2, 1, 0]; // points 6-1

  const renderPoint = (index: number, reversed: boolean) => (
    <PointComponent
      key={index}
      point={state.points[index]}
      index={index}
      reversed={reversed}
      selected={selected === index}
      isLegalTarget={selected !== null && legalTargets.has(index)}
      onClick={() => handlePointClick(index)}
      onCheckerClick={() => handlePointClick(index)}
      onDoubleClick={() => handleAutoMove(index)}
    />
  );

  const barWhiteCount = state.bar.white;
  const barBlackCount = state.bar.black;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Backgammon</h1>

      <GameStatus state={state} isAiThinking={isAiThinking} />

      <div className={styles.board}>
        <div className={styles.boardInner}>
          {/* Top half: points 13-24, black's home side on right */}
          <div className={styles.halfRow}>
            <div className={styles.pointsGroup}>
              {topLeft.map((i) => renderPoint(i, false))}
            </div>
            <div
              className={`${styles.barZone} ${
                selected === "bar" ? styles.barHighlight : ""
              }`}
              onClick={handleBarClick}
              onDoubleClick={() => handleAutoMove("bar")}
            >
              <div className={styles.barCheckers}>
                {barBlackCount > 0 &&
                  Array.from(
                    { length: Math.min(barBlackCount, 3) },
                    (_, i) => (
                      <div
                        key={`bb-${i}`}
                        className={`${styles.checker} ${styles.checkerBlack}`}
                      >
                        {i === Math.min(barBlackCount, 3) - 1 &&
                          barBlackCount > 3 && (
                            <span className={styles.checkerCount}>
                              {barBlackCount}
                            </span>
                          )}
                      </div>
                    )
                  )}
              </div>
              <span className={styles.barLabel}>BAR</span>
              <div className={styles.barCheckers}>
                {barWhiteCount > 0 &&
                  Array.from(
                    { length: Math.min(barWhiteCount, 3) },
                    (_, i) => (
                      <div
                        key={`bw-${i}`}
                        className={`${styles.checker} ${styles.checkerWhite} ${
                          selected === "bar" && i === 0
                            ? styles.checkerSelected
                            : ""
                        }`}
                      >
                        {i === Math.min(barWhiteCount, 3) - 1 &&
                          barWhiteCount > 3 && (
                            <span className={styles.checkerCount}>
                              {barWhiteCount}
                            </span>
                          )}
                      </div>
                    )
                  )}
              </div>
            </div>
            <div className={styles.pointsGroup}>
              {topRight.map((i) => renderPoint(i, false))}
            </div>
            {/* Black bear-off on top-right */}
            <div className={styles.bearOffArea}>
              <span className={styles.bearOffLabel}>OFF</span>
              <span className={styles.bearOffCount}>
                {state.borneOff.black}
              </span>
              <div
                className={`${styles.checker} ${styles.checkerBlack}`}
                style={{ width: 20, height: 20, marginTop: 0 }}
              />
            </div>
          </div>

          {/* Dice in the middle */}
          <Dice dice={state.dice} usedDice={state.usedDice} />

          {/* Bottom half: points 12-1, white's home side on right */}
          <div className={styles.halfRow}>
            <div className={styles.pointsGroup}>
              {bottomLeft.map((i) => renderPoint(i, true))}
            </div>
            <div className={styles.barZone}>
              <span className={styles.barLabel}>BAR</span>
            </div>
            <div className={styles.pointsGroup}>
              {bottomRight.map((i) => renderPoint(i, true))}
            </div>
            {/* White bear-off on bottom-right */}
            <div
              className={`${styles.bearOffArea} ${
                selected !== null && legalTargets.has("off")
                  ? styles.bearOffTarget
                  : ""
              }`}
              onClick={handleBearOffClick}
            >
              <div
                className={`${styles.checker} ${styles.checkerWhite}`}
                style={{ width: 20, height: 20, marginTop: 0 }}
              />
              <span className={styles.bearOffCount}>
                {state.borneOff.white}
              </span>
              <span className={styles.bearOffLabel}>OFF</span>
            </div>
          </div>
        </div>
      </div>

      <GameControls
        state={state}
        isPlayerTurn={isPlayerTurn}
        isAiThinking={isAiThinking}
        onRoll={handleRoll}
        onEndTurn={handleEndTurn}
        onNewGame={handleNewGame}
      />
    </div>
  );
}
