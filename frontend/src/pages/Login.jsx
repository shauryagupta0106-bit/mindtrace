import { useState } from "react"
import API from "../services/api"
import { useDispatch } from "react-redux"
import { setUser } from "../redux/authslice"
import { useNavigate } from "react-router-dom"

const Login = ()=>{

  const [form,setForm] = useState({
    email:"",
    password:""
  })

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleChange = (e)=>{
    setForm({
      ...form,
      [e.target.name]:e.target.value
    })
  }

  const handleSubmit = async (e)=>{
    e.preventDefault()

    const res = await API.post("/auth/login",form)

    dispatch(setUser(res.data))

    navigate("/dashboard")
  }

  return(

    <div className="flex items-center justify-center h-screen">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 shadow-lg rounded-lg w-80"
      >

        <h2 className="text-xl font-bold mb-4">
          Login
        </h2>

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="border p-2 w-full mb-3"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="border p-2 w-full mb-3"
        />

        <button className="bg-blue-500 text-white p-2 w-full">
          Login
        </button>

      </form>

    </div>
  )
}

export default Login