import React, { useState } from 'react';
import { FaRobot } from 'react-icons/fa';
import Chat from './components/chat/Chat'

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleDocumentClick = (e) => {
    if (!e.target.closest('.floating-button') && !e.target.closest('.chat-container')) {
      setIsChatOpen(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">¡Reserva tus turnos de manera inteligente!</h1>
      <h2 className="text-xl text-gray-600 mb-8">Un chatbot avanzado para agendar citas en diferentes industrias.</h2>
      <div>
        <button className="floating-button" onClick={toggleChat}>
          <FaRobot />
        </button>
        {isChatOpen && <Chat />}
      </div>
    </div>
  );
}

export default App;
