import Select from 'react-select';
import { useState, useEffect } from 'react';
import { getAllQuizForAdmin, getAllUsers, postAssignQuiz } from '../../../../services/apiServices';
import { toast } from 'react-toastify';

const AssignQuiz = (props) => {
    const [listUser, setListUser] = useState([]);
    const [selectedUser, setSelectedUser] = useState({});
    const [listQuiz, setListQuiz] = useState([]);
    const [selectedQuiz, setSelectedQuiz] = useState({});

    useEffect(() => {
        fetchQuiz();
        fetchUser();
    }, [])

    const fetchQuiz = async () => {
        let res = await getAllQuizForAdmin();
        if (res && res.EC === 0) {
            let newQuiz = res.DT.map(item => {
                return {
                    value: item.id,
                    label: `${item.id} - ${item.name}`
                }
            })
            setListQuiz(newQuiz);
        }
    }

    const fetchUser = async () => {
        let res = await getAllUsers();
        if (res && res.EC === 0) {
            let users = res.DT.map(user => {
                return {
                    value: user.id,
                    label: `${user.id} - ${user.username} - ${user.email}`
                }
            })
            setListUser(users);
        }
    }

    const handleAssign = async () => {
        const res = await postAssignQuiz(selectedQuiz.value, selectedUser.value);
        if (res && res.EC === 0) {
            toast.success(res.EM);
        } else {
            toast.error(res.EM);
        }
    }

    return (
        <div className="assign-quiz-container row">
            <div className="col-6 form-group">
                <label className="mb-2">Select Quiz:    </label>
                <Select
                    defaultValue={selectedQuiz}
                    onChange={setSelectedQuiz}
                    options={listQuiz}
                />
            </div>
            <div className="col-6 form-group">
                <label className="mb-2">Select User:</label>
                <Select
                    defaultValue={selectedUser}
                    onChange={setSelectedUser}
                    options={listUser}
                />
            </div>
            <div>
                <button
                    onClick={() => handleAssign()}
                    className='btn btn-primary mt-3'
                >
                    Assign
                </button>
            </div>
        </div>
    );
}

export default AssignQuiz;