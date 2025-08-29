import { useState } from "react";

export default function DeleteUserPage() {
    const [userID, setUserID] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        async function deleteUser() {
            try {
                const res = await fetch(`http://localhost:1018/api/users/user/${userID}`, {
                    method: 'DELETE'
                });
                if (res.ok) {
                    const data = await res.json()
                    setSuccess(data.message);
                    setTimeout(() => {setSuccess('')}, 3000);
                } else {
                    const data = await res.json();
                    throw new Error(data.error);
                }
            } catch (err) {
                setError(err.message);
                setTimeout(() => {setError('')}, 3000);
            }
        }
        deleteUser();
    }

    return(
        <div className="h-screen w-screen flex flex-col justify-center items-center">
            <h1 className="font-bold text-3xl mb-[10vh]">User Archive Page</h1>
            <form onSubmit={handleSubmit} className="space-y-5 flex flex-col" >
                <div className="space-x-4">
                    <label htmlFor="" className="font-bold" >Enter User ID:</label>
                    <input type="text" value={userID} onChange={(e) => setUserID(e.target.value)}
                    placeholder="ID" className="rounded-2xl border border-gray-400 px-[2vw] py-[0.5vh]" />
                </div>
                <button type='submit' className="rounded-3xl bg-slate-950 text-white px-5 py-1 mx-auto hover:opacity-60 active:opacity-100">Submit</button>
            </form>
            {success && <p className="font-bold">{success}</p>}
            {error && <p className="font-bold text-red-600">{error}</p>}
        </div>
    )
}