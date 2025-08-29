export default function SignUp({password, labelText, placeHolder, value, onChange , showError, showInvalid, invalidMessage}) {

    return (
        <label className="flex mb-[3vh]" >
            <p className={`flex-1 font-bold`} >{labelText}</p>
            <input type={password ? "password" : "text"} placeHolder={placeHolder} value={value} onChange={onChange}
            className={`flex-1 border-2 ${showError || showInvalid ? " border-red-600" : " border-gray-400"} rounded-2xl py-[0.5vh] px-[2vw] ml-[2vw]`} />
            {showError ? null : showInvalid ? <p className="text-red-600 ml-[2vw]" >{invalidMessage}</p> : null}
        </label>
    )
}