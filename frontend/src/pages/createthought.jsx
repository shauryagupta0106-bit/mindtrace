import { useState } from "react"
import API from "../services/api"

const CreateThought = ()=>{

  const [form,setForm] = useState({
    title:"",
    thought:"",
    emotion:"",
    decision:""
  })

  const handleChange = (e)=>{
    setForm({
      ...form,
      [e.target.name]:e.target.value
    })
  }

  const handleSubmit = async (e)=>{
    e.preventDefault()

    await API.post("/thoughts",form)

    alert("Thought saved")
  }

  return(

    <div className="p-10">

      <h2 className="text-2xl font-bold mb-4">
        New Decision
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          name="title"
          placeholder="Title"
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <textarea
          name="thought"
          placeholder="Thought"
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <input
          name="emotion"
          placeholder="Emotion"
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <input
          name="decision"
          placeholder="Decision"
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <button className="bg-green-500 text-white p-2">
          Save
        </button>

      </form>

    </div>
  )
}

export default CreateThought