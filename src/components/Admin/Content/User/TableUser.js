const TableUser = (props) => {
    const { listUsers } = props;

    return (
        <>
            <table className="table table-hover table-bordered">
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Username</th>
                        <th scope="col">Email</th>
                        <th scope="col">Role</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {listUsers && listUsers.length > 0 &&

                        listUsers.map((item, index) => {
                            return (
                                <tr key={`table-user-${index}`}>
                                    <td>{item.id}</td>
                                    <td>{item.username}</td>
                                    <td>{item.email}</td>
                                    <td>{item.role}</td>
                                    <td>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => { props.handleClickBtnView(item) }}
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => props.handleClickBtnUpdate(item)}
                                            className="btn btn-warning mx-3"
                                        >
                                            Update
                                        </button>
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => { props.handleClickBtnDelete(item) }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            )
                        })
                    }
                    {listUsers && listUsers.length === 0 &&
                        <tr>
                            <td colSpan={5}>
                                Not found data
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
        </>
    );
}

export default TableUser;