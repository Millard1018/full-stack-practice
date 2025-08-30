import { useState, useEffect } from "react";
import { StepForward, StepBack } from 'lucide-react'

export default function UserList() {
    const [users, setUsers] = useState([]);
    const [meta, setMeta] = useState({});
    const [error, setError] = useState('');

    useEffect(() => {
        async function getUsers() {
            try {
                const res = await fetch(`http://localhost:1018/api/users/users?page=${meta.page ?? 1}&limit=${meta.limit ?? 10}&name=a&sortBy=username&order=asc`)
                if(res.ok) {
                    const data = await res.json();
                    if (data.users.length === 0) return setError('DB contains 0 users');
                    setUsers(data.users)
                    setMeta({
                        page: parseInt(data.page), limit: parseInt(data.limit), total: data.total, totalPages: data.totalPages
                    });
                } else {
                    throw new Error('Something went wrong')
                }
            } catch (err) {
                console.log(err.message);
                setError(err.message);
            } 
        }
        getUsers();
    }, [meta.page, meta.limit])

    return (
        <div>
            <ul>
                <li>Page: {meta.page}</li>
                <li>Limit: {meta.limit}</li>
                <li>Total: {meta.total}</li>
                <li>Total Pages: {meta.totalPages}</li>
                <li>Users: {users?.map(user => (
                    <ul key={user._id} className='flex space-x-2' >
                        <li>id: {user._id}</li>
                        <li>name: {user.name}</li>
                        <li>username: {user.username}</li>
                        <li>email: {user.email}</li>
                        <li>role: {user.role}</li>
                    </ul>
                ))}
                </li>
            </ul>
                <div className="w-screen flex justify-center space-x-[5vw]" > Page
                    <button onClick={() => setMeta((prev) => ({...prev, page: prev.page-1}))} > <StepBack size={56} className=" hover:bg-slate-800 active:bg-slate-600" /> </button>
                    <button onClick={() => setMeta((prev) => ({...prev, page: prev.page+1}))}> <StepForward size={56} className=" hover:bg-slate-800 active:bg-slate-600" /> </button>
                </div>
                <div className="w-screen flex justify-center space-x-[5vw]" > Limit
                    <button onClick={() => setMeta((prev) => ({...prev, limit: prev.limit-1}))} > <StepBack size={56} className=" hover:bg-slate-800 active:bg-slate-600" /> </button>
                    <button onClick={() => setMeta((prev) => ({...prev, limit: prev.limit+1}))}> <StepForward size={56} className=" hover:bg-slate-800 active:bg-slate-600" /> </button>
                </div>
            {error && <p>{error}</p>}
        </div>
    )
}