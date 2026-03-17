import { useEffect,useState } from "react"
import API from "../services/api"
import ThoughtTimeline from "../components/thoughttimeline"
import { calculateAnalytics } from "../utils/analytics"

const Dashboard = ()=>{

  const [thoughts,setThoughts] = useState([])

  useEffect(()=>{

    const fetchThoughts = async ()=>{
      const res = await API.get("/thoughts")
      setThoughts(res.data)
    }

    fetchThoughts()

  },[])

  const analytics = calculateAnalytics(thoughts)

  return(

    <div className="p-10">

      <h1 className="text-3xl font-bold mb-6">
        MindTrace Dashboard
      </h1>

      <div className="grid grid-cols-3 gap-6 mb-10">

        <div className="bg-white shadow p-4">
          Total Thoughts: {analytics.total}
        </div>

        <div className="bg-white shadow p-4">
          Success: {analytics.success}
        </div>

        <div className="bg-white shadow p-4">
          Success Rate: {analytics.successRate.toFixed(1)}%
        </div>

      </div>

      <ThoughtTimeline thoughts={thoughts}/>

    </div>
  )
}

export default Dashboard