import { useState, useRef } from 'react';
import './ManageQuiz.scss';
import Select from 'react-select';
import { postCreateNewQuiz } from '../../../../services/apiServices';
import { toast } from 'react-toastify';

const options = [
    { value: 'EASY', label: 'EASY' },
    { value: 'MEDIUM', label: 'MEDIUM' },
    { value: 'HARD', label: 'HARD' },
];

const ManageQuiz = (props) => {
    const [name, setName] = useState('');
    const [description, setDescrition] = useState('');
    const [type, setType] = useState({ value: 'EASY', label: 'EASY' });
    const [image, setImage] = useState(null);
    const fileInputRef = useRef(null);

    const handleChangeFile = (event) => {
        if (event.target && event.target.files && event.target.files[0]) {
            setImage(event.target.files[0]);
        }
    }

    const handleSubmitQuiz = async () => {
        // validate
        if (!name || !description) {
            toast.error("Name/Description is required");
            return;
        }
        let res = await postCreateNewQuiz(description, name, type?.value, image);
        if (res && res.EC === 0) {
            toast.success(res.EM);
            setName('');
            setDescrition('');
            setImage('');
            if (fileInputRef.current) {
                fileInputRef.current.value = null;
            }
        } else {
            toast.error(res.EM);
        }
    }

    return (
        <div className="quiz-container">
            <div className="title">Manage Quizzes</div>

            <hr />

            <div className="add-new">
                <fieldset className="border rounded-3 p-3">
                    <legend className="float-none w-auto px-3">Add new Quiz</legend>
                    <div className="form-floating mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Your quiz name"
                            value={name}
                            onChange={e => setName(e.target.value)} />
                        <label>Name</label>
                    </div>
                    <div className="form-floating">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Description"
                            value={description}
                            onChange={e => setDescrition(e.target.value)} />
                        <label>Description</label>
                    </div>
                    <div className='my-3'>
                        <Select
                            defaultValue={type}
                            onChange={setType}
                            options={options}
                            placeholder={"Quiz type..."}
                        />
                    </div>
                    <div className='more-actions'>
                        <label className='mb-1'>Upload Image</label>
                        <input
                            type='file'
                            className='form-control'
                            ref={fileInputRef}
                            onChange={e => handleChangeFile(e)} />
                    </div>
                    <div>
                        <button
                            className='btn btn-warning mt-3'
                            onClick={() => handleSubmitQuiz()}>
                            Save
                        </button>
                    </div>
                </fieldset>
            </div>
            <div className="list-detail">
                table
            </div>
        </div >
    );
}

export default ManageQuiz;