import React, { useState } from 'react';
import Login from './components/Login';
import Room from './components/Room';

function App() {
    const [roomId, setRoomId] = useState(null);

    return (
        <div className="App">
            {!roomId ? <Login setRoomId={setRoomId} /> : <Room roomId={roomId} />}
        </div>
    );
}

export default App;
