import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { deleteQuizForAdmin } from '../../../../services/apiServices';
import { toast } from 'react-toastify';

const ModalDeleteQuiz = (props) => {
    const { show, setShow, dataDelete } = props;

    const handleClose = () => {
        setShow(false);
    }

    const handleSubmitDeleteQuiz = async () => {
        let data = await deleteQuizForAdmin(dataDelete.id);
        if (data && data.EC === 0) {
            toast.success(data.EM);
            handleClose();
            await props.fetchQuiz();
        }
        if (data && data.EC !== 0) {
            toast.error(data.EM);
        }
    }

    return (
        <>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete the Quiz?</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure to delete this Quiz. ID =
                    <strong>
                        {dataDelete && dataDelete.id
                            ? dataDelete.id
                            : ""}
                    </strong>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleSubmitDeleteQuiz}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalDeleteQuiz;