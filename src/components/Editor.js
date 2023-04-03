import { useEffect, useReducer, createRef, useState } from "react";
import { Event } from "../tools/Event";
import { Game } from "../tools/Game";
import { storeModerationEvent } from "../tools/tools";


const Editor = props => {

    const [, forceUpdate] = useReducer(x => x + 1, 0);

    const [event, setEvent] = useState(new Event("", []));
    const [newGameSelector, setNewGameSelector] = useState("quiz");
    const [focusedGame, setFocusedGame] = useState(0);

    const refUpload = createRef();

    useEffect(() => {
        let removeUpdatehandler;
        let removeSavehamdler;
        if(window.electronAPI) {
            removeUpdatehandler = window.electronAPI.handleEventUpdate((_event, value) => {
                let newEvent;
                if(!value)
                    newEvent = new Event("", []);
                else
                    newEvent = JSON.parse(value);
                setEvent(e => ({...newEvent}));
                setTitleDirtyState(false, newEvent?.title);
                forceUpdate();
            });
        
            removeSavehamdler = window.electronAPI.handleEventSave((ev, value) => {
                window.electronAPI.saveEvent(JSON.stringify(event));
                setTitleDirtyState(false);
            });
        }

        return () => {
            if(removeUpdatehandler) removeUpdatehandler();
            if(removeSavehamdler) removeSavehamdler();
        }

    }, [event]);

    const handleUpdate = (name, value) => {
        event[name] = value;
        setEvent(event);
        setTitleDirtyState(true);
        forceUpdate();
    }

    const setTitleDirtyState = (isDirty, title) => {
        window.electronAPI.setTitle((title ?? event?.title ?? "New") + (isDirty ? "*" : ""));
    }

    const updateGame = (name, value, game) => {
        game[name] = value;
        handleUpdate('games', event.games);
    }

    const updateContent = (name, value, game) => {
        game.content[name] = value;
        handleUpdate('games', event.games);
    }

    const updateQuestion = (name, value, questionIndex, game) => {
        game.content.questions[questionIndex][name] = value;
        handleUpdate('games', event.games);
    }

    const updateRound = (name, value, roundIndex, game) => {
        game.content.rounds[roundIndex][name] = value;
        handleUpdate('games', event.games);
    }

    const updateQuestionForBingo = (name, value, questionIndex, game) => {
        game.content.questions[questionIndex].question[name] = value;
        handleUpdate('games', event.games);
    }

    const updateAnswer = (name, value, questionIndex, answerIndex, game) => {
        game.content.questions[questionIndex].presetAnswers[answerIndex][name] = value;
        handleUpdate('games', event.games);
    }

    const updateHint = (name, value, roundIndex, hintIndex, game) => {
        game.content.rounds[roundIndex].hints[hintIndex][name] = value;
        handleUpdate('games', event.games);
    }

    const updateAnswerForBingo = (name, value, questionIndex, answerIndex, game) => {
        game.content.questions[questionIndex].question.presetAnswers[answerIndex][name] = value;
        handleUpdate('games', event.games);
    }

    const createNewGame = () => {
        let g = event.games;
        let game = new Game('', '', newGameSelector, newGameSelector==='bingo', {
            scoreWin: 5,
            scoreSpecWin: 2,
            scoreLose: 0,
            scoreSpecLose: 0,
            questions: []
        });
        let content = {};
        switch (newGameSelector) {
            case 'quiz':
                content = {
                    scoreWin: 5,
                    scoreSpecWin: 2,
                    scoreLose: 0,
                    scoreSpecLose: 0,
                    joker: {"fiftyfifty": 1},
                    questions: []        
                };
                break;
            case 'queue':
                content = {
                    scoreWin: 4,
                    scoreLose: -2,
                    skipAfterOneTry: false,
                    rounds: []
                }
            break;
            case 'bingo':
                content = {
                    scoreWin: 4,
                    scoreSpecWin: 2,
                    scoreLose: -1,
                    scoreSpecLose: 0,
                    columCount: 3,
                    questions: []
                }
            break;
        }
        g.push({...game, content: content});
        handleUpdate('games', g);
    }

    const removeGame = index => {
        let g = event.games;
        g.splice(index, 1);
        handleUpdate('games', g);
    }

    const addNewContentUnit = game => {
        switch (game.type) {
            case 'quiz':
                if(game?.content?.questions instanceof Array) {
                    game.content.questions.push({
                        question: '',
                        url: '',
                        urlType: "none",
                        answerType: "preset",
                        randomize: false,
                        presetAnswers: []
                    });
                    updateContent('questions', game.content.questions, game);
                }
                break;
            case 'queue':
                if(game?.content?.rounds instanceof Array) {
                    game.content.rounds.push({
                        answer: '',
                        hints: []
                    });
                    updateContent('rounds', game.content.rounds, game);
                }
            case 'bingo':
                if(game?.content?.questions instanceof Array) {
                    game.content.questions.push({
                        category: '',
                        question: {
                            question: '',
                            url: '',
                            urlType: "none",
                            answerType: "preset",
                            randomize: false,
                            presetAnswers: []
                        }
                    });
                    updateContent('questions', game.content.questions, game);
                }
        
            default:
                break;
        }
    }

    const addAnswerForQuizUnit = (game, questionIndex) => {
        if(game?.content?.questions instanceof Array) {
            game.content.questions[questionIndex].presetAnswers.push({
                correct: false,
                text: "",
                url: "",
                urlType: "none"
            }); 
            updateContent('questions', game.content.questions, game);
        }
    }

    const addAnswerForBingoUnit = (game, questionIndex) => {
        if(game?.content?.questions instanceof Array) {
            game.content.questions[questionIndex].question.presetAnswers.push({
                correct: false,
                text: "",
                url: "",
                urlType: "none"
            }); 
            updateContent('questions', game.content.questions, game);
        }
    }

    const addHintForQueueUnit = (game, roundIndex) => {
        if(game?.content?.rounds instanceof Array) {
            game.content.rounds[roundIndex].hints.push({
                text: '',
                url: '',
                urlType: 'none'
            });
            updateContent('rounds', game.content.rounds, game);
        }
    }

    const removeQuestionForQuizUnit = (game, questionIndex) => {
        if(game?.content?.questions instanceof Array) {
            game.content.questions.splice(questionIndex, 1);
            updateContent('questions', game.content.questions, game);
        }
    }

    const removeAnswerForQuizUnit = (game, questionIndex, answerIndex) => {
        if(game?.content?.questions instanceof Array) {
            game.content.questions[questionIndex].presetAnswers.splice(answerIndex, 1);
            updateContent('questions', game.content.questions, game);
        }
    }

    const removeAnswerForBingoUnit = (game, questionIndex, answerIndex) => {
        if(game?.content?.questions instanceof Array) {
            game.content.questions[questionIndex].question.presetAnswers.splice(answerIndex, 1);
            updateContent('questions', game.content.questions, game);
        }
    }

    const removeRoundForQueueUnit = (game, roundIndex) => {
        if(game?.content?.rounds instanceof Array) {
            game.content.rounds.splice(roundIndex, 1);
            updateContent('rounds', game.content.rounds, game);
        }
    }

    const removeHintForQueueUnit = (game, roundIndex, hintIndex) => {
        if(game?.content?.rounds instanceof Array) {
            game.content.rounds[roundIndex].hints.splice(hintIndex, 1);
            updateContent('rounds', game.content.rounds, game);
        }
    }

    const renderGame = (game, index) => {
        if(focusedGame === index) {
            switch (game.type) {
                case 'quiz':
                    return(
                        <li>
                            <input 
                                type={"text"}
                                value={game.title}
                                placeholder="Title"
                                onChange={e => updateGame("title", e.target.value, game)}
                                className="double"
                            ></input>
                            <textarea
                                value={game.description}
                                placeholder="description"
                                onChange={e => updateGame("description", e.target.value, game)}
                                className="double"
                            ></textarea>
                            <label>Score Win</label>
                            <input 
                                type={"number"}
                                value={game.content?.scoreWin}
                                placeholder="Score Win"
                                onChange={e => updateContent("scoreWin", e.target.value, game)}
                                className="double"
                            ></input>
                            <label>Score Spec Win</label>
                            <input 
                                type={"number"}
                                value={game.content?.scoreSpecWin}
                                placeholder="Score Spec Win"
                                onChange={e => updateContent("scoreSpecWin", e.target.value, game)}
                                className="double"
                            ></input>
                            <label>Score Lose</label>
                            <input 
                                type={"number"}
                                value={game.content?.scoreLose}
                                placeholder="Score Lose"
                                onChange={e => updateContent("scoreLose", e.target.value, game)}
                                className="double"
                            ></input>
                            <label>Score Spec Lose</label>
                            <input 
                                type={"number"}
                                value={game.content?.scoreSpecLose}
                                placeholder="Score Spec Lose"
                                onChange={e => updateContent("scoreSpecLose", e.target.value, game)}
                                className="double"
                            ></input>
                            {/* only placeholder until we add more joker */}
                            <label>fiftyfifty amount</label>
                            <input 
                                type={"number"}
                                value={game.content?.joker?.fiftyfifty}
                                placeholder="Score Spec Lose"
                                onChange={e => updateContent("joker", {fiftyfifty: e.target.value}, game)}
                                className="double"
                            ></input>
                            <button onClick={() => removeGame(index)} className="small-button">-</button>
                        </li>
                    );                
                case 'bingo':
                    return(
                        <li>
                            <input 
                                type={"text"}
                                value={game.title}
                                placeholder="Title"
                                onChange={e => updateGame("title", e.target.value, game)}
                                className="double"
                            ></input>
                            <textarea
                                value={game.description}
                                placeholder="description"
                                onChange={e => updateGame("description", e.target.value, game)}
                                className="double"
                            ></textarea>
                            <label>Score Win</label>
                            <input 
                                type={"number"}
                                value={game.content?.scoreWin}
                                placeholder="Score Win"
                                onChange={e => updateContent("scoreWin", e.target.value, game)}
                                className="double"
                            ></input>
                            <label>Score Spec Win</label>
                            <input 
                                type={"number"}
                                value={game.content?.scoreSpecWin}
                                placeholder="Score Spec Win"
                                onChange={e => updateContent("scoreSpecWin", e.target.value, game)}
                                className="double"
                            ></input>
                            <label>Score Lose</label>
                            <input 
                                type={"number"}
                                value={game.content?.scoreLose}
                                placeholder="Score Lose"
                                onChange={e => updateContent("scoreLose", e.target.value, game)}
                                className="double"
                            ></input>
                            <label>Score Spec Lose</label>
                            <input 
                                type={"number"}
                                value={game.content?.scoreSpecLose}
                                placeholder="Score Spec Lose"
                                onChange={e => updateContent("scoreSpecLose", e.target.value, game)}
                                className="double"
                            ></input>
                            <label>Colum Count</label>
                            <input 
                                type={"number"}
                                value={game.content?.columCount}
                                placeholder="Colum Count"
                                onChange={e => updateContent("columCount", e.target.value, game)}
                                className="double"
                            ></input>
                            <button onClick={() => removeGame(index)} className="small-button">-</button>
                        </li>
                    );
                case 'queue':
                    return (
                        <li>
                            <input 
                                type={"text"}
                                value={game.title}
                                placeholder="Title"
                                onChange={e => updateGame("title", e.target.value, game)}
                                className="double"
                            ></input>
                            <textarea
                                value={game.description}
                                placeholder="description"
                                onChange={e => updateGame("description", e.target.value, game)}
                                className="double"
                            ></textarea>
                            <label>Score Win</label>
                            <input 
                                type={"number"}
                                value={game.content?.scoreWin}
                                placeholder="Score Win"
                                onChange={e => updateContent("scoreWin", e.target.value, game)}
                                className="double"
                            ></input>
                            <label>Score Lose</label>
                            <input 
                                type={"number"}
                                value={game.content?.scoreLose}
                                placeholder="Score Lose"
                                onChange={e => updateContent("scoreLose", e.target.value, game)}
                                className="double"
                            ></input>
                            <div>
                                <input 
                                    type="checkbox"
                                    checked={game.content?.skipAfterOneTry}
                                    onChange={e => updateContent("skipAfterOneTry", e.target.checked, game)}
                                ></input>
                                <label>skip after one try</label>
                            </div>
                            <button onClick={() => removeGame(index)} className="small-button">-</button>
                        </li>
                    );
                default:
                    return null;
            }
        } else {
            return (
                <li>
                    <h3>{game.title!=='' ? game.title : game.type}</h3>
                    <button className="small-button" onClick={() => setFocusedGame(index)}>up</button>
                </li>
            );
        }
    }

    const renderQuizAnswers = (question, questionIndex, game) => {
        return (
            <ul className="editor-main-inner-list triple">
                {question.presetAnswers.map((a, i) =>
                    <li>
                        <hr className="triple"></hr>
                        <input 
                            className="double"
                            value={a.text}
                            placeholder="Answer"
                            onChange={e => updateAnswer("text", e.target.value, questionIndex, i, game)}
                        ></input>
                        <div>
                            <input 
                                type="checkbox"
                                checked={a.correct}
                                onChange={e => updateAnswer("correct", e.target.checked, questionIndex, i, game)}
                            ></input>
                            <label>correct</label>
                            <button onClick={() => removeAnswerForQuizUnit(game, questionIndex, i)} className="small-button">-</button>
                        </div>
                        <input 
                            className="double"
                            value={a.url}
                            placeholder="URL"
                            onChange={e => updateAnswer("url", e.target.value, questionIndex, i, game)}
                        ></input>
                        <select 
                            value={a.urlType}
                            onChange={e => updateAnswer("urlType", e.target.value, questionIndex, i, game)}    
                        >
                            <option value={'none'}>none</option>
                            <option value={'image'}>image</option>
                            <option value={'video'}>video</option>
                            <option value={'audio'}>audio</option>
                            <option value={'iframe'}>iframe</option>
                        </select>
                    </li>
                )}
            </ul>
        );
    }

    const renderQueueHints = (round, questionIndex, game) => {
        return (
            <ul className="editor-main-inner-list triple">
                {round.hints.map((a, i) =>
                    <li>
                        <hr className="triple"></hr>
                        <input 
                            className="double"
                            value={a.text}
                            placeholder="Hint"
                            onChange={e => updateHint("text", e.target.value, questionIndex, i, game)}
                        ></input>
                        <button onClick={() => removeHintForQueueUnit(game, questionIndex, i)} className="small-button">-</button>
                        <input 
                            className="double"
                            value={a.url}
                            placeholder="URL"
                            onChange={e => updateHint("url", e.target.value, questionIndex, i, game)}
                        ></input>
                        <select 
                            value={a.urlType}
                            onChange={e => updateHint("urlType", e.target.value, questionIndex, i, game)}    
                        >
                            <option value={'none'}>none</option>
                            <option value={'image'}>image</option>
                            <option value={'video'}>video</option>
                            <option value={'audio'}>audio</option>
                            <option value={'iframe'}>iframe</option>
                        </select>
                    </li>
                )}
            </ul>
        );
    }

    const renderBingoAnswers = (question, questionIndex, game) => {
        return (
            <ul className="editor-main-inner-list triple">
                {question.presetAnswers.map((a, i) =>
                    <li>
                        <hr className="triple"></hr>
                        <input 
                            className="double"
                            value={a.text}
                            placeholder="Answer"
                            onChange={e => updateAnswerForBingo("text", e.target.value, questionIndex, i, game)}
                        ></input>
                        <div>
                            <input 
                                type="checkbox"
                                checked={a.correct}
                                onChange={e => updateAnswerForBingo("correct", e.target.checked, questionIndex, i, game)}
                            ></input>
                            <label>correct</label>
                            <button onClick={() => removeAnswerForBingoUnit(game, questionIndex, i)} className="small-button">-</button>
                        </div>
                        <input 
                            className="double"
                            value={a.url}
                            placeholder="URL"
                            onChange={e => updateAnswerForBingo("url", e.target.value, questionIndex, i, game)}
                        ></input>
                        <select 
                            value={a.urlType}
                            onChange={e => updateAnswerForBingo("urlType", e.target.value, questionIndex, i, game)}    
                        >
                            <option value={'none'}>none</option>
                            <option value={'image'}>image</option>
                            <option value={'video'}>video</option>
                            <option value={'audio'}>audio</option>
                            <option value={'iframe'}>iframe</option>
                        </select>
                    </li>
                )}
            </ul>
        );
    }

    const renderGameEditList = game => {
        switch (game.type) {
            case 'quiz':
                return (
                    <ul className="editor-main-list">
                        <li>
                            <div></div>
                            <div></div>
                            <button className="normal-button editor-add-button" onClick={() => addNewContentUnit(game)}>Add</button>
                        </li>
                        {game.content.questions.map((a, i) => 
                            <li>
                                <input 
                                    className="double"
                                    value={a.question}
                                    onChange={e => updateQuestion('question', e.target.value, i, game)}
                                    placeholder="question">
                                </input>
                                <div>
                                    <button className="small-button" onClick={() => removeQuestionForQuizUnit(game, i)}>-</button>
                                    <button className="small-button" onClick={() => addAnswerForQuizUnit(game, i)}>+</button>
                                </div>
                                <input 
                                    className="double"
                                    value={a.url}
                                    placeholder="URL"
                                    onChange={e => updateQuestion('url', e.target.value, i, game)}>
                                </input>
                                <select value={a.urlType} onChange={e => updateQuestion('urlType', e.target.value,i ,game)}>
                                    <option value={'none'}>none</option>
                                    <option value={'image'}>image</option>
                                    <option value={'video'}>video</option>
                                    <option value={'audio'}>audio</option>
                                    <option value={'iframe'}>iframe</option>
                                </select>
                                {renderQuizAnswers(a, i, game)}
                            </li>
                        )}
                    </ul>
                );
            case 'queue':
                return (
                    <ul className="editor-main-list">
                        <li>
                            <div></div>
                            <div></div>
                            <button className="normal-button editor-add-button" onClick={() => addNewContentUnit(game)}>Add</button>
                        </li>
                        {game.content.rounds.map((a, i) => 
                            <li>
                                <input 
                                    className="double"
                                    value={a.answer}
                                    onChange={e => updateRound('answer', e.target.value, i, game)}
                                    placeholder="answer">
                                </input>
                                <div>
                                    <button className="small-button" onClick={() => removeRoundForQueueUnit(game, i)}>-</button>
                                    <button className="small-button" onClick={() => addHintForQueueUnit(game, i)}>+</button>
                                </div>
                                {renderQueueHints(a, i, game)}
                            </li>
                        )}
                    </ul>
                );
            case 'bingo':
                return(
                    <ul className="editor-main-list">
                        <li>
                            <div></div>
                            <div></div>
                            <button className="normal-button editor-add-button" onClick={() => addNewContentUnit(game)}>Add</button>
                        </li>
                        {game.content.questions.map((a, i) => 
                            <li>
                                <input 
                                    className="double"
                                    value={a.question.category}
                                    onChange={e => updateQuestion('category', e.target.value, i, game)}
                                    placeholder="category">
                                </input>
                                <input 
                                    className="double"
                                    value={a.question.question}
                                    onChange={e => updateQuestionForBingo('question', e.target.value, i, game)}
                                    placeholder="question">
                                </input>
                                <div>
                                    <button className="small-button" onClick={() => removeQuestionForQuizUnit(game, i)}>-</button>
                                    <button className="small-button" onClick={() => addAnswerForBingoUnit(game, i)}>+</button>
                                </div>
                                <input 
                                    className="double"
                                    value={a.url}
                                    placeholder="URL"
                                    onChange={e => updateQuestionForBingo('url', e.target.value, i, game)}>
                                </input>
                                <select 
                                    value={a.question.urlType}
                                    onChange={e => updateQuestionForBingo('urlType', e.target.value,i ,game)}
                                >
                                    <option value={'none'}>none</option>
                                    <option value={'image'}>image</option>
                                    <option value={'video'}>video</option>
                                    <option value={'audio'}>audio</option>
                                    <option value={'iframe'}>iframe</option>
                                </select>
                                <div>
                                    <input 
                                        type="checkbox"
                                        checked={a.question.randomize}
                                        onChange={e => updateQuestionForBingo("randomize", e.target.checked, i, game)}
                                    ></input>
                                    <label>randomize</label>
                                </div>
                                {renderBingoAnswers(a.question, i, game)}
                            </li>
                        )}
                    </ul>
                );
        
            default:
                break;
        }
    }

    const downloadEvent = () => {
        const element = document.createElement("a");
        const file = new Blob([JSON.stringify(event)], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = `${event?.title?.replace(' ', '_') ?? 'event'}.json`;
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    }

    const uploadEvent = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => {
            const result = JSON.parse(reader.result);
            setEvent(result);
        }
    }

    const saveEvent = () => {
        // storeModerationEvent(event);
        // dialog.showSaveDialog({
        //     title: 'Select the File Path to save',
        //     defaultPath: path.join(__dirname, '../assets/event.json'),
        //     // defaultPath: path.join(__dirname, '../assets/'),
        //     buttonLabel: 'Save',
        //     // Restricting the user to only Text Files.
        //     filters: [
        //         {
        //             name: 'JSON Files',
        //             extensions: ['json']
        //         }, ],
        //     properties: []
        // }).then(file => {
        //     // Stating whether dialog operation was cancelled or not.
        //     console.log(file.canceled);
        //     if (!file.canceled) {
        //         console.log(file.filePath.toString());
                  
        //         // Creating and Writing to the sample.txt file
        //         fs.writeFile(file.filePath.toString(), 
        //                      JSON.stringify(event), function (err) {
        //             if (err) throw err;
        //             console.log('Saved!');
        //         });
        //     }
        // }).catch(err => {
        //     console.log(err)
        // });
    };

    const openFile = () => {
        // dialog.showOpenDialog(function (filePaths) {
        //     if (filePaths === undefined) {
        //       return;
        //     }
      
        //     var filePath = filePaths[0];
      
        //     try {
        //         setEvent(fs.readFileSync(filePath, 'utf-8'));      
        //       console.log('Loaded file:' + filePath);
        //     } catch (err) {
        //       console.log('Error reading the file: ' + JSON.stringify(err));
        //     }
        // });
    };

    const eventSelected = e => {
        let file = e.target.files[0];
        if(file) {
            let event = null;
            const reader = new FileReader();
            reader.addEventListener('load', ev => {
                try {
                    let result = ev.target.result;
                    event = JSON.parse(result);
                    console.log(event);
                    storeModerationEvent(event);
                    // setCurrentEvent(getModerationEvent());
                } catch(err) {
                    console.log(err);
                }
            });
            reader.readAsText(file);
        }
    }

    const triggerUpload = () => {
        document.getElementById('upload').click();
    }

    return (
        <div className="lobby-mod-grid">
            <div className="mod-title">
                <div className="game-title">
                    <h1>
                        {"Editor"}
                    </h1>
                </div>
                <div style={{display: "none"}}>
                    <input 
                        type="file"
                        ref={refUpload}
                        onChange={eventSelected}
                    ></input>
                </div>
            </div>
            <div className="sidepanel panel double-r">
                <ul className="editor-side-list">
                    <li>
                        <input 
                            type={"text"} value={event.title}
                            placeholder="Title"
                            onChange={e => handleUpdate("title", e.target.value)}
                            className="double"
                        ></input>
                        <div></div>
                    </li>
                    <li>
                        <select value={newGameSelector} onChange={e => setNewGameSelector(e.target.value)}>
                            <option value={"quiz"}>quiz</option>
                            <option value={"queue"}>queue</option>
                            <option value={"bingo"}>bingo</option>
                        </select>
                        <button className="small-button" onClick={createNewGame}>+</button>
                        <div></div>
                    </li>
                    {event?.games.map(renderGame)}
                </ul>
            </div>
            <div className="panel">
                {renderGameEditList(event.games?.[focusedGame] ?? [])}
            </div>
        </div>
    );
}

export default Editor