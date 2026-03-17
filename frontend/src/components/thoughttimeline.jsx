const ThoughtTimeline = ({ thoughts }) => {

  return (

    <div className="border-l-2 border-gray-300 pl-6">

      {thoughts.map((t) => (

        <div
          key={t._id}
          className="mb-6"
        >

          <div className="text-sm text-gray-500">
            {new Date(t.createdAt).toLocaleDateString()}
          </div>

          <div className="font-bold">
            {t.decision}
          </div>

          <div className="text-blue-600">
            Emotion: {t.emotion}
          </div>

          <div className="text-green-600">
            Outcome: {t.resultType}
          </div>

        </div>

      ))}

    </div>

  )

}

export default ThoughtTimeline