import { useState, useEffect } from "react";

export default function UserTable() {
    const [users, setUsers] = useState(null);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch('http://localhost:1018/api/users/signups');
                if (!res.ok) throw new Error('Server not found');
                const data = await res.json();
                if (data.length === 0) {
                    setMessage("DB contains no users.");
                } else {
                    setUsers(data);
                    setMessage(null);
                }
            } catch (err) {
                setMessage(`Server Error: ${err.message}`)
            }
        }
        getUser();
    }, [])

    return (
        <div className="h-[200vh]" >
            <h1 className="text-center font-bold text-2xl mb-[10vh]" >Table of Users</h1>
            <div className=" h-[50vh] w-[50.1vw] mx-auto" >
                <table className="border-collapse shadow-2xl text-center w-[50vw] rounded-2xl overflow-hidden" >
                    <thead className="sticky top-0 bg-blue-400" >
                        <tr className="" >
                            <td >Name</td>
                            <td>Username</td>
                            <td>Email</td>
                        </tr>
                    </thead>
                    <tbody>
                        {users?.map(user => (
                            <tr key={user._id} className="h-[5vh] hover:bg-blue-300 hover:text-white">
                                <td className="">{user.name}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        {message && (<p className="text-red-600 font-bold" >{message}</p>)}
        </div>
    );
}