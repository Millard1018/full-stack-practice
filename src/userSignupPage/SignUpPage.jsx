import { useState, useReducer } from "react";
import SignUp from "./SignUpComponent";

function SignUpPage() {

    const initialFormState = {
        name : '',
        email: '',
        username: '',
        password: ''
    }
    
    function formReducer(state, action) {
        switch (action.type) {
            case "UPDATE FIELD" :
                return {...state, [action.payload.field]: action.payload.value}
            case "RESET FIELD" : 
                return {...state, [action.payload.field]: ''}
            case "RESET ALL" : 
                return {...initialFormState}
            default :
                return state
        }
    }

    const [form, dispatch] = useReducer(formReducer, initialFormState, init => ({...init}))

    const signUpInput = [
        {label: "Enter Name: ", placeholder: "name", name: "name", },
        {label: "Enter Email: ", placeholder: "email", name: "email", },
        {label: "Enter Username: ", placeholder: "username", name: "username", },
        {label: "Enter Password: ", placeholder: "password", name: "password", }
    ]

    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [blankField, setBlankField] = useState(null);

    const validName = /^[A-Za-z]{2,20}( [A-Za-z]{2,20}){0,10}$/;
    const validUsername = /^[A-Za-z0-9]{3,25}$/;
    const validEmail = /^[A-Za-z0-9._]{3,20}@[a-z]{4,15}\.[a-z]{2,15}$/;
    const validPassword = /^[A-Za-z\d@$!%*?&]{8,20}$/;

    const [invalid, setInvalid] = useState({
        name : null, username : null, email : null, password : null
    }) 


    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!form.name || !form.email || !form.username || !form.password) {
            setError("fields must not left blank");
            setTimeout(() => setError(null), 3000);
            const blanks = Object.keys(form).filter(key => !form[key])
            setBlankField(blanks)
            return;
        }

        const checkValidity = (testName, keyName) => {
            const isValid = testName.test(form[keyName].trim()) 
            if(!isValid) {
                setInvalid(prev => ({...prev, [keyName]: `invalid ${keyName}`}));
            } else {
                setInvalid(prev => ({...prev, [keyName]: null}));
            }
            return isValid
        } 
        
        const checkInput = {
            checkName: checkValidity(validName, 'name'),
            checkUsername:  checkValidity(validUsername, 'username'),
            checkEmail: checkValidity(validEmail, 'email'),
            checkPassword: checkValidity(validPassword, 'password'),
        }

        const hasInvalidInput = Object.values(checkInput).some(input => !input);

        if(hasInvalidInput) {
           return;
        }

        setBlankField(null);

        async function setUser() {
            try {
                const res = await fetch('http://localhost:1018/api/users/signups', {
                    method : 'POST',
                    headers: {'Content-Type' : 'application/json'},
                    body : JSON.stringify(form)
                });

                if(res.ok) {
                    setMessage(`User "${form.name}" added`);
                    dispatch({type: "RESET ALL"})
                    setTimeout(() => setMessage(null), 3000);
                } else {
                    const errData = await res.json();
                    setError(errData.error || 'Unknown error');
                    setTimeout(() => setError(null), 3000);
                }

            }catch (err) {
                setError("Server Error");
                setTimeout(() => setError(null), 3000);
            }    
        } 
        setUser();
    }

    return (
        <div className="flex flex-col justify-center items-center h-screen" >
            <form className="w-fit bg-white p-[3vw] py-[15vh] rounded-xl flex flex-col" onSubmit={handleSubmit} >
                {signUpInput.map(({label, placeholder, name}) => (
                    <SignUp 
                        key={name} labelText={label} password={name === "password" ? true : false} placeHolder={placeholder} value={form[name]}
                        onChange={(e) => dispatch({type: "UPDATE FIELD", payload : {field : name, value: e.target.value}})} showError={blankField?.includes(name)}  showInvalid={blankField?.includes(name) ? false : invalid[name]}
                        invalidMessage={invalid[name]}
                    />
                ))}
                <button type="submit" className="rounded-3xl bg-blue-400 active:bg-blue-600 hover:opacity-60 py-[0.8vh] px-[1.5vw] font-bold mx-auto" >Sign-up</button>
                {error && <p className="text-red-600 mt-[5vh] mx-auto" >{error}</p>}
                {message && <p className=" mt-[5vh] mx-auto" >{message}</p>}
            </form>
        </div>
    )
}

export default SignUpPage