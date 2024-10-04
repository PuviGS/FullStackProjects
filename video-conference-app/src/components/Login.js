import React, { useState } from 'react';

const Login = ({ setRoomId }) => {
    const [room, setRoom] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === 'PH') {
            setRoomId(room);
        } else {
            alert('Invalid Password');
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="Enter Room ID" 
                    value={room} 
                    onChange={(e) => setRoom(e.target.value)} 
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Enter Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />
                <button type="submit">Join Room</button>
            </form>
        </div>
    );
};

export default Login;
