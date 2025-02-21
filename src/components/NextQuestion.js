
function NextQuestion({ dispatch , answer , index , numQuestion }) {
    if(answer === null) return null ;
    if(index < numQuestion - 1) return (
        <button className="btn btn-ui" onClick={()=>dispatch({ type : 'nextQuestion'})}>Next</button>
    )
    if(index === numQuestion - 1) return (
        <button className="btn btn-ui" onClick={()=>dispatch({ type : 'finish'})}>Result</button>
    )
}

export default NextQuestion
