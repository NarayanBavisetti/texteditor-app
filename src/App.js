import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Chat from "./chat";
import Login from './login';

function App() {
	return (
		<div className="container-fluid  text-dark d-flex align-items-center justify-content-center" style={{height: "100vh"}}>
			<Router>
				<Routes>
					<Route index element={<Login />} />
					<Route path="/chat/:roomId" element={<Chat />} />
					<Route path="*" element={<h1>No match</h1>} />
				</Routes>
			</Router>
		</div>
	);
}

export default App;