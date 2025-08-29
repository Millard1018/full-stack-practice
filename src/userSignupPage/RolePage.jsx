import { useState } from "react";

export default function RoleChangePage() {
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('');
    const [fail, setFail] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleSubmit = () => {
        e.preventDefault()
        async function changeRole() {
            try {
                const res = await fetch('http://localhost:1018/api/users/change-role', {
                    method : 'POST',
                    headers : {'Content-Type': 'application/json'},
                    body : JSON.stringify({username: username, role: role})
                });
                if(res.ok) {
                    const data = await res.json();
                    setSuccess(data.message);
                    setTimeout(() => {setSuccess(null)}, 3000);
                }else {
                    const data = await res.json();
                    setFail(data.error)
                }
            } catch (err) {
                console.log(err);
                setFail(err);
                setTimeout(() => {setFail(null)}, 3000);
            }
        }
        changeRole();
    }
    return (
        <div className="h-screen w-screen flex flex-col items-center justify-center">
            <h1 className="font-bold text-2xl mb-[5vh]">User's Role Modification Dashboard</h1>
            <form onSubmit={handleSubmit} className="space-y-5 flex flex-col">
                <div className="flex space-x-5 items-center" >
                    <label htmlFor="" className="font-bold" >Username</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} 
                    className="border-2 border-gray-400 rounded-3xl px-5 py-2"/>
                </div>
                <div className="flex space-x-5 items-center">
                    <label className="font-bold">Chage Role:</label>
                    <select onChange={(e) => setRole(e.target.value)} className="text-xl">
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="superadmin">Superadmin</option>
                    </select>
                </div>
                <button type='submit' className="rounded-3xl bg-slate-950 text-white px-5 py-1 mx-auto">Save</button>
                {success && <p className="font-bold">{success}</p>}
                {fail && <p className="font-bold text-red-600">{fail}</p>}
            </form>
        </div>
    )
}