import { useEffect, useState } from "react";
import Select from "react-select";
import './QuizQA.scss';
import { getAllQuizForAdmin, getQuizWithQA, postCreateNewAnswerForQuestion, postCreateNewQuestionForQuiz, postUpsertQA } from "../../../../services/apiServices";
import { FaPlusCircle } from "react-icons/fa";
import { FaMinusCircle } from "react-icons/fa";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { AiOutlineMinusCircle } from "react-icons/ai";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import _, { toFinite } from 'lodash';
import Lightbox from "yet-another-react-lightbox";

const QuizQA = () => {

    const initQuestions = [
        {
            id: uuidv4(),
            description: '',
            imageFile: '',
            imageName: '',
            answers: [
                {
                    id: uuidv4(),
                    description: '',
                    isCorrect: false
                }
            ]
        }
    ]

    const [listQuiz, setListQuiz] = useState([]);
    const [isPreviewImage, setIsPreviewImage] = useState(false);
    const [dataImagePreview, setDataImagePreview] = useState("");
    const [selectedQuiz, setSelectedQuiz] = useState({});
    const [questions, setQuestions] = useState(initQuestions);

    useEffect(() => {
        fetchQuiz();
    }, [])

    useEffect(() => {
        if (selectedQuiz && selectedQuiz.value) {
            fetchQuizWithQA();
        }
    }, [selectedQuiz]);

    function urltoFile(url, filename, mimeType) {
        if (url.startsWith('data:')) {
            var arr = url.split(','),
                mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[arr.length - 1]),
                n = bstr.length,
                u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            var file = new File([u8arr], filename, { type: mime || mimeType });
            return Promise.resolve(file);
        }
        return fetch(url)
            .then(res => res.arrayBuffer())
            .then(buf => new File([buf], filename, { type: mimeType }));
    }

    const fetchQuizWithQA = async () => {
        let res = await getQuizWithQA(selectedQuiz.value);
        console.log('check', res);
        if (res && res.EC === 0) {
            // convert base64 to file object
            let newQA = [];
            for (let i = 0; i < res.DT.qa.length; i++) {
                let q = res.DT.qa[i];
                if (q.imageFile) {
                    q.imageName = `Question-${q.id}.png`;
                    q.imageFile =
                        await urltoFile(`data:image/png;base64,${q.imageFile}`, `Question-${q.id}.png`, 'image/png')
                }
                newQA.push(q);
            }
            setQuestions(newQA);
            console.log('check new', newQA);

        }
    }

    const fetchQuiz = async () => {
        let res = await getAllQuizForAdmin();
        if (res && res.EC === 0) {
            let newQuiz = res.DT.map(item => {
                return {
                    value: item.id,
                    label: `${item.id} - ${item.description}`
                }
            })
            setListQuiz(newQuiz);
        }
    }

    const handleAddRemoveQuestion = (type, id) => {
        if (type === 'ADD') {
            const newQuestion = {
                id: uuidv4(),
                description: '',
                imageFile: '',
                imageName: '',
                answers: [
                    {
                        id: uuidv4(),
                        description: '',
                        isCorrect: false
                    }
                ]
            };
            setQuestions([...questions, newQuestion]);
        }
        if (type === 'REMOVE') {
            let questionsClone = _.cloneDeep(questions);
            questionsClone = questionsClone.filter(item => item.id !== id);
            setQuestions(questionsClone);
        }
    }

    const handleAddRemoveAnswer = (type, questionId, answerId) => {
        let questionsClone = _.cloneDeep(questions);

        if (type === 'ADD') {

            const newAnswer =
            {
                id: uuidv4(),
                description: '',
                isCorrect: false
            }
            let index = questionsClone.findIndex(item => item.id === questionId);
            if (index > -1) {
                questionsClone[index].answers.push(newAnswer);
                setQuestions(questionsClone);
            }
        }
        if (type === 'REMOVE') {
            let index = questionsClone.findIndex(item => item.id === questionId);
            if (index > -1) {
                questionsClone[index].answers = questionsClone[index].answers.filter(item => item.id !== answerId);
                setQuestions(questionsClone);
            }
        }
    }

    const handleOnChangeQuestion = (type, questionId, value) => {
        if (type === "QUESTION") {
            let questionsClone = _.cloneDeep(questions);
            let index = questionsClone.findIndex(item => item.id === questionId);
            if (index > -1) {
                questionsClone[index].description = value;
                setQuestions(questionsClone);
            }
        }
    }

    const handleOnChangeFileQuestion = (questionId, event) => {
        let questionsClone = _.cloneDeep(questions);
        let index = questionsClone.findIndex(item => item.id === questionId);
        if (index > -1 && event.target && event.target.files && event.target.files[0]) {
            questionsClone[index].imageFile = event.target.files[0];
            questionsClone[index].imageName = event.target.files[0].name;
            setQuestions(questionsClone);
        }
    }

    const handleAnswerQuestion = (type, questionId, answerId, value) => {
        let questionsClone = _.cloneDeep(questions);
        let index = questionsClone.findIndex(item => item.id === questionId);
        if (index > -1) {
            questionsClone[index].answers =
                questionsClone[index].answers.map(answer => {
                    if (answer.id === answerId) {
                        if (type === 'CHECKBOX') {
                            answer.isCorrect = value;
                        }
                        if (type === 'INPUT') {
                            answer.description = value;
                        }
                    }
                    return answer;
                })
            setQuestions(questionsClone);
        }
    }

    const handleSubmitQuestionForQuiz = async () => {
        // validate quiz
        // if (_.isEmpty(selectedQuiz)) {
        //     toast.error("Please choose a quiz");
        //     return;
        // }

        // validate answer
        let isValidAnswer = true;
        let indexQuestion = 0, indexAnswer = 0;

        for (let i = 0; i < questions.length; i++) {
            let countCorrect = 0;
            for (let j = 0; j < questions[i].answers.length; j++) {
                if (questions[i].answers[j].isCorrect) countCorrect++;
                if (!questions[i].answers[j].description) {
                    isValidAnswer = false;
                    indexAnswer = j;
                    break;
                }
            }
            indexQuestion = i;
            if (countCorrect === 0) isValidAnswer = false;
            if (isValidAnswer === false) break;
        }

        if (isValidAnswer === false) {
            toast.error(`Not empty answer ${indexAnswer + 1} at Question ${indexQuestion + 1}`);
            return;
        }

        // validate question
        let isValidQuestion = true;
        let indexQuestion1 = 0;
        for (let i = 0; i < questions.length; i++) {
            if (!questions[i].description) {
                isValidQuestion = false;
                indexQuestion1 = i;
                break;
            }
        }

        if (isValidQuestion === false) {
            toast.error(`Not empty description for Question ${indexQuestion1 + 1}`);
            return;
        }

        let questionsClone = _.cloneDeep(questions);
        for (let i = 0; i < questionsClone.length; i++) {
            if (questionsClone[i].imageFile) {
                questionsClone[i].imageFile = await toBase64(questionsClone[i].imageFile);
            }
        }

        let res = await postUpsertQA({
            quizId: selectedQuiz.value,
            questions: questionsClone
        });

        // toast.success("Create questions and answers succeed!");
        // setQuestions(initQuestions);
    }

    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
    });

    const handlePreviewImage = (questionId) => {
        let questionsClone = _.cloneDeep(questions);
        let index = questionsClone.findIndex(item => item.id === questionId);
        if (index > -1) {
            setDataImagePreview(URL.createObjectURL(questionsClone[index].imageFile));
            setIsPreviewImage(true);
        }
    }

    return (
        <div className="questions-container">
            <div className="add-new-question">
                <div className="col-6 form-group">
                    <label className="mb-2">Select Quiz</label>
                    <Select
                        defaultValue={selectedQuiz}
                        onChange={setSelectedQuiz}
                        options={listQuiz}
                    />
                </div>
                <div className="mt-3 mb-2">
                    Add questions:
                </div>

                {questions && questions.length > 0 &&
                    questions.map((question, index) => {
                        return (
                            <div key={question.id} className="q-main mb-4">
                                <div className="questions-content">
                                    <div className="form-floating description">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="name@example.com"
                                            value={question.description}
                                            onChange={(event) => handleOnChangeQuestion('QUESTION', question.id, event.target.value)} />
                                        <label>Question {index + 1}'s description</label>
                                    </div>
                                    <div className="group-upload">
                                        <label htmlFor={`${question.id}`}>
                                            <MdOutlineAddPhotoAlternate className="label-upload" />
                                        </label>
                                        <input
                                            id={`${question.id}`}
                                            onChange={(event) => handleOnChangeFileQuestion(question.id, event)}
                                            type="file"
                                            hidden />
                                        <span>
                                            {question.imageName ?
                                                <span style={{ cursor: "pointer" }} onClick={() => handlePreviewImage(question.id)}>{question.imageName}</span>
                                                :
                                                '0 File is uploaded'}
                                        </span>
                                    </div>
                                    <div className="btn-add">
                                        <span onClick={() => handleAddRemoveQuestion('ADD', '')}>
                                            <FaPlusCircle className="icon-add" />
                                        </span>
                                        {questions.length > 1 &&
                                            <span onClick={() => handleAddRemoveQuestion('REMOVE', question.id)}>
                                                <FaMinusCircle className="icon-remove" />
                                            </span>
                                        }
                                    </div>
                                </div>
                                {
                                    question.answers && question.answers.length > 0 &&
                                    question.answers.map((answer, index) => {
                                        return (
                                            <div key={answer.id} className="answers-content">
                                                <input className="form-check-input iscorrect"
                                                    type="checkbox"
                                                    checked={answer.isCorrect}
                                                    onChange={(event) => handleAnswerQuestion('CHECKBOX', question.id, answer.id, event.target.checked)}
                                                />
                                                <div className="form-floating answer-name">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="name@example.com"
                                                        value={answer.description}
                                                        onChange={(event) => handleAnswerQuestion('INPUT', question.id, answer.id, event.target.value)}

                                                    />
                                                    <label>Answer {index + 1}</label>
                                                </div>
                                                <div className="btn-group">
                                                    <span onClick={() => handleAddRemoveAnswer('ADD', question.id)}>
                                                        <AiOutlinePlusCircle className="icon-add" />
                                                    </span>
                                                    {question.answers.length > 1 &&
                                                        <span onClick={() => handleAddRemoveAnswer('REMOVE', question.id, answer.id)}>
                                                            <AiOutlineMinusCircle className="icon-remove" />
                                                        </span>
                                                    }
                                                </div>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        );
                    })}

                {questions && questions.length > 0 &&
                    <div>
                        <button
                            className="btn btn-success"
                            onClick={() => handleSubmitQuestionForQuiz()}>
                            Save Questions
                        </button>
                    </div>
                }
                <Lightbox
                    open={isPreviewImage}
                    close={() => setIsPreviewImage(false)}
                    slides={[
                        { src: dataImagePreview }
                    ]}
                    render={{
                        buttonPrev: () => null,
                        buttonNext: () => null,
                        iconPrev: () => null,
                        iconNext: () => null,
                    }}
                    carousel={{
                        finite: true,
                        preload: 0,
                        spacing: 0,
                        padding: 0,
                    }}
                />
            </div>
        </div >
    );
}

export default QuizQA;