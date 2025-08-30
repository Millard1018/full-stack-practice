import { useState, useReducer, useEffect } from "react";

export default function LogIn({dashboard}) {

    const initialLog = {
        'username': '',
        'password': '',
    }

    function logReducer(state, action) {
        switch(action.type) {
            case "UPDATE FIELD" :
                return {...state, [action.payload.name] : action.payload.value}
            case "RESET FIELD" : 
                return {...state, [action.payload.name] : ''}
            case "RESET ALL" :
                return {...initialLog}
            default:
                return state
        }
    }

    const [log, dispatch] = useReducer(logReducer, initialLog, init => ({init}))

    const [success, setSuccess] = useState(null);
    const [fail, setFail] = useState(null);
    const [message, setMessage] = useState(null);
    const [token, setToken] = useState(null);

    async function refreshToken() {
        try {
            const res = await fetch('http://localhost:1018/api/users/auth/refresh', {
                method: 'POST', credentials: 'include'
            })
            if(!res.ok) return false;
            const data = await res.json();
            localStorage.setItem('token', data.access_token)
            return true;
        } catch(err) {
            return false;
        }
    }

    async function changeRolePage() {
        try {
            const res = await fetchWithAuth('http://localhost:1018/api/users/role');
            if (res.ok) {
                const data = await res.json();
                setMessage(data.message);
                setTimeout(() => {
                    setMessage(null);
                    dashboard(true);
                }, 3000);
            } else {
                const data = await res.json();
                throw new Error(data.error || 'Request Failed')
            }
        } catch (err) {
            setFail(err.message);
            setTimeout(() => {setFail(null)}, 3000);
        }
    }

    async function fetchWithAuth(url, options = {}) {
        try {
            let token = localStorage.getItem('token');
            let res = await fetch(url, {
                ...options,
                headers: {...(options.headers || {}), Authorization: `Bearer ${token}`},
                credentials: options.credentials ?? 'include'
            })
            if(res.status === 401) {
                setToken('expired  refreshing');
                setTimeout(() => {setToken(null)}, 2000);
                const ok = await refreshToken();
                if (!ok) return res;

                token = localStorage.getItem('token');
                res = await fetch(url, {
                    ...options,
                    headers: {...(options.headers || {}), Authorization: `Bearer ${token}`},
                    credentials: options.credentials ?? 'include'
                });
            }
            return res
        } catch (err) {
            console.log(err.message);
            setFail(`${err.message} occured`);
            setTimeout(() => {setFail(null)}, 3000);
        }

    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            loginHelper().catch((e) => {
            // token might be bad and refresh might fail; optional cleanup:
            console.warn(e);
            });
        }
    }, []);

    async function loginHelper() {
        try {
            const res = await fetchWithAuth('http://localhost:1018/api/users/login');
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Request Failed')
            } else {
                const data = await res.json();
                setMessage(data.message);
                setTimeout(() => {setMessage(null)}, 3000)
                if(data.role === 'superadmin') {
                    await changeRolePage()
                }
            }
        }catch (err) {
            setFail(err.message)
            setTimeout(() => {setFail(null)}, 3000)
        }
    }

    function handleSubmit(e) {
        e.preventDefault();

        async function setLogin() {
            try {
                const res = await fetch('http://localhost:1018/api/users/login', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(log),
                })
                if (!res.ok) {
                    const err = await res.json()
                    throw new Error(err.error || 'Login failed');
                }

                const data = await res.json();
                localStorage.setItem('token', data.access_token);
                setSuccess(data.message);

                setTimeout(async () => {
                    setSuccess(null);
                    dispatch({ type: 'RESET ALL' });
                    await loginHelper();
                }, 3000);
            } catch (err) {
                setFail(`${err}`);
                setTimeout(() => {setFail(null)}, 3000);
            }
        }
        setLogin();
    }
    
    return(
        <div className="h-screen w-screen flex items-center justify-center">
            <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center space-y-5 bg-white w-[30vw] h-[40vh] rounded-2xl" >
                <div className="flex space-x-5 items-center" >
                    <label htmlFor="" className="font-bold" >Username</label>
                    <input type="text" placeholder="username" value={log.username} onChange={(e) => dispatch({type: "UPDATE FIELD", payload: {name: 'username', value: e.target.value}})} 
                    className="border-2 border-gray-400 rounded-3xl px-5 py-2"/>
                </div>
                <div className="flex space-x-5 items-center" >
                    <label htmlFor="" className="font-bold">Password</label>
                    <input type="password" placeholder="password" value={log.password} onChange={(e) => dispatch({type: "UPDATE FIELD", payload: {name: 'password', value: e.target.value}})} 
                    className="border-2 border-gray-400 rounded-3xl px-5 py-2"/>  
                </div>
                <button type="submit" className="rounded-3xl bg-blue-400 active:bg-blue-600 hover:opacity-60 py-[0.8vh] px-[1.5vw] font-bold mx-auto" >Submit</button>
                {success && <p className="font-bold">{success}</p>}
                {fail && <p className="font-bold text-red-600">{fail}</p>}
                {message && <p>{message}</p>}
                {token && <p>{token}</p>}
            </form>
        </div>
    );
}