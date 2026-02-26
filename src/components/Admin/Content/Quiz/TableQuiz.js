import { useEffect, useState } from "react";
import { getAllQuizForAdmin } from "../../../../services/apiServices";
import ModalUpdateQuiz from "./ModalUpdateQuiz";
import ModalDeleteQuiz from "./ModalDeleteQuiz";


const TableQuiz = (props) => {
    const [listQuiz, setListQuiz] = useState([]);
    const [showModalUpdate, setShowModalUpdate] = useState(false);
    const [showModalDelete, setShowModalDelete] = useState(false);

    const [dataUpdate, setDataUpdate] = useState({});
    const [dataDelete, setDataDelete] = useState({});

    useEffect(() => {
        fetchQuiz();
    }, [])

    const fetchQuiz = async () => {
        setDataUpdate({});
        setDataDelete({});
        let res = await getAllQuizForAdmin();
        if (res && res.EC === 0) {
            setListQuiz(res.DT);
        }
    }

    const handleUpdate = (quiz) => {
        setDataUpdate(quiz);
        setShowModalUpdate(true);
    }

    const handleDelete = (quiz) => {
        setDataDelete(quiz);
        setShowModalDelete(true);
    }

    return (
        <>
            <div>List Quizzes</div>
            <table className="table table-hover table-bordered my-2">
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Name</th>
                        <th scope="col">Description</th>
                        <th scope="col">Type</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {listQuiz && listQuiz.map((item, index) => {
                        return (
                            <tr key={`table-quiz-${index}`}>
                                <th>{item.id}</th>
                                <td>{item.name}</td>
                                <td>{item.description}</td>
                                <td>{item.difficulty}</td>
                                <td style={{ display: "flex", gap: "10px" }}>
                                    <button
                                        className="btn btn-warning"
                                        onClick={() => handleUpdate(item)}>Edit</button>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => handleDelete(item)}
                                    >Delete</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
                <ModalUpdateQuiz
                    show={showModalUpdate}
                    setShow={setShowModalUpdate}
                    dataUpdate={dataUpdate}
                    fetchQuiz={fetchQuiz}
                    setDataUpdate={setDataUpdate}
                />
                <ModalDeleteQuiz
                    show={showModalDelete}
                    setShow={setShowModalDelete}
                    dataDelete={dataDelete}
                    fetchQuiz={fetchQuiz}
                />
            </table >
        </>
    );
}

export default TableQuiz;