const userInput = '<img src=x onerror=alert("xss") />'

export default function XssPreventionExample() {
  return (
    <div className="demo-stack">
      <p className="status-box">
        React escapes this text safely: {userInput}
      </p>
      <p className="status-box">
        Avoid rendering untrusted HTML with dangerouslySetInnerHTML.
      </p>
    </div>
  )
}
